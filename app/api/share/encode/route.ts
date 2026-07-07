import { NextResponse } from "next/server";

import {
  assertAnswersForQuestions,
  AssessmentAnswerMismatchError,
} from "@/lib/assessment-input";
import {
  AssessmentVersionError,
  getAssessmentQuestions,
  resolveAssessmentVersion,
} from "@/lib/assessment-versions";
import { encodeLegacyV1Answers } from "@/lib/share-link";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    if (!Object.hasOwn(body, "answers") || !isRecord(body.answers)) {
      return NextResponse.json(
        { error: "answers must be an object." },
        { status: 400 },
      );
    }

    if (
      Object.hasOwn(body, "assessmentVersion") &&
      typeof body.assessmentVersion !== "string"
    ) {
      return NextResponse.json(
        { error: "assessmentVersion must be a string." },
        { status: 400 },
      );
    }
    const requestedVersion = body.assessmentVersion as string | undefined;
    const definition = resolveAssessmentVersion(requestedVersion, "public-share");
    const questions = getAssessmentQuestions(definition.id, "public-share");
    const answers = assertAnswersForQuestions(
      questions,
      body.answers,
      definition.id,
    );

    const code = encodeLegacyV1Answers(answers);
    return NextResponse.json({
      data: {
        code,
        path: `/result/share?a=${encodeURIComponent(code)}`,
      },
      meta: {
        assessmentVersion: "h3-a48-v1",
        resultVersion: "h3-result-v1",
        source: "lib/share-link.ts",
        persisted: false,
      },
    });
  } catch (error) {
    if (error instanceof AssessmentAnswerMismatchError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        { status: error.status },
      );
    }
    const status = error instanceof AssessmentVersionError ? error.status : 400;
    return NextResponse.json(
      {
        code: error instanceof AssessmentVersionError ? error.code : undefined,
        error: error instanceof Error ? error.message : "Unable to encode share link.",
      },
      { status },
    );
  }
}
