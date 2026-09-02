# E-Commerce

A full-stack e-commerce application built with React and NestJS.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Redux Toolkit + RTK Query |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (Access + Refresh tokens) |
| Payments | Stripe |
| File Storage | MinIO (S3-compatible, local dev only) |

## Project Structure

```
ecommerce/
├── frontend/          # Vite + React app
├── backend/           # NestJS + Prisma API
├── system-design.md   # Full system design (DB schema, API endpoints, etc.)
├── implement-plan.md  # Task-by-task implementation plan
└── AGENTS.md          # Agent instructions
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- MinIO (for file storage)
- Stripe account (for payments)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Configure environment variables
npm run dev
```

## API Documentation

See `system-design.md` for detailed API endpoints and database schema.

## Implementation Progress

See `implement-plan.md` for task-by-task implementation checklist.

## License

MIT
