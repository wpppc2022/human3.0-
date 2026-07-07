import { NextResponse } from "next/server";

import {
  AssessmentVersionError,
  getAssessmentQuestions,
  resolveAssessmentVersion,
} from "@/lib/assessment-versions";

export function GET(request: Request) {
  try {
    const requestedVersion = new URL(request.url).searchParams.get("assessmentVersion") ?? undefined;
    const definition = resolveAssessmentVersion(requestedVersion, "public-questions");
    const questions = getAssessmentQuestions(definition.id, "public-questions");

    return NextResponse.json({
      data: questions,
      meta: {
        assessmentVersion: definition.id,
        resultVersion: definition.resultVersion,
        contentSchemaVersion: "h3-content-schema-v1",
        source: definition.questionSource,
        count: questions.length,
        defaultAssessmentVersion: "h3-a48-v1",
        readOnly: true,
      },
    });
  } catch (error) {
    const status = error instanceof AssessmentVersionError ? error.status : 400;
    return NextResponse.json(
      {
        code: error instanceof AssessmentVersionError ? error.code : undefined,
        error: error instanceof Error ? error.message : "Unable to load questions.",
      },
      { status },
    );
  }
}
