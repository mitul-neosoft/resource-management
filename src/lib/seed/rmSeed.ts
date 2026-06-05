import Course from "@/lib/models/Course";
import Job from "@/lib/models/Job";
import { Types } from "mongoose";

/** Seed only courses when DB is empty — no dummy bench users or jobs */
export async function seedRmDataIfEmpty(rmUserId: string) {
  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    await Course.insertMany([
      {
        title: "React Advanced Patterns",
        description: "Master hooks, performance, and advanced React patterns.",
        duration: "8 Hours",
        createdBy: new Types.ObjectId(rmUserId),
      },
      {
        title: "System Design Basics",
        description: "Important for senior developer growth.",
        duration: "12 Hours",
        createdBy: new Types.ObjectId(rmUserId),
      },
      {
        title: "AWS Cloud Fundamentals",
        description: "Cloud skills for modern engineering roles.",
        duration: "10 Hours",
        createdBy: new Types.ObjectId(rmUserId),
      },
    ]);
  }

  await Job.countDocuments();
}
