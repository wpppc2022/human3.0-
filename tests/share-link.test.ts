import { describe, expect, it } from "vitest";

import questions from "@/data/questions.json";
import {
  buildShareResultPath,
  decodeAnswersFromShare,
  encodeAnswersForShare,
} from "@/lib/share-link";
import type { Answers, Question } from "@/lib/types";

const typedQuestions = questions as Question[];

function buildAnswers(value: 1 | 2 | 3 | 4 | 5): Answers {
  return Object.fromEntries(
    typedQuestions.map((question) => [question.id, value]),
  ) as Answers;
}

describe("share link", () => {
  it("encodes and decodes answers in question order", () => {
    const answers = buildAnswers(4);
    const code = encodeAnswersForShare(typedQuestions, answers);
    const decoded = decodeAnswersFromShare(typedQuestions, code);

    expect(code).toMatch(/^v1\.[1-5]+$/);
    expect(decoded).toEqual(answers);
  });

  it("builds a share result path", () => {
    const path = buildShareResultPath(typedQuestions, buildAnswers(3));

    expect(path).toMatch(/^\/result\/share\?a=v1\./);
  });

  it("rejects missing answers", () => {
    const answers = buildAnswers(4);
    delete answers.M01;

    expect(() => encodeAnswersForShare(typedQuestions, answers)).toThrow(
      /Missing answer: M01/,
    );
  });

  it("rejects invalid share codes", () => {
    expect(() => decodeAnswersFromShare(typedQuestions, "v1.123")).toThrow(
      /Invalid share link answers/,
    );
    expect(() =>
      decodeAnswersFromShare(typedQuestions, `v1.${"4".repeat(49)}`),
    ).toThrow(/Invalid share link answers/);
    expect(() =>
      decodeAnswersFromShare(typedQuestions, `v1.${"4".repeat(47)}x`),
    ).toThrow(/Invalid share link answers/);
    expect(() => decodeAnswersFromShare(typedQuestions, "v1.")).toThrow(
      /Invalid share link answers/,
    );
    expect(() => decodeAnswersFromShare(typedQuestions, "v2.4444")).toThrow(
      /Unsupported share link format/,
    );
  });
});
