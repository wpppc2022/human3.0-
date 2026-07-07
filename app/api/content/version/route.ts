import { NextResponse } from "next/server";

import quadrants from "@/data/quadrants.json";
import recommendations from "@/data/recommendations.json";
import stages from "@/data/stages.json";
import templates from "@/data/result-templates.json";
import {
  DEFAULT_ASSESSMENT_VERSION,
  getAssessmentVersionDefinition,
} from "@/lib/assessment-versions";

export function GET() {
  const assessment = getAssessmentVersionDefinition(DEFAULT_ASSESSMENT_VERSION);
  return NextResponse.json({
    data: {
      contentSchemaVersion: "h3-content-schema-v1",
      assessmentVersion: assessment.id,
      resultVersion: assessment.resultVersion,
      assessmentStatus: assessment.status,
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
        questions: assessment.questionCount,
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
