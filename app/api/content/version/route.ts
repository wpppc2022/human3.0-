import { NextResponse } from "next/server";

import quadrants from "@/data/quadrants.json";
import questions from "@/data/questions.json";
import recommendations from "@/data/recommendations.json";
import stages from "@/data/stages.json";
import templates from "@/data/result-templates.json";

export function GET() {
  return NextResponse.json({
    data: {
      contentSchemaVersion: "local-json-v1",
      shareLinkVersion: "v1",
      sources: [
        "data/questions.json",
        "data/quadrants.json",
        "data/stages.json",
        "data/result-templates.json",
        "data/recommendations.json",
        "data/site-content.json",
      ],
      counts: {
        questions: questions.length,
        quadrants: quadrants.length,
        stages: stages.length,
        resultTemplates: templates.length,
        recommendations: recommendations.length,
      },
    },
    meta: {
      readOnly: true,
    },
  });
}
