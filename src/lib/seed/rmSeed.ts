import BenchCandidate from "@/lib/models/BenchCandidate";
import Job from "@/lib/models/Job";
import Course from "@/lib/models/Course";
import User from "@/lib/models/User";
import { Types } from "mongoose";

const BENCH_SEED = [
  {
    name: "Vikram Nair",
    email: "vikram.nair@company.com",
    role: "Java Backend Developer",
    skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL"],
    experience: "8 yrs",
    location: "Chennai",
    benchDays: 41,
    noticePeriodDays: 8,
    status: "Critical",
    availability: "Immediate",
  },
  {
    name: "Rahul Desai",
    email: "rahul.desai@company.com",
    role: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "Terraform", "CI/CD"],
    experience: "6 yrs",
    location: "Hyderabad",
    benchDays: 28,
    noticePeriodDays: 15,
    status: "Critical",
    availability: "Immediate",
  },
  {
    name: "Shubham Mohite",
    email: "shubham.mohite@company.com",
    role: "Senior Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    experience: "5 yrs",
    location: "Pune",
    benchDays: 14,
    noticePeriodDays: 46,
    status: "Active",
    availability: "Immediate",
  },
  {
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@company.com",
    role: "QA Automation Engineer",
    skills: ["Selenium", "Cypress", "Java", "Appium"],
    experience: "3.5 yrs",
    location: "Pune",
    benchDays: 9,
    noticePeriodDays: 30,
    status: "Active",
    availability: "2 weeks",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@company.com",
    role: "Data Scientist",
    skills: ["Python", "ML", "TensorFlow", "SQL"],
    experience: "4 yrs",
    location: "Bangalore",
    benchDays: 18,
    noticePeriodDays: 25,
    status: "Active",
    availability: "Immediate",
  },
  {
    name: "Anjali Verma",
    email: "anjali.verma@company.com",
    role: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "CSS", "Prototyping"],
    experience: "3 yrs",
    location: "Mumbai",
    benchDays: 5,
    noticePeriodDays: 60,
    status: "Active",
    availability: "Immediate",
  },
];

export async function seedRmDataIfEmpty(rmUserId: string) {
  const count = await BenchCandidate.countDocuments();
  if (count === 0) {
    await BenchCandidate.insertMany(BENCH_SEED);
  }

  const jobCount = await Job.countDocuments();
  if (jobCount === 0) {
    await Job.insertMany([
      {
        title: "Senior React Developer",
        company: "FinTech Corp",
        location: "Remote",
        description: "Build scalable fintech dashboards with real-time data.",
        skills: ["React", "TypeScript", "Redux"],
        experienceRequired: "4+ yrs",
        openings: 2,
        status: "open",
        priority: "High",
        duration: "6 months",
        type: "Full-time",
        createdBy: new Types.ObjectId(rmUserId),
      },
      {
        title: "Full Stack Engineer",
        company: "HealthAI Systems",
        location: "Bangalore",
        description: "End-to-end healthcare analytics platform development.",
        skills: ["Node.js", "React", "MongoDB"],
        experienceRequired: "3+ yrs",
        openings: 1,
        status: "open",
        priority: "Medium",
        duration: "1 year",
        type: "Contract",
        createdBy: new Types.ObjectId(rmUserId),
      },
      {
        title: "DevOps Lead",
        company: "RetailX",
        location: "Remote",
        description: "Lead cloud infrastructure and CI/CD modernization.",
        skills: ["AWS", "Terraform", "Docker", "Kubernetes"],
        experienceRequired: "5+ yrs",
        openings: 1,
        status: "open",
        priority: "Critical",
        duration: "8 months",
        type: "Full-time",
        createdBy: new Types.ObjectId(rmUserId),
      },
    ]);
  }

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

  const rm = await User.findById(rmUserId);
  return rm;
}
