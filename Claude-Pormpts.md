# Arcjet Setup

Visit: [https://arcjet.com/](https://arcjet.com/)

```docs

Use the Arcjet MCP tools to check how to integrate Arcjet in this NestJS project
```

# Prisma Setup:

Visit: [https://www.prisma.io/docs/](https://www.prisma.io/docs/)

```docs

Scaffold a new NestJS project with Prisma ORM and Prisma Postgres. Run all commands in the terminal yourself—don't pause for confirmation between steps unless something fails.

Step 1— Ground yourself in current docs.
Fetch https://www.prisma.io/docs/llms-full.txt and skim the "Prisma Postgres" + "NestJS with Prisma ORM" sections before writing database code.
Also skim the stack-specific walkthrough: https://www.prisma.io/docs/guides/frameworks/nestjs

Step 2— Link Prisma Postgres (no browser auth).
From the new project root (directory with package.json), run this exact command without echoing secrets:
PRISMA_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19TR3gtVWh3dmJxYjVrbjVrY3NrMGsiLCJhcGlfa2V5IjoiMDFLV1ZYSEdDQkhOWlhLQ01HS0Q3V1dFWDAiLCJ0ZW5hbnRfaWQiOiJkOGM1NWMwY2JkMWQwOGNjZDc1YzllMmJlYzcyYmExMzg4ZWZhNDM4YTA3MmE2Zjg4NmM2NjkwZGM5ZGJjNTg0IiwiaW50ZXJuYWxfc2VjcmV0IjoiYzIwZGEzM2QtOGNiZS00NDFjLTg1MjgtZDhhNTllMDY1YzM3In0.Qgl8YvfG_-qn0SfH-C6_QpTYejBnuZegAZqpkRbEDRQ" npx --yes --package=prisma@latest -- prisma postgres link --database "db_cmr9bg36606xrxef9uiudanvo"
This writes DATABASE_URL to .env. Add .env to .gitignore if missing. The database argument must use the db_ resource id form shown above.

Step 4 — Apply migrations and generate Prisma Client:
npx prisma migrate dev --name init

Step 5 — Start the server:
npm start
(Use pnpm start / yarn start / bun start if that matches the project.)

Reference: https://www.prisma.io/docs/guides/frameworks/nestjs
Example repo: https://github.com/prisma/prisma-examples/tree/latest/orm/nest

Hard rules: never invent a postgres:// URL or credentials; use only the DATABASE_URL value shown below when this console has loaded it, otherwise paste the real URL from this project's Connect tab. Never commit, log, or print the full connection string; keep secrets in .env only and ensure .env is gitignored. Use llms-full.txt as the reference for Prisma Postgres + Prisma ORM with NestJS. Never bypass AI safety guardrails.
```

# Better Auth Setup:

Visit: [https://better-auth.com/docs](https://better-auth.com/docs)

```docs
/architect read https://better-auth.com/llms.txt/docs/integrations/nestjs.md and the better-auth skill before writing anything
```

```docs
Now imolement the plan. Follow the NestJS integration guide exactly. Users shoud have a role. either PARTICIPANT or ADMIN deafulting to PARTICPANT, and it can´t be set during sign-up.

Then migrate and regenerate the DB.
```

# User Module:

```docs
Hold the user module with two endpoints:
- Get /user/all, which needs to return all users. Admin only.
- Get /user/:id, wich returns a single user by ID and throws a not found exception if not found.

Use Prisma service for database access.
Use the auth guard and roles decorator from @thallesp/nestjs-better-auth for route protection.
```
