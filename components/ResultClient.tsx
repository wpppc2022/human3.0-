"use client";

import { useEffect, useState } from "react";

import { ResultEmptyState, ResultReport } from "@/components/ResultReport";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
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
      <ResultEmptyState
        title="正在读取结果"
        copy="评估结果保存在当前浏览器中，页面会在读取完成后生成报告。"
      />
    );
  }

  if (!result) {
    return (
      <ResultEmptyState
        title="还没有可查看的结果"
        copy="请先完成一次评估。第一版结果只保存在当前浏览器中，如果更换设备、使用无痕窗口或清除浏览器数据，结果会消失。"
      />
    );
  }

  return <ResultReport result={result} />;
}
