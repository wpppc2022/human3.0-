import { NextResponse } from "next/server";

import templates from "@/data/result-templates.json";

export function GET() {
  return NextResponse.json({
    data: templates,
    meta: {
      source: "data/result-templates.json",
      count: templates.length,
      readOnly: true,
    },
  });
}
