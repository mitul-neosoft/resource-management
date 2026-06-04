# Resource Management Portal

Full-stack employee resource portal built with Next.js (App Router), TypeScript, Mantine UI, MongoDB, and JWT authentication.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/resource-management
JWT_SECRET=your-secure-jwt-secret
```

3. Start MongoDB locally (if not using Atlas).

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login (sets JWT cookie) |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/dashboard` | Dashboard stats |
| GET/POST | `/api/skills` | List/create skills |
| PUT/DELETE | `/api/skills/[id]` | Update/delete skill |
| GET/POST | `/api/jobs` | List/create jobs |
| PUT/DELETE | `/api/jobs/[id]` | Update/delete job |
| GET/POST | `/api/learning` | List/create courses |
| PUT/DELETE | `/api/learning/[id]` | Update/delete course |

## Notes

- In development, `POST /api/auth/forgot-password` returns a `resetToken` in the response for testing without email.
- Jobs and learning courses are auto-seeded on first access when collections are empty.
- Protected routes: `/dashboard`, `/jobs`, `/learning`
