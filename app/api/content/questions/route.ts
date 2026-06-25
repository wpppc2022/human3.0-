import { NextResponse } from "next/server";

import questions from "@/data/questions.json";

export function GET() {
  return NextResponse.json({
    data: questions,
    meta: {
      source: "data/questions.json",
      count: questions.length,
      readOnly: true,
    },
  });
}
