import Job from "@/lib/models/Job";
import LearningCourse from "@/lib/models/LearningCourse";
import DashboardStats from "@/lib/models/DashboardStats";

export async function seedJobsIfEmpty(): Promise<void> {
  const count = await Job.countDocuments();
  if (count > 0) return;

  await Job.insertMany([
    {
      title: "Senior React Developer",
      client: "FINTECH CORP",
      location: "Remote",
      description: "Build scalable fintech dashboards with real-time data.",
      requiredSkills: ["React", "TypeScript", "Redux"],
      status: "open",
    },
    {
      title: "Full Stack Engineer",
      client: "HEALTHAI SYSTEMS",
      location: "Bangalore",
      description: "End-to-end development for healthcare analytics platform.",
      requiredSkills: ["Node.js", "React", "MongoDB"],
      status: "open",
    },
    {
      title: "AWS Cloud Architect",
      client: "RETAILX",
      location: "Remote",
      description: "Architect cloud-native microservices for e-commerce.",
      requiredSkills: ["AWS", "Terraform", "Docker"],
      status: "open",
    },
  ]);
}

export async function seedLearningForEmployee(
  employeeId: string
): Promise<void> {
  const count = await LearningCourse.countDocuments({ employeeId });
  if (count > 0) return;

  await LearningCourse.insertMany([
    {
      title: "React Advanced Patterns",
      description: "Master hooks, performance, and advanced React patterns.",
      progress: 70,
      assignedBy: "L&D Team",
      dueDate: new Date("2026-06-12"),
      employeeId,
    },
    {
      title: "Employee Bench Portal Project",
      description: "Hands-on project for internal resource portal.",
      progress: 45,
      assignedBy: "Engineering Manager",
      dueDate: new Date("2026-07-01"),
      employeeId,
    },
  ]);
}

export async function ensureDashboardStats(
  employeeId: string,
  defaults?: Partial<{
    benchDays: number;
    noticeDaysLeft: number;
    totalSkills: number;
    learningProgress: number;
  }>
): Promise<void> {
  const existing = await DashboardStats.findOne({ employeeId });
  if (existing) return;

  await DashboardStats.create({
    employeeId,
    benchDays: defaults?.benchDays ?? 12,
    noticeDaysLeft: defaults?.noticeDaysLeft ?? 45,
    totalSkills: defaults?.totalSkills ?? 0,
    learningProgress: defaults?.learningProgress ?? 58,
  });
}
