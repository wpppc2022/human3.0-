"use client";

import { ASSESSMENT_STORAGE_KEY, RESULT_STORAGE_KEY } from "@/lib/constants";
import type { Answers, BuiltResult, StoredAssessment, StoredResult } from "@/lib/types";

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
  return safeRead<StoredAssessment>(ASSESSMENT_STORAGE_KEY);
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
  return safeRead<StoredResult>(RESULT_STORAGE_KEY);
}
