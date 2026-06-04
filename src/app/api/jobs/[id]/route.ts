import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    const body = await request.json();

    await connectDB();

    const job = await Job.findByIdAndUpdate(id, body, { new: true });
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Job updated.", job });
  } catch (error) {
    console.error("PUT job error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;

    const { id } = await context.params;
    await connectDB();

    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Job deleted." });
  } catch (error) {
    console.error("DELETE job error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
