import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const jobCreateSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(z.string()).default([]),
  experienceRequired: z.string().min(1),
  openings: z.number().int().positive().default(1),
  status: z.enum(["open", "closed"]).default("open"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional(),
  duration: z.string().optional(),
  type: z.string().optional(),
});

export const jobUpdateSchema = jobCreateSchema.partial();

export const benchCandidateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  skills: z.array(z.string()).default([]),
  experience: z.union([z.string(), z.number()]),
  location: z.string().min(1),
  benchDays: z.number().int().min(0).default(0),
  noticePeriodDays: z.number().int().min(0).default(0),
  status: z.string().default("Active"),
  role: z.string().optional(),
  assignedJobId: z.string().optional().nullable(),
  assignedCourseId: z.string().optional().nullable(),
  availability: z.string().optional(),
});

export const courseCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  duration: z.string().min(1),
});

export const courseAssignmentSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  progress: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
});

export const allocationSchema = z.object({
  candidateId: z.string().min(1),
  jobId: z.string().min(1),
});

export const nudgeSchema = z.object({
  userId: z.string().optional(),
  candidateId: z.string().optional(),
  courseAssignmentId: z.string().optional(),
  message: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1),
});
