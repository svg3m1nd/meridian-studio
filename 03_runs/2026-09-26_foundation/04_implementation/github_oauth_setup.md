# GitHub OAuth and First-Owner Setup

This runbook completes authentication for the development deployment without opening Meridian Studio to arbitrary GitHub accounts.

## 1. Register the GitHub OAuth app

Create an OAuth app in GitHub under **Settings > Developer settings > OAuth Apps**.

- Application name: `Meridian Studio Development`
- Homepage URL: `https://meridian-studio-snowy.vercel.app`
- Authorization callback URL: `https://meridian-studio-snowy.vercel.app/api/auth/callback/github`
- Device flow: disabled

Keep the client secret in GitHub and Vercel only. Never commit it.

## 2. Configure Vercel production variables

Add these variables to the Production environment:

| Variable | Type | Value |
| --- | --- | --- |
| `AUTH_SECRET` | Secret | A unique random value of at least 32 characters |
| `AUTH_GITHUB_ID` | Config | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | Secret | GitHub OAuth client secret |
| `AUTH_URL` | Config | `https://meridian-studio-snowy.vercel.app` |
| `APP_BASE_URL` | Config | `https://meridian-studio-snowy.vercel.app` |
| `AUTH_ALLOWED_GITHUB_LOGINS` | Config | `svg3m1nd` |
| `LOG_LEVEL` | Config | `info` |

`DATABASE_URL` remains a Secret and must continue to use the constrained `meridian_runtime` role. `DIRECT_URL` is not required in Vercel and must not be added to the runtime deployment.

Redeploy after saving the variables.

## 3. Create the Auth.js user

Sign in once at `/login` with the allowlisted GitHub account. Auth.js creates the user and account records, but the portfolio will remain empty until organization membership is bootstrapped.

## 4. Bootstrap the first owner

From `04_app`, using the local ignored `.env` that points `DIRECT_URL` at the development database, run:

```powershell
npm.cmd run bootstrap:owner -- --email=OWNER_EMAIL
```

The package command includes the required development-database confirmation flag. The script:

- finds the existing Auth.js user by email;
- creates or reuses the `fusion-vine` organization;
- creates or updates the user's `OWNER` membership; and
- records the initial bootstrap in the immutable audit log.

The operation is idempotent. It does not print or persist database passwords.

## 5. Verify

Refresh `/portfolio` and confirm the Fusion Vine workspace is visible. Then confirm:

- a non-allowlisted GitHub account cannot sign in;
- `/api/ready` reports `database: reachable`; and
- the owner can create a client workspace.
