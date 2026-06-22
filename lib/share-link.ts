import type { AnswerValue, Answers, Question } from "@/lib/types";

const SHARE_CODE_PREFIX = "v1.";
const ANSWER_PATTERN = /^[1-5]+$/;

function isShareAnswer(value: string): value is `${AnswerValue}` {
  return ANSWER_PATTERN.test(value) && value.length === 1;
}

export function encodeAnswersForShare(questions: Question[], answers: Answers) {
  const encodedAnswers = questions
    .map((question) => {
      const answer = answers[question.id];
      if (!answer) {
        throw new Error(`Cannot create share link. Missing answer: ${question.id}`);
      }
      return String(answer);
    })
    .join("");

  return `${SHARE_CODE_PREFIX}${encodedAnswers}`;
}

export function decodeAnswersFromShare(questions: Question[], code: string) {
  if (!code.startsWith(SHARE_CODE_PREFIX)) {
    throw new Error("Unsupported share link format.");
  }

  const encodedAnswers = code.slice(SHARE_CODE_PREFIX.length);
  if (
    encodedAnswers.length !== questions.length ||
    !ANSWER_PATTERN.test(encodedAnswers)
  ) {
    throw new Error("Invalid share link answers.");
  }

  return questions.reduce((answers, question, index) => {
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
