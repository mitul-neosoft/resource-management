import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAuth, isAuthError } from "@/lib/auth/apiAuth";
import { UserRole } from "@/constants/roles";
import { processJobsUpload } from "@/lib/services/jobUpload.service";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if (isAuthError(auth)) return auth;
    if (auth.payload.role !== UserRole.RESOURCE_MANAGER) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Only .xlsx and .xls files are supported" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processJobsUpload(
      buffer,
      file.name,
      auth.payload.userId
    );

    return NextResponse.json({ message: "Jobs upload processed.", ...result });
  } catch (error) {
    console.error("Jobs upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
