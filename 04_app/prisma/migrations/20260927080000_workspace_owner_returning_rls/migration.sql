-- Prisma uses INSERT ... RETURNING when creating a workspace. During that
-- statement, the stable workspace lookup helper cannot see the newly inserted
-- row yet. Authorize organization owners/admins directly from organizationId;
-- delegated users continue through the existing workspace-grant helper.
DROP POLICY workspace_select ON "Workspace";

CREATE POLICY workspace_select ON "Workspace"
FOR SELECT
USING (
  meridian_private.can_manage_org("organizationId")
  OR meridian_private.can_access_workspace(id)
);
