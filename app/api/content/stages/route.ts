import { NextResponse } from "next/server";

import stages from "@/data/stages.json";

export function GET() {
  return NextResponse.json({
    data: stages,
    meta: {
      source: "data/stages.json",
      count: stages.length,
      readOnly: true,
    },
  });
}
