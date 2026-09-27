-- Meridian uses Prisma over a private server connection, not the Supabase Data API.
-- Remove all application tables from API roles, including the RLS-bypassing service role.
DO $$
DECLARE target_role text;
BEGIN
  FOREACH target_role IN ARRAY ARRAY['anon', 'authenticated', 'service_role'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = target_role) THEN
      EXECUTE format(
        'REVOKE ALL ON TABLE "User", "Account", "Session", "VerificationToken", "Organization", "Membership", "Workspace", "WorkspaceGrant", "BusinessProfile", "Competitor", "Topic", "SearchQuery", "AuditEvent" FROM %I',
        target_role
      );
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM %I', target_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', target_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM %I', target_role);
    END IF;
  END LOOP;
END $$;

CREATE SCHEMA IF NOT EXISTS meridian_private;
REVOKE ALL ON SCHEMA meridian_private FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN REVOKE ALL ON SCHEMA meridian_private FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN REVOKE ALL ON SCHEMA meridian_private FROM authenticated; END IF;
END $$;

CREATE OR REPLACE FUNCTION meridian_private.current_user_id() RETURNS text
LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.user_id', true), '') $$;

CREATE OR REPLACE FUNCTION meridian_private.can_access_org(target_org text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (SELECT 1 FROM "Membership" m WHERE m."organizationId" = target_org AND m."userId" = meridian_private.current_user_id())
$$;

CREATE OR REPLACE FUNCTION meridian_private.can_manage_org(target_org text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (SELECT 1 FROM "Membership" m WHERE m."organizationId" = target_org AND m."userId" = meridian_private.current_user_id() AND m.role IN ('OWNER','ADMIN'))
$$;

CREATE OR REPLACE FUNCTION meridian_private.can_access_workspace(target_workspace text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Workspace" w JOIN "Membership" m ON m."organizationId" = w."organizationId"
    WHERE w.id = target_workspace AND m."userId" = meridian_private.current_user_id()
      AND (m.role IN ('OWNER','ADMIN') OR EXISTS (SELECT 1 FROM "WorkspaceGrant" g WHERE g."membershipId" = m.id AND g."workspaceId" = w.id))
  )
$$;

CREATE OR REPLACE FUNCTION meridian_private.can_edit_workspace(target_workspace text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Workspace" w JOIN "Membership" m ON m."organizationId" = w."organizationId"
    WHERE w.id = target_workspace AND m."userId" = meridian_private.current_user_id()
      AND m.role IN ('OWNER','ADMIN','ANALYST')
      AND (m.role IN ('OWNER','ADMIN') OR EXISTS (SELECT 1 FROM "WorkspaceGrant" g WHERE g."membershipId" = m.id AND g."workspaceId" = w.id))
  )
$$;

REVOKE ALL ON FUNCTION meridian_private.current_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION meridian_private.can_access_org(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION meridian_private.can_manage_org(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION meridian_private.can_access_workspace(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION meridian_private.can_edit_workspace(text) FROM PUBLIC;

ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceGrant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Competitor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Topic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SearchQuery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Organization" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Workspace" FORCE ROW LEVEL SECURITY;
ALTER TABLE "WorkspaceGrant" FORCE ROW LEVEL SECURITY;
ALTER TABLE "BusinessProfile" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Competitor" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Topic" FORCE ROW LEVEL SECURITY;
ALTER TABLE "SearchQuery" FORCE ROW LEVEL SECURITY;
ALTER TABLE "AuditEvent" FORCE ROW LEVEL SECURITY;

CREATE POLICY organization_select ON "Organization" FOR SELECT USING (meridian_private.can_access_org(id));
CREATE POLICY organization_update ON "Organization" FOR UPDATE USING (meridian_private.can_manage_org(id)) WITH CHECK (meridian_private.can_manage_org(id));
CREATE POLICY membership_select ON "Membership" FOR SELECT USING (meridian_private.can_access_org("organizationId"));
CREATE POLICY membership_write ON "Membership" FOR ALL USING (meridian_private.can_manage_org("organizationId")) WITH CHECK (meridian_private.can_manage_org("organizationId"));
CREATE POLICY workspace_select ON "Workspace" FOR SELECT USING (meridian_private.can_access_workspace(id));
CREATE POLICY workspace_insert ON "Workspace" FOR INSERT WITH CHECK (meridian_private.can_manage_org("organizationId"));
CREATE POLICY workspace_update ON "Workspace" FOR UPDATE USING (meridian_private.can_manage_org("organizationId")) WITH CHECK (meridian_private.can_manage_org("organizationId"));
CREATE POLICY workspace_delete ON "Workspace" FOR DELETE USING (meridian_private.can_manage_org("organizationId"));
CREATE POLICY grant_select ON "WorkspaceGrant" FOR SELECT USING (meridian_private.can_access_workspace("workspaceId"));
CREATE POLICY grant_write ON "WorkspaceGrant" FOR ALL USING (meridian_private.can_manage_org((SELECT w."organizationId" FROM "Workspace" w WHERE w.id = "workspaceId"))) WITH CHECK (meridian_private.can_manage_org((SELECT w."organizationId" FROM "Workspace" w WHERE w.id = "workspaceId")));

CREATE POLICY profile_select ON "BusinessProfile" FOR SELECT USING (meridian_private.can_access_workspace("workspaceId"));
CREATE POLICY profile_write ON "BusinessProfile" FOR ALL USING (meridian_private.can_edit_workspace("workspaceId")) WITH CHECK (meridian_private.can_edit_workspace("workspaceId"));
CREATE POLICY competitor_select ON "Competitor" FOR SELECT USING (meridian_private.can_access_workspace("workspaceId"));
CREATE POLICY competitor_write ON "Competitor" FOR ALL USING (meridian_private.can_edit_workspace("workspaceId")) WITH CHECK (meridian_private.can_edit_workspace("workspaceId"));
CREATE POLICY topic_select ON "Topic" FOR SELECT USING (meridian_private.can_access_workspace("workspaceId"));
CREATE POLICY topic_write ON "Topic" FOR ALL USING (meridian_private.can_edit_workspace("workspaceId")) WITH CHECK (meridian_private.can_edit_workspace("workspaceId"));
CREATE POLICY query_select ON "SearchQuery" FOR SELECT USING (meridian_private.can_access_workspace("workspaceId"));
CREATE POLICY query_write ON "SearchQuery" FOR ALL USING (meridian_private.can_edit_workspace("workspaceId")) WITH CHECK (meridian_private.can_edit_workspace("workspaceId"));
CREATE POLICY audit_select ON "AuditEvent" FOR SELECT USING (meridian_private.can_access_org("organizationId") AND ("workspaceId" IS NULL OR meridian_private.can_access_workspace("workspaceId")));
CREATE POLICY audit_insert ON "AuditEvent" FOR INSERT WITH CHECK (meridian_private.can_access_org("organizationId") AND ("workspaceId" IS NULL OR meridian_private.can_access_workspace("workspaceId")));

COMMENT ON SCHEMA meridian_private IS 'Security-definer authorization helpers for Auth.js-backed tenant RLS.';
