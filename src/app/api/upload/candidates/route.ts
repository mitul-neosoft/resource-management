import { NextResponse } from "next/server";

/** @deprecated Use POST /api/rm/upload/bench */
export async function POST() {
  return NextResponse.json(
    { error: "Use POST /api/rm/upload/bench instead." },
    { status: 410 }
  );
}
