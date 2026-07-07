import stableQuestionData from "@/data/questions.json";
import type { AnswerValue, Answers, Question } from "@/lib/types";

export const LEGACY_SHARE_CODE_PREFIX = "v1.";
const ANSWER_PATTERN = /^[1-5]+$/;
const stableQuestions = stableQuestionData as Question[];

function isShareAnswer(value: string): value is `${AnswerValue}` {
  return ANSWER_PATTERN.test(value) && value.length === 1;
}

export function encodeAnswersForShare(questions: Question[], answers: Answers) {
  assertLegacyQuestionOrder(questions);
  return encodeLegacyV1Answers(answers);
}

function assertLegacyQuestionOrder(questions: readonly Question[]) {
  const matches =
    questions.length === stableQuestions.length &&
    questions.every((question, index) => question.id === stableQuestions[index].id);
  if (!matches) {
    throw new Error("Legacy v1 share links require the frozen h3-a48-v1 question order.");
  }
}

export function encodeLegacyV1Answers(answers: Answers) {
  const encodedAnswers = stableQuestions
    .map((question) => {
      const answer = answers[question.id];
      if (!answer) {
        throw new Error(`Cannot create share link. Missing answer: ${question.id}`);
      }
      return String(answer);
    })
    .join("");

  return `${LEGACY_SHARE_CODE_PREFIX}${encodedAnswers}`;
}

export function decodeAnswersFromShare(questions: Question[], code: string) {
  assertLegacyQuestionOrder(questions);
  return decodeLegacyV1Answers(code);
}

export function decodeLegacyV1Answers(code: string) {
  if (!code.startsWith(LEGACY_SHARE_CODE_PREFIX)) {
    throw new Error("Unsupported share link format.");
  }

  const encodedAnswers = code.slice(LEGACY_SHARE_CODE_PREFIX.length);
  if (
    encodedAnswers.length !== stableQuestions.length ||
    !ANSWER_PATTERN.test(encodedAnswers)
  ) {
    throw new Error("Invalid share link answers.");
  }

  return stableQuestions.reduce((answers, question, index) => {
    const answer = encodedAnswers[index];
    if (!isShareAnswer(answer)) {
      throw new Error(`Invalid answer in share link: ${question.id}`);
    }

    return {
      ...answers,
      [question.id]: Number(answer) as AnswerValue,
    };
  }, {} as Answers);
}

export function buildShareResultPath(questions: Question[], answers: Answers) {
  return `/result/share?a=${encodeURIComponent(
    encodeAnswersForShare(questions, answers),
  )}`;
}
