import { NextResponse } from "next/server";

import {
  AssessmentRequestError,
  buildPublicAssessmentResult,
} from "@/lib/assessment-api";
import { AssessmentAnswerMismatchError } from "@/lib/assessment-input";
import { AssessmentVersionError } from "@/lib/assessment-versions";

export async function POST(request: Request) {
  try {
    const payload = buildPublicAssessmentResult(await request.json());
    return NextResponse.json({ data: payload.result, meta: payload.meta });
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
    const status =
      error instanceof AssessmentVersionError
        ? error.status
        : error instanceof AssessmentRequestError
          ? error.status
          : 400;
    return NextResponse.json(
      {
        code:
          error instanceof AssessmentVersionError ||
          error instanceof AssessmentRequestError
            ? error.code
            : undefined,
        error:
          error instanceof Error ? error.message : "Unable to score assessment.",
      },
      { status },
    );
  }
}
