"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FriendPerspective } from "@/components/FriendPerspective";
import { QuadrantMap } from "@/components/QuadrantMap";
import { RecommendationBlock } from "@/components/RecommendationBlock";
import { ResultSummary } from "@/components/ResultSummary";
import { ShareCard } from "@/components/ShareCard";
import { Button } from "@/components/ui/button";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
import siteContent from "@/data/site-content.json";
import templatesData from "@/data/result-templates.json";
import stagesData from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import { loadResult, saveResult } from "@/lib/storage";
import type {
  BuiltResult,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

export function ResultClient() {
  const [result, setResult] = useState<BuiltResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = loadResult();
      if (!stored) {
        setResult(null);
        setIsLoaded(true);
        return;
      }

      try {
        const rebuiltResult = buildResult({
          id: stored.id,
          questions: questionsData as Question[],
          answers: stored.answers,
          stages: stagesData as StageDefinition[],
          quadrants: quadrantsData as QuadrantDefinition[],
          recommendations: recommendationsData as RecommendationSet[],
          templates: templatesData as ResultTemplate[],
        });

        saveResult(rebuiltResult, stored.answers);
        setResult(rebuiltResult);
      } catch {
        setResult(null);
      }
      setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <p className="text-muted-foreground">正在读取结果...</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center gap-5 px-5 py-10">
        <h1 className="text-2xl font-semibold">还没有可查看的结果</h1>
        <p className="leading-8 text-muted-foreground">
          请先完成一次评估。第一版结果只保存在当前浏览器中，如果更换设备、使用无痕窗口或清除浏览器数据，结果会消失。
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/assessment">开始评估</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-5 py-8 sm:px-8 lg:py-12">
      <ResultSummary result={result} />
      <QuadrantMap result={result} />
      <FriendPerspective result={result} />
      <RecommendationBlock result={result} />
      <ShareCard result={result} />
      <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
        {siteContent.disclaimer}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/assessment">重新评估</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </main>
  );
}
