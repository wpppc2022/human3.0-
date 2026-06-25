import { NextResponse } from "next/server";

import questions from "@/data/questions.json";
import { decodeAnswersFromShare } from "@/lib/share-link";
import type { Question } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isRecord(body) || typeof body.code !== "string") {
      return NextResponse.json({ error: "Missing share code." }, { status: 400 });
    }

    const answers = decodeAnswersFromShare(questions as Question[], body.code);
    return NextResponse.json({
      data: {
        answers,
      },
      meta: {
        source: "lib/share-link.ts",
        persisted: false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to decode share link.",
      },
      { status: 400 },
    );
  }
}
