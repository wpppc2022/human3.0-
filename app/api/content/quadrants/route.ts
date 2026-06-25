import { NextResponse } from "next/server";

import quadrants from "@/data/quadrants.json";

export function GET() {
  return NextResponse.json({
    data: quadrants,
    meta: {
      source: "data/quadrants.json",
      count: quadrants.length,
      readOnly: true,
    },
  });
}
