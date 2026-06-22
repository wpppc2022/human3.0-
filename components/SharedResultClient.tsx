"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { QuadrantMap } from "@/components/QuadrantMap";
import { RecommendationBlock } from "@/components/RecommendationBlock";
import { ResultSummary } from "@/components/ResultSummary";
import { ShareCard } from "@/components/ShareCard";
import { Button } from "@/components/ui/button";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
import templatesData from "@/data/result-templates.json";
import stagesData from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import { decodeAnswersFromShare } from "@/lib/share-link";
import type {
  BuiltResult,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

const questions = questionsData as Question[];

export function SharedResultClient({ shareCode }: { shareCode?: string }) {
  const [result, setResult] = useState<BuiltResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (!shareCode) {
        setResult(null);
        setIsLoaded(true);
        return;
      }

      try {
        const answers = decodeAnswersFromShare(questions, shareCode);
        const sharedResult = buildResult({
          id: "shared-result",
          questions,
          answers,
          stages: stagesData as StageDefinition[],
          quadrants: quadrantsData as QuadrantDefinition[],
          recommendations: recommendationsData as RecommendationSet[],
          templates: templatesData as ResultTemplate[],
        });

        setResult(sharedResult);
      } catch {
        setResult(null);
      }

      setIsLoaded(true);
    });
  }, [shareCode]);

  if (!isLoaded) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <p className="text-muted-foreground">正在读取分享结果...</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-5 px-5 py-10">
        <h1 className="text-2xl font-semibold">这个分享链接无法读取</h1>
        <p className="leading-8 text-muted-foreground">
          链接可能不完整，或者来自旧版本。你可以重新完成一次评估，生成新的结果。
        </p>
        <Button asChild>
          <Link href="/assessment">开始评估</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-5 py-8 sm:px-8 lg:py-12">
      <ResultSummary result={result} />
      <QuadrantMap result={result} />
      <RecommendationBlock result={result} />
      <ShareCard result={result} />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/assessment">我也测一次</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </main>
  );
}
