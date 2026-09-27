ALTER TABLE "Workspace" ADD COLUMN "archivedAt" TIMESTAMP(3);

CREATE INDEX "Workspace_organizationId_archivedAt_idx"
ON "Workspace"("organizationId", "archivedAt");
