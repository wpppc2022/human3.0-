import { NextResponse } from "next/server";

import questions from "@/data/questions.json";
import { encodeAnswersForShare } from "@/lib/share-link";
import { isAnswerValue } from "@/lib/scoring";
import type { Answers, Question } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAnswers(value: unknown): Answers | null {
  if (!isRecord(value)) return null;
  if (Object.values(value).some((answer) => !isAnswerValue(answer))) return null;
  return value as Answers;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isRecord(body)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const answers = parseAnswers(body.answers);
    if (!answers) {
      return NextResponse.json({ error: "Missing or invalid answers." }, { status: 400 });
    }

    const code = encodeAnswersForShare(questions as Question[], answers);
    return NextResponse.json({
      data: {
        code,
        path: `/result/share?a=${encodeURIComponent(code)}`,
      },
      meta: {
        source: "lib/share-link.ts",
        persisted: false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to encode share link.",
      },
      { status: 400 },
    );
  }
}
