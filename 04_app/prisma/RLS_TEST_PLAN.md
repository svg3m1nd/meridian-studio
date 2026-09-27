# RLS Integration Test Plan

Run after connecting a non-owner application role to the development database.

1. Seed two organizations, one workspace each, an Owner, Analyst, Viewer, and unrelated user.
2. Set `app.user_id` inside a transaction before every tenant query.
3. Prove Owners/Admins can access every workspace in their organization.
4. Prove Analysts/Viewers need an explicit workspace grant.
5. Prove Analysts can modify baseline records but Viewers cannot.
6. Prove no user can read or mutate another organization's workspace by guessing IDs.
7. Prove audit events cannot be updated or deleted through the application role.
8. Prove Supabase `anon`, `authenticated`, and `service_role` roles have no grants on Meridian or Auth.js tables.
9. Prove missing transaction context returns zero tenant rows rather than broad access.
10. Repeat all negative cases through Prisma and direct SQL.
11. Prove the Vercel runtime connection uses `meridian_runtime` with `rolbypassrls = false`.
