# Resource Management Portal

Dual-role full-stack portal with Excel import, live bench age calculation, and skill-based job matching.

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
| `akash1111@yopmail.com` | `RESOURCE_MANAGER` |
| All others | `USER` |

## Excel Import (RM only)

### Bench Excel — `POST /api/rm/upload/bench`

Upload from **Bench** screen. Download template: `GET /api/rm/upload/bench/template`

Required columns:

`Employee ID`, `Name`

Optional columns:

`Manager Employee ID`, `Email`, `JD`, `Rating`, `Experience`, `Status`, `Team`, `Location`, `Details`, `Bench Days`, `Contract End Date`, `Resigned On?`, `Domestic`, `L&D Ongoing`, `Candidate Tagged On`

- **Employee ID** is the primary key — must be unique in the file and in the database
- **Manager Employee ID** links each employee to their reporting manager
- Records stored in **Users** collection (`uploadedFromBench: true`)
- Skills auto-parsed from JD (e.g. `MERN Developer` → MongoDB, Express, React, Node.js)
- `Contract End Date` or `Bench Days` → `clientContractEndDate`
- Bench age = **today − clientContractEndDate** (live, never stored)
- Notice period shown only when `Resigned On?` is set
- Imported users must **register** with their Employee ID before logging in

### Registration & Login

- Registration requires a valid **Employee ID** from the uploaded bench Excel
- Duplicate Employee IDs are rejected at registration
- Login accepts **Email** or **Employee ID**

### Jobs Excel — `POST /api/rm/upload/jobs`

Upload from **Jobs** screen. Columns:

`GroupID`, `Location`, `AddedOn`, `Active Internal Profiles`, `JD Details`

- Auto-extracts title, skills, experience from JD Details
- Runs matching engine and stores results in **Match** collection

## Matching Formula

```
score = (matchedSkills / totalJobSkills) × 100
```

## Portals

**USER:** `/dashboard`, `/jobs`, `/learning`, `/dashboard/interview`, `/dashboard/assessment`

**RM:** `/rm/dashboard`, `/rm/bench`, `/rm/jobs`, `/rm/lnd`, `/rm/reports`
