"use client";

import { useEffect, useState } from "react";

import {
  PdfReportPreview,
  ResultEmptyState,
  ResultReport,
} from "@/components/ResultReport";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
import templatesData from "@/data/result-templates.json";
import stagesData from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import { decodeAnswersFromShare } from "@/lib/share-link";
import type {
  Answers,
  BuiltResult,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

const questions = questionsData as Question[];

async function postJson<T>(url: string, data: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = (await response.json()) as { data?: T; error?: string };
  if (!response.ok || !body.data) {
    throw new Error(body.error ?? `Request failed: ${url}`);
  }

  return body.data;
}

async function buildSharedResultViaApi(shareCode: string) {
  const decoded = await postJson<{ answers: Answers }>("/api/share/decode", {
    code: shareCode,
  });
  return postJson<BuiltResult>("/api/assessment/score", {
    id: "shared-result",
    answers: decoded.answers,
  });
}

function buildSharedResultLocally(shareCode: string) {
  const answers = decodeAnswersFromShare(questions, shareCode);
  return buildResult({
    id: "shared-result",
    questions,
    answers,
    stages: stagesData as StageDefinition[],
    quadrants: quadrantsData as QuadrantDefinition[],
    recommendations: recommendationsData as RecommendationSet[],
    templates: templatesData as ResultTemplate[],
  });
}

export function SharedResultClient({ shareCode }: { shareCode?: string }) {
  const [result, setResult] = useState<BuiltResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPdfPreview, setIsPdfPreview] = useState(false);

  useEffect(() => {
    queueMicrotask(async () => {
      setIsPdfPreview(
        new URLSearchParams(window.location.search).get("pdfPreview") === "1",
      );
      if (!shareCode) {
        setResult(null);
        setIsLoaded(true);
        return;
      }

      try {
        try {
          setResult(await buildSharedResultViaApi(shareCode));
        } catch {
          setResult(buildSharedResultLocally(shareCode));
        }
      } catch {
        setResult(null);
      } finally {
        setIsLoaded(true);
      }
    });
  }, [shareCode]);

  if (!isLoaded) {
    return (
      <ResultEmptyState
        title="正在读取分享结果"
        copy="页面正在解析分享链接，并使用当前题库与结果模板重新生成报告。"
      />
    );
  }

  if (!result) {
    return (
      <ResultEmptyState
        title="这个分享链接无法读取"
        copy="链接可能不完整，或者来自旧版本。你可以重新完成一次评估生成新的结果，也可以请分享者重新复制链接。"
      />
    );
  }

  if (isPdfPreview) {
    return <PdfReportPreview result={result} shared />;
  }

  return <ResultReport result={result} shared />;
}
