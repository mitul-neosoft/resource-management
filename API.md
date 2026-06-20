# API Documentation

Base URL: `http://localhost:3000/api`

Auth uses HTTP-only cookies (`token`). Protected routes require a valid JWT cookie.

---

## Auth

### POST `/api/auth/register`
Register a new user. Requires a valid Employee ID from bench data.

**Body:** `{ employeeId, firstName, lastName, email, password }`  
**Response:** `{ message, user: { _id, email, role } }`

### POST `/api/auth/login`
Login with email or Employee ID.

**Body:** `{ identifier, password }` — `identifier` can be email or employeeId  
**Response:** `{ message, user: { _id, email, role } }` + sets `token` cookie

### POST `/api/auth/logout`
Clears the auth cookie.

**Response:** `{ message }`

### GET `/api/auth/me`
Returns the currently authenticated user.

**Auth:** Required  
**Response:** `{ user: { _id, email, role, employeeId, firstName, lastName } }`

### POST `/api/auth/forgot-password`
Sends a password-reset email.

**Body:** `{ email }`  
**Response:** `{ message }`

### POST `/api/auth/reset-password`
Resets password using token from email.

**Body:** `{ token, password }`  
**Response:** `{ message }`

### GET `/api/auth/verify-employee-id?employeeId=<id>`
Checks if an Employee ID exists in the bench data.

**Response:** `{ valid: boolean }`

---

## User Dashboard

### GET `/api/dashboard`
Returns stats for the logged-in user (bench days, matched jobs, interviews, etc.).

**Auth:** Required  
**Response:** `{ benchDays, matchedJobs, interviews, ... }`

---

## Jobs

### GET `/api/jobs`
List all open jobs.

**Auth:** Required  
**Response:** `{ jobs: [ { _id, title, location, skills, experience, ... } ] }`

### GET `/api/jobs/[id]`
Get a single job by ID.

**Auth:** Required  
**Response:** `{ job }`

### GET `/api/jobs/[id]/matches`
Get skill-matched candidates for a job (RM only).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ job, matches: [ { score, matchedSkills, missingSkills, candidate } ] }`

### POST `/api/jobs/[id]/close`
Mark a job as closed (RM only).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ message }`

### GET `/api/jobs/matches`
Get all jobs matched for the logged-in user.

**Auth:** Required  
**Response:** `[ { job, score, matchedSkills, missingSkills } ]`

---

## Job Applications

### GET `/api/job-applications`
List all job applications for the logged-in user.

**Auth:** Required  
**Response:** `{ applications: [ { job, status, appliedAt } ] }`

### POST `/api/job-applications`
Apply for a job.

**Auth:** Required  
**Body:** `{ jobId }`  
**Response:** `{ message, application }`

---

## Bench Candidates

### GET `/api/bench-candidates`
List all bench candidates (RM only).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ candidates: [ { employeeId, name, benchDays, skills, ... } ] }`

### GET `/api/bench-candidates/[id]`
Get a single bench candidate.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ candidate }`

### PATCH `/api/bench-candidates/[id]`
Update bench candidate details.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** Partial candidate fields  
**Response:** `{ candidate }`

---

## RM — Excel Upload

### POST `/api/rm/upload/bench`
Upload bench Excel file. Accepted columns listed in README.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `multipart/form-data` with `file` field  
**Response:** `{ inserted, updated, skipped, errors }`

### GET `/api/rm/upload/bench/template`
Download the bench Excel template.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `.xlsx` file download

### POST `/api/rm/upload/jobs`
Upload jobs Excel file.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `multipart/form-data` with `file` field  
**Response:** `{ inserted, matched }`

---

## RM Dashboard

### GET `/api/rm/dashboard`
Returns RM-level stats (total bench, allocated, open jobs, etc.).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ totalBench, allocated, openJobs, ... }`

---

## Reports

### GET `/api/reports/overview`
Returns overview report data for RM.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ benchByTeam, benchByLocation, skillDistribution, ... }`

---

## Skills

### GET `/api/skills`
List all skills in the system.

**Auth:** Required  
**Response:** `{ skills: [ { _id, name } ] }`

### POST `/api/skills`
Add a new skill.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `{ name }`  
**Response:** `{ skill }`

### DELETE `/api/skills/[id]`
Delete a skill.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ message }`

---

## Allocations

### GET `/api/allocations`
List all allocations.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ allocations }`

### POST `/api/allocations`
Create a new allocation (assign candidate to job).

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `{ userId, jobId }`  
**Response:** `{ allocation }`

---

## Learning & Development

### GET `/api/learning`
List available learning courses.

**Auth:** Required  
**Response:** `{ courses }`

### GET `/api/learning/[id]`
Get a specific course.

**Auth:** Required  
**Response:** `{ course }`

### GET `/api/courses`
List all courses (RM view).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ courses }`

### POST `/api/courses`
Create a course.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `{ title, description, url, skills }`  
**Response:** `{ course }`

### PATCH `/api/courses/[id]`
Update a course.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ course }`

### DELETE `/api/courses/[id]`
Delete a course.

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ message }`

### GET `/api/course-assignments`
List course assignments for the logged-in user.

**Auth:** Required  
**Response:** `{ assignments }`

### POST `/api/course-assignments`
Assign a course to a user (RM) or self-enroll.

**Auth:** Required  
**Body:** `{ courseId, userId? }`  
**Response:** `{ assignment }`

### PATCH `/api/course-assignments/[id]`
Update assignment progress/status.

**Auth:** Required  
**Body:** `{ status, progress }`  
**Response:** `{ assignment }`

---

## Interviews

### GET `/api/interviews`
List interviews for the logged-in user.

**Auth:** Required  
**Response:** `{ interviews }`

### POST `/api/interviews`
Schedule an interview.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `{ userId, jobId, scheduledAt, interviewerName }`  
**Response:** `{ interview }`

---

## Assessments

### GET `/api/assessments`
List assessments for the logged-in user.

**Auth:** Required  
**Response:** `{ assessments }`

### POST `/api/assessments`
Submit an assessment.

**Auth:** Required  
**Body:** `{ type, answers, ... }`  
**Response:** `{ result }`

---

## Users

### GET `/api/users`
List all users (RM only).

**Auth:** Required (RESOURCE_MANAGER)  
**Response:** `{ users }`

---

## Nudge

### POST `/api/nudge`
Send a nudge notification to a bench candidate.

**Auth:** Required (RESOURCE_MANAGER)  
**Body:** `{ userId, message }`  
**Response:** `{ message }`
