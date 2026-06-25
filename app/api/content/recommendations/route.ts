import { NextResponse } from "next/server";

import recommendations from "@/data/recommendations.json";

export function GET() {
  return NextResponse.json({
    data: recommendations,
    meta: {
      source: "data/recommendations.json",
      count: recommendations.length,
      readOnly: true,
    },
  });
}
