-- Run after Prisma migrations as the Supabase postgres administrator.
-- Prerequisite: create meridian_runtime as LOGIN, NOINHERIT, and NOBYPASSRLS.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'meridian_runtime') THEN
    RAISE EXCEPTION 'Create the meridian_runtime role before applying runtime grants';
  END IF;
END $$;

GRANT USAGE ON SCHEMA public, meridian_private TO meridian_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO meridian_runtime;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO meridian_runtime;
GRANT EXECUTE ON FUNCTION meridian_private.current_user_id() TO meridian_runtime;
GRANT EXECUTE ON FUNCTION meridian_private.can_access_org(text) TO meridian_runtime;
GRANT EXECUTE ON FUNCTION meridian_private.can_manage_org(text) TO meridian_runtime;
GRANT EXECUTE ON FUNCTION meridian_private.can_access_workspace(text) TO meridian_runtime;
GRANT EXECUTE ON FUNCTION meridian_private.can_edit_workspace(text) TO meridian_runtime;

ALTER DEFAULT PRIVILEGES FOR ROLE meridian_migrate IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO meridian_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE meridian_migrate IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO meridian_runtime;
