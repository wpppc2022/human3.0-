import { NextResponse } from "next/server";

import questions from "@/data/questions.json";
import quadrants from "@/data/quadrants.json";
import recommendations from "@/data/recommendations.json";
import templates from "@/data/result-templates.json";
import stages from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import type {
  Answers,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { answers?: Answers };

    if (!body.answers) {
      return NextResponse.json({ error: "Missing answers." }, { status: 400 });
    }

    const result = buildResult({
      id: `api-${Date.now()}`,
      questions: questions as Question[],
      answers: body.answers,
      stages: stages as StageDefinition[],
      quadrants: quadrants as QuadrantDefinition[],
      recommendations: recommendations as RecommendationSet[],
      templates: templates as ResultTemplate[],
    });

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to submit assessment.",
      },
      { status: 400 },
    );
  }
}
