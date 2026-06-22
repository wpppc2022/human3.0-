"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
import templatesData from "@/data/result-templates.json";
import stagesData from "@/data/stages.json";
import { buildResult } from "@/lib/result-builder";
import {
  clearAssessmentProgress,
  loadAssessmentProgress,
  saveAssessmentProgress,
  saveResult,
} from "@/lib/storage";
import type {
  AnswerValue,
  Answers,
  QuadrantDefinition,
  Question,
  RecommendationSet,
  ResultTemplate,
  StageDefinition,
} from "@/lib/types";

const questions = questionsData as Question[];

export function AssessmentFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isRestored, setIsRestored] = useState(false);
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selected = answers[currentQuestion.id];

  useEffect(() => {
    queueMicrotask(() => {
      const saved = loadAssessmentProgress();
      if (saved) {
        setAnswers(saved.answers);
        setCurrentIndex(Math.min(saved.currentIndex, questions.length - 1));
      }
      setIsRestored(true);
    });
  }, []);

  useEffect(() => {
    if (isRestored) {
      saveAssessmentProgress(answers, currentIndex);
    }
  }, [answers, currentIndex, isRestored]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function handleSelect(value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const missingIndex = questions.findIndex((question) => !answers[question.id]);
    if (missingIndex >= 0) {
      setCurrentIndex(missingIndex);
      return;
    }

    const id = `local-${Date.now()}`;
    const result = buildResult({
      id,
      questions,
      answers,
      stages: stagesData as StageDefinition[],
      quadrants: quadrantsData as QuadrantDefinition[],
      recommendations: recommendationsData as RecommendationSet[],
      templates: templatesData as ResultTemplate[],
    });

    saveResult(result, answers);
    clearAssessmentProgress();
    router.push("/result");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pb-24 pt-6 sm:px-8 sm:py-10">
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            {currentIndex + 1} / {questions.length}
          </span>
          <span>已回答 {answeredCount} 题</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="rounded-lg border bg-card p-5 shadow-sm sm:p-8">
        <QuestionCard
          question={currentQuestion}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0}
        >
          上一题
        </Button>
        <Button type="button" onClick={goNext} disabled={!selected}>
          {currentIndex === questions.length - 1 ? "查看结果" : "下一题"}
        </Button>
      </div>
    </main>
  );
}
