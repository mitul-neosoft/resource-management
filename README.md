# Resource Management Portal

Dual-role full-stack portal: **USER** (employee) and **RESOURCE_MANAGER** (RM).

## Tech Stack

- Next.js 16 (App Router), TypeScript, Mantine UI
- MongoDB + Mongoose
- JWT auth (httpOnly cookies + role cookie)
- Zod validation, repository + service layers
- Excel upload (`xlsx`) for bench candidates

## Setup

```bash
npm install
```

`.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/resource-management
JWT_SECRET=your-secure-jwt-secret
```

```bash
npm run dev
```

## Roles

| Email | Role |
|-------|------|
| `akash1111@yopmail.com` | `RESOURCE_MANAGER` (auto-assigned) |
| Any other email | `USER` (auto-assigned on register) |

Registration never asks for role.

## Portals

### USER (`/dashboard`, `/jobs`, `/learning`, `/dashboard/interview`, `/dashboard/assessment`)

- Dashboard: welcome, skills, applied jobs, learning, motivation
- Job marketplace with apply
- Course assignments & progress

### RESOURCE MANAGER (`/rm/dashboard`, `/rm/bench`, `/rm/jobs`, `/rm/lnd`, `/rm/reports`)

- Overview with summary cards, critical bench, urgent jobs, allocations
- Bench candidate CRUD + Excel upload
- Job CRUD, close, skill/experience matching, allocate
- L&D: courses, assign, nudge
- Reports & analytics

## Key APIs

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register (auto role) |
| `POST /api/auth/login` | Login + cookies |
| `GET /api/auth/me` | Current user |
| `GET/POST /api/jobs` | List/create jobs |
| `GET /api/jobs/:id/matches` | Matching engine |
| `POST /api/allocations` | Allocate candidate to job |
| `GET/POST /api/bench-candidates` | Bench CRUD |
| `POST /api/upload/candidates` | Excel upload (.xlsx, .xls, .csv) |
| `GET/POST /api/courses` | Course catalog |
| `GET/POST /api/course-assignments` | Assignments |
| `POST /api/nudge` | Send nudge notification |
| `GET /api/reports/overview` | RM analytics |
| `GET /api/rm/dashboard` | RM dashboard data |
| `POST /api/job-applications` | USER apply to job |

## Excel Upload Columns

`name`, `email`, `skills` (comma-separated), `experience`, `location`, `benchDays`, `noticePeriodDays`, `status`, `role`

## Architecture

```
src/lib/
  models/          # Mongoose schemas
  repositories/    # Data access
  services/        # Business logic (matching, allocation, reports, upload)
  validations/     # Zod schemas
  api/handler.ts   # Auth + validation wrapper
src/hooks/         # useAuth, useApi
```
