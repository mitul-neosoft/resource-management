import { NextResponse } from "next/server";
import { generateBenchTemplateBuffer } from "@/lib/services/benchUpload.service";

export async function GET() {
  const buffer = generateBenchTemplateBuffer();
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="bench-template.xlsx"',
    },
  });
}
