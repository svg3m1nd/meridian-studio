# Supabase Development Provisioning

## Goal

Provision one development Supabase project with separate database identities for schema migrations and the running Meridian application. Meridian tenants remain organizations and workspaces inside this database; a Supabase project is an environment, not a client.

## Required separation

| Credential | Purpose | RLS behavior | Stored in Vercel |
|---|---|---|---|
| `meridian_migrate` | Prisma migrations and controlled administration | `BYPASSRLS` | No |
| `meridian_runtime` | Next.js and Auth.js runtime queries | `NOBYPASSRLS` | Yes, as `DATABASE_URL` |

Never use the migration, `postgres`, or Supabase service-role credential as `DATABASE_URL`. Doing so bypasses the tenant policies Meridian is designed to enforce.

## 1. Create the environment

1. Create a Supabase project named `meridian-development` in the closest appropriate region.
2. Store its generated project and database credentials in the password manager.
3. Do not load client data. Use synthetic tenants only.
4. In API settings, remove `public` from exposed schemas or disable the Data API while Meridian uses Prisma exclusively.

## 2. Bootstrap database users

Generate two different high-entropy passwords. In the Supabase SQL Editor, replace the two placeholders and run this once:

```sql
create user meridian_migrate
  with password '<MIGRATION_PASSWORD>' bypassrls createdb;

grant meridian_migrate to postgres;
grant create on database postgres to meridian_migrate;
grant usage, create on schema public to meridian_migrate;
grant all on all tables in schema public to meridian_migrate;
grant all on all routines in schema public to meridian_migrate;
grant all on all sequences in schema public to meridian_migrate;
alter default privileges for role postgres in schema public grant all on tables to meridian_migrate;
alter default privileges for role postgres in schema public grant all on routines to meridian_migrate;
alter default privileges for role postgres in schema public grant all on sequences to meridian_migrate;

create user meridian_runtime
  with password '<RUNTIME_PASSWORD>'
  nosuperuser nocreatedb nocreaterole noinherit nobypassrls;

alter default privileges for role meridian_migrate in schema public
  grant select, insert, update, delete on tables to meridian_runtime;
alter default privileges for role meridian_migrate in schema public
  grant usage, select on sequences to meridian_runtime;
```

Do not put either password in this repository. Percent-encode reserved URL characters when constructing connection strings.

## 3. Configure local migration access

Copy `04_app/.env.example` to `04_app/.env.local` and use Supabase **Connect** values:

```dotenv
# Supavisor transaction mode, port 6543. Runtime role; safe for Vercel functions.
DATABASE_URL="postgresql://meridian_runtime.<PROJECT_REF>:<ENCODED_RUNTIME_PASSWORD>@<POOLER_HOST>:6543/postgres?pgbouncer=true&connection_limit=1"

# Supavisor session mode, port 5432. Migration role; local/CI administration only.
DIRECT_URL="postgresql://meridian_migrate.<PROJECT_REF>:<ENCODED_MIGRATION_PASSWORD>@<POOLER_HOST>:5432/postgres"
```

Use the direct project connection instead of session mode only when the machine has IPv6 connectivity or the project has the IPv4 add-on.

## 4. Apply the reviewed schema

From `04_app`:

```powershell
npm.cmd run db:status
npm.cmd run db:deploy
```

Then run `04_app/prisma/supabase_runtime_grants.sql` in the Supabase SQL Editor as `postgres`. This gives the runtime role DML access while preserving RLS and grants access only to the private policy helper functions.

## 5. Verify the security boundary

Run these checks in the SQL Editor:

```sql
select rolname, rolsuper, rolcreaterole, rolcreatedb, rolbypassrls
from pg_roles
where rolname in ('meridian_migrate', 'meridian_runtime');

select tablename, rowsecurity, forcerowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('Organization', 'Membership', 'Workspace', 'WorkspaceGrant', 'BusinessProfile', 'Competitor', 'Topic', 'SearchQuery', 'AuditEvent')
order by tablename;
```

Expected: `meridian_runtime` has no elevated attributes; all nine tenant tables have both RLS flags enabled. Then execute `prisma/RLS_TEST_PLAN.md` before adding any real client data.

## 6. Configure Vercel staging

Add only these server-side environment variables to Preview and Production for the current staging project:

- `DATABASE_URL` — runtime transaction-pooler URL
- `APP_BASE_URL` — canonical Vercel deployment URL
- `AUTH_SECRET` — at least 32 random characters
- `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` — after the OAuth application is registered
- `LOG_LEVEL=info`

Do not add `DIRECT_URL`, database administrator credentials, or a Supabase secret/service-role key to the Vercel web application.

After redeployment:

- `/api/health` must return HTTP 200 for process liveness.
- `/api/ready` must return HTTP 200 and `database: "reachable"`.
- An unauthenticated visit to `/portfolio` must redirect to `/login`.

## Rollback

Remove the Vercel `DATABASE_URL`, rotate both database-role passwords, revoke login from the two custom users, and pause the development Supabase project. Do not delete the project until migration and RLS evidence has been exported.
