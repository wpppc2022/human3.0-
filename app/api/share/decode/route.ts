import { NextResponse } from "next/server";

import { decodeLegacyV1Answers } from "@/lib/share-link";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    if (!isRecord(body) || typeof body.code !== "string") {
      return NextResponse.json({ error: "Missing share code." }, { status: 400 });
    }

    const answers = decodeLegacyV1Answers(body.code);
    return NextResponse.json({
      data: {
        answers,
      },
      meta: {
        assessmentVersion: "h3-a48-v1",
        resultVersion: "h3-result-v1",
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
