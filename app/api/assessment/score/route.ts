import { NextResponse } from "next/server";

import questions from "@/data/questions.json";
import quadrants from "@/data/quadrants.json";
import recommendations from "@/data/recommendations.json";
import templates from "@/data/result-templates.json";
import stages from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import { isAnswerValue } from "@/lib/scoring";
import type {
  Answers,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAnswers(value: unknown): Answers | null {
  if (!isRecord(value)) return null;

  const entries = Object.entries(value);
  if (entries.some(([, answer]) => !isAnswerValue(answer))) return null;

  return Object.fromEntries(entries) as Answers;
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

    const id = typeof body.id === "string" ? body.id : `api-${Date.now()}`;
    const result = buildResult({
      id,
      questions: questions as Question[],
      answers,
      stages: stages as StageDefinition[],
      quadrants: quadrants as QuadrantDefinition[],
      recommendations: recommendations as RecommendationSet[],
      templates: templates as ResultTemplate[],
    });

    return NextResponse.json({
      data: result,
      meta: {
        source: "buildResult",
        persisted: false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to score assessment.",
      },
      { status: 400 },
    );
  }
}
