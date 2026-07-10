<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

Foundation for building production-ready APIs with [NestJS](https://github.com/nestjs/nest). Includes all essentials already solved —
Prisma as data layer, authentication with Better Auth, protection with Arcjet
(rate limiting, bot detection, shield), structured logging with Pino, and
configuration validation with `zod` — so you can focus on adding your own
domain modules (`src/module/<name>/`) without rebuilding the base
infrastructure every time.

## Configuration

All configuration is centralized through `@nestjs/config`. Environment variables
are validated at startup with `zod` (`src/config/env.validation.ts`) — if a
required variable is missing or invalid, the app fails immediately with a
clear error instead of failing later inside a request.

### Required environment variables

| Variable             | Required | Default       | Notes                                       |
| -------------------- | -------- | ------------- | ------------------------------------------- |
| `NODE_ENV`           | no       | `development` | `development` \| `production` \| `test`     |
| `PORT`               | no       | `3000`        | HTTP port                                   |
| `DATABASE_URL`       | yes      | —             | PostgreSQL connection string                |
| `BETTER_AUTH_SECRET` | yes      | —             | Min 32 characters                           |
| `BETTER_AUTH_URL`    | yes      | —             | Base URL used by Better Auth                |
| `ARCJET_KEY`         | yes      | —             | Arcjet site key                             |
| `ARCJET_ENV`         | no       | `development` | Read directly by `@arcjet/env`, not the app |
| `ARCJET_MODE`        | no       | `LIVE`        | `LIVE` \| `DRY_RUN`, read by `@arcjet/env`  |

### Local development

Copy `.env.example` to `.env` and fill in real values:

```bash
$ cp .env.example .env
```

### How validation works

`ConfigModule.forRoot` (in `src/app.module.ts`) runs `validate()` from
`src/config/env.validation.ts` against `process.env` on boot. Each domain
(`app`, `database`, `auth`, `arcjet`) has its own typed `registerAs()` file in
`src/config/`, injected via `ConfigService` or `@Inject(xConfig.KEY)` —
no other file in the app reads `process.env` directly, with two documented
exceptions: `src/lib/auth/auth.ts` and `prisma.config.ts`, which run before
Nest's DI container exists.

### Adding a new environment variable

1. Add the field (with its `zod` rule) to `EnvironmentVariables` in
   `src/config/env.validation.ts`.
2. Expose it through the relevant `registerAs()` file in `src/config/`
   (or add a new one for a new domain).
3. Inject it via `ConfigService.get('<namespace>.<key>')` or
   `@Inject(xConfig.KEY)` — never read `process.env` directly outside
   `src/config/`.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Rule for incremental evolution project

```docs
- Extract business rules from services only when a method combines too many responsibilities. Real-world example: ChallengeService.join() already combines business validation (isActive, endDate) + persistence + error translation (P2002). That’s fine for a single rule; if it grows to 3–4 rules or is repeated in another module, then extract the validation into a pure method or function—without creating a new layer just yet.

- Centralize a pattern in src/common/ only when it’s repeated in a second module—not before. The P2002 → BadRequestException mapping in ChallengeService is a candidate: if UserService or another module needs the same thing, that’s the time to move it to a shared exception filter or helper—not now, when only one module is using it.

- To scale with new domains (notifications, payments, etc.), stick with `src/module/<name>/` as is—that’s the part that already scales well in Nest. You should only consider separating business logic from Prisma/HTTP if that logic needs to be reused outside the HTTP context (a queue worker, a cron job), not for the sake of architectural “purity.”
```
