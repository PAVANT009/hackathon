# SnapFix

AI-assisted service booking app built with Next.js, Better Auth, Prisma 7, and PostgreSQL.

## Tech Stack

- Next.js 16
- React 19
- Better Auth
- Prisma 7 (`@prisma/client`, `@prisma/adapter-pg`)
- PostgreSQL (`pg`)
- Tailwind CSS 4 + shadcn/ui
- OpenAI SDK

## Prerequisites

- Node.js 20+ (or Bun)
- PostgreSQL database (Neon/Supabase/other)

## Environment Variables

Create `.env` in project root:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

OPENAI_API_KEY="..."

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

Notes:
- `DATABASE_URL`: app runtime connection string.
- `DIRECT_URL`: Prisma CLI connection string (used by `prisma.config.ts`).

## Install

Using Bun:

```bash
bun install
```

Using npm:

```bash
npm install
```

## Prisma Setup

Generate Prisma client:

```bash
bunx prisma generate
```

Run migrations:

```bash
bunx prisma migrate dev --name init
```

If you use npm:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Run the App

Using Bun:

```bash
bun run dev
```

Using npm:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `dev`: Start dev server
- `build`: Build app
- `start`: Start production server
- `lint`: Run ESLint
- `prisma`: Prisma CLI passthrough
- `crud`: Run `src/main.ts` example script

## Project Structure

- `app/`: Routes and API handlers
- `modules/`: Feature modules (chat, dashboard, home, auth, sidebar)
- `components/`: Shared UI components
- `lib/`: Auth + Prisma runtime setup
- `prisma/`: Prisma schema and migrations

## Important Prisma 7 Detail

In this project, datasource URL is configured via `prisma.config.ts` (using `DIRECT_URL`), so `prisma/schema.prisma` does not define `url` inside `datasource`.
