import { NextResponse } from "next/server";

import siteContent from "@/data/site-content.json";

export function GET() {
  return NextResponse.json({
    data: siteContent,
    meta: {
      source: "data/site-content.json",
      readOnly: true,
    },
  });
}
