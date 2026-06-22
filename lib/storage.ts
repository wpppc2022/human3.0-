"use client";

import { ASSESSMENT_STORAGE_KEY, RESULT_STORAGE_KEY } from "@/lib/constants";
import { isAnswerValue } from "@/lib/scoring";
import type { Answers, BuiltResult, StoredAssessment, StoredResult } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAnswers(value: unknown): value is Answers {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isAnswerValue);
}

function isStoredAssessment(value: unknown): value is StoredAssessment {
  if (!isRecord(value)) return false;
  return (
    isAnswers(value.answers) &&
    typeof value.currentIndex === "number" &&
    Number.isInteger(value.currentIndex) &&
    value.currentIndex >= 0 &&
    typeof value.updatedAt === "string"
  );
}

function isStoredResult(value: unknown): value is StoredResult {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    isAnswers(value.answers) &&
    isRecord(value.result) &&
    typeof value.createdAt === "string"
  );
}

function safeRead<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadAssessmentProgress() {
  const stored = safeRead<unknown>(ASSESSMENT_STORAGE_KEY);
  return isStoredAssessment(stored) ? stored : null;
}

export function saveAssessmentProgress(answers: Answers, currentIndex: number) {
  safeWrite<StoredAssessment>(ASSESSMENT_STORAGE_KEY, {
    answers,
    currentIndex,
    updatedAt: new Date().toISOString(),
  });
}

export function clearAssessmentProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
}

export function saveResult(result: BuiltResult, answers: Answers) {
  safeWrite<StoredResult>(RESULT_STORAGE_KEY, {
    id: result.id,
    answers,
    result,
    createdAt: new Date().toISOString(),
  });
}

export function loadResult() {
  const stored = safeRead<unknown>(RESULT_STORAGE_KEY);
  return isStoredResult(stored) ? stored : null;
}
