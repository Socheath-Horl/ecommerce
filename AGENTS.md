# E-Commerce — Agent Instructions

## Communication Style

- **Explain every step like a tutor teaching a student** — break down what you're doing and why before doing it
- Use simple, clear language
- Don't assume the user knows the context — walk them through it
- **For every step, explain:**
  - **What it does** — describe the concept or code
  - **How it works** — show the mechanism or syntax
  - **Why use it** — explain the benefit or problem it solves
  - **How they work together** — show how components connect
- **Show file diff before asking permission** — let the user see what changes will be made before approving
- **Always ask for permission before creating or editing files** — never make changes without user approval

## Tech Stack

**Frontend:** Vite + React + TypeScript, Tailwind CSS + shadcn/ui, Redux Toolkit + RTK Query

**Backend:** NestJS + TypeScript, Prisma, PostgreSQL, JWT (Access + Refresh), Stripe, MinIO

## Rules

- **Project scaffolding:** Always run CLI commands to create projects (e.g., `nest new`, `npm create vite`). Never create project files from scratch.
- **Package installation:** Always install with latest compatible version. Use `npm install <package>@latest` or `npx shadcn@latest add`.
- **Imports:** Always use `@/` alias prefix for imports (e.g., `import { Button } from '@/components/ui/button'`).

## Key Commands

### Backend
```bash
cd backend
npm run build              # Compile TypeScript
npm run start:dev          # Dev server on port 3000
npx prisma migrate dev --name <name>  # Create migration
npx prisma generate        # Regenerate Prisma client
npx prisma studio          # Open DB GUI
npx prisma db seed         # Seed database
```

### Frontend
```bash
cd frontend
npm run build              # Production build
npm run dev                # Dev server on port 5173
npm run lint               # Run ESLint
npx shadcn@latest add <component>  # Add shadcn/ui component
```

## API Conventions

**Response format:** `{ success: boolean, data?: T, message?: string, error?: { code, message, details } }`

**Auth:** Bearer token in `Authorization` header. Access token short-lived (15m), refresh token in localStorage.

**Base URL:** `http://localhost:3000/api`

## Role System

| Role | Access |
|------|--------|
| GUEST | Browse products only |
| CUSTOMER | + Cart, checkout, orders, reviews, profile |
| USER | + Admin portal (limited) |
| ADMIN | + Manage users, full access |

Guards: `JwtAuthGuard` for protected routes, `RolesGuard` + `@Roles()` for role-based access.

## Database Conventions

- UUIDs for all primary keys (`@default(uuid())`)
- Slugs for URL-friendly identifiers (products, categories)
- `File` model tracks all uploads (MinIO + DB record)
- `entityType` + `entityId` pattern for polymorphic file associations
- Timestamps: `createdAt`, `updatedAt` on all models

## Running Order

When implementing phases:
1. Run `npx prisma migrate dev --name <name>` after any schema change
2. Run `npm run build` after code changes to verify compilation
3. Run `npx prisma generate` after schema changes

## Important Notes

- **No Docker for deployment** — only for local MinIO and PostgreSQL
- **Single React app** with role-based routing (`/` customer, `/admin` admin)
- **Stripe test mode** — use `4242 4242 4242 4242` for test cards
- **MinIO required** — file uploads depend on MinIO running locally (Docker on port 9000, console on 9001)
- Reference: `system-design.md` (DB schema, API endpoints), `implement-plan.md` (task checklist)
