"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SiteNav } from "@/components/SiteNav";
import questionsData from "@/data/questions.json";
import quadrantsData from "@/data/quadrants.json";
import recommendationsData from "@/data/recommendations.json";
import templatesData from "@/data/result-templates.json";
import stagesData from "@/data/stages.json";
import { ANSWER_OPTIONS } from "@/lib/constants";
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
const SEGMENT_COUNT = 12;

async function scoreAssessmentViaApi(params: {
  id: string;
  answers: Answers;
}) {
  const response = await fetch("/api/assessment/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const body = (await response.json()) as { data?: unknown; error?: string };
  if (!response.ok || !body.data) {
    throw new Error(body.error ?? "Unable to score assessment.");
  }

  return body.data as ReturnType<typeof buildResult>;
}

function getSegmentState(index: number, currentIndex: number) {
  const currentSegment = Math.min(
    SEGMENT_COUNT - 1,
    Math.floor((currentIndex / questions.length) * SEGMENT_COUNT),
  );

  if (index < currentSegment) return "done";
  if (index === currentSegment) return "current";
  return "";
}

export function AssessmentFlow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isRestored, setIsRestored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentQuestion = questions[currentIndex];
  const selected = answers[currentQuestion.id];
  const isLastQuestion = currentIndex === questions.length - 1;

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

  function handleSelect(value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function goPrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  async function goNext() {
    if (isSubmitting) return;

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
    setIsSubmitting(true);

    let result: ReturnType<typeof buildResult>;
    try {
      result = await scoreAssessmentViaApi({ id, answers });
    } catch {
      result = buildResult({
        id,
        questions,
        answers,
        stages: stagesData as StageDefinition[],
        quadrants: quadrantsData as QuadrantDefinition[],
        recommendations: recommendationsData as RecommendationSet[],
        templates: templatesData as ResultTemplate[],
      });
    }

    saveResult(result, answers);
    clearAssessmentProgress();
    router.push("/result");
  }

  return (
    <div className="prototype-page assessment-prototype page">
      <SiteNav current="assessment" />
      <main className="assessment">
        <section className="assessment-shell" aria-label="HUMAN 3.0 问卷">
          <div className="assessment-grid">
            <section className="question-pane" aria-labelledby={currentQuestion.id}>
              <div className="progress" aria-label="答题进度">
                <span className="count">
                  {currentIndex + 1} / {questions.length}
                </span>
                <div className="segments" aria-hidden="true">
                  {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
                    <span
                      className={getSegmentState(index, currentIndex)}
                      key={index}
                    />
                  ))}
                </div>
              </div>

              <p className="sr-only">
                {currentQuestion.quadrant} · {currentQuestion.dimension}
              </p>
              <h2 className="question" id={currentQuestion.id}>
                {currentQuestion.text}
              </h2>

              <div
                className="options"
                role="radiogroup"
                aria-labelledby={currentQuestion.id}
              >
                {ANSWER_OPTIONS.map((option) => (
                  <button
                    className="option"
                    type="button"
                    role="radio"
                    aria-checked={selected === option.value}
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <i className="dot" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="controls">
                <button
                  className="circle"
                  type="button"
                  aria-label="上一题"
                  data-direction="prev"
                  disabled={currentIndex === 0}
                  onClick={goPrevious}
                />
                <button
                  className="circle"
                  type="button"
                  aria-label={isLastQuestion ? "生成结果" : "下一题"}
                  data-direction="next"
                  disabled={!selected || isSubmitting}
                  onClick={goNext}
                />
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
