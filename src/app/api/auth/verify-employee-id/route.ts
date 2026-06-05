import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { normalizeEmployeeId } from "@/lib/utils/employeeId";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = normalizeEmployeeId(searchParams.get("employeeId") || "");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const benchUser = await User.findOne({
      employeeId,
      uploadedFromBench: true,
    }).select("firstName lastName employeeId isRegistered");

    if (!benchUser) {
      return NextResponse.json(
        { valid: false, error: "Employee ID not found in bench records." },
        { status: 404 }
      );
    }

    if (benchUser.isRegistered) {
      return NextResponse.json(
        { valid: false, error: "Employee ID is already registered." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      valid: true,
      employee: {
        employeeId: benchUser.employeeId,
        firstName: benchUser.firstName,
        lastName: benchUser.lastName,
      },
    });
  } catch (error) {
    console.error("Verify employee ID error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
