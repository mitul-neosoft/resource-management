import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";
import { seedJobsIfEmpty } from "@/lib/seed/seedData";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    await connectDB();
    await seedJobsIfEmpty();

    const jobs = await Job.find().sort({ createdAt: -1 });
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("GET jobs error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { title, client, location, description, requiredSkills, status } =
      await request.json();

    if (!title || !client || !location || !description) {
      return NextResponse.json(
        { error: "Title, client, location, and description are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const job = await Job.create({
      title,
      client,
      location,
      description,
      requiredSkills: requiredSkills || [],
      status: status || "open",
    });

    return NextResponse.json({ message: "Job created.", job }, { status: 201 });
  } catch (error) {
    console.error("POST jobs error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
