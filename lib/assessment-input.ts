import { isAnswerValue } from "@/lib/scoring";
import type {
  Answers,
  AssessmentAnswerMismatchDetails,
  AssessmentAnswerValidation,
  Question,
} from "@/lib/types";

export class AssessmentAnswerMismatchError extends Error {
  readonly code = "ASSESSMENT_ANSWER_MISMATCH" as const;
  readonly status = 422 as const;

  constructor(
    message: string,
    public readonly details: AssessmentAnswerMismatchDetails,
  ) {
    super(message);
    this.name = "AssessmentAnswerMismatchError";
  }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function validateAnswersForQuestions(
  questions: readonly Question[],
  input: unknown,
): AssessmentAnswerValidation {
  if (!isPlainRecord(input)) {
    return {
      valid: false,
      answers: null,
      expectedCount: questions.length,
      receivedCount: 0,
      missingQuestionIds: questions.map((question) => question.id),
      extraAnswerIds: [],
      invalidAnswerIds: [],
    };
  }

  const expectedIds = new Set(questions.map((question) => question.id));
  const inputIds = Object.keys(input);
  const missingQuestionIds = questions
    .filter((question) => !Object.hasOwn(input, question.id))
    .map((question) => question.id);
  const extraAnswerIds = inputIds.filter((id) => !expectedIds.has(id));
  const invalidAnswerIds = inputIds.filter(
    (id) => expectedIds.has(id) && !isAnswerValue(input[id]),
  );
  const valid =
    missingQuestionIds.length === 0 &&
    extraAnswerIds.length === 0 &&
    invalidAnswerIds.length === 0 &&
    inputIds.length === questions.length;

  return {
    valid,
    answers: valid ? (input as Answers) : null,
    expectedCount: questions.length,
    receivedCount: inputIds.length,
    missingQuestionIds,
    extraAnswerIds,
    invalidAnswerIds,
  };
}

export function assertAnswersForQuestions(
  questions: readonly Question[],
  input: unknown,
  assessmentVersion?: string,
): Answers {
  const validation = validateAnswersForQuestions(questions, input);
  if (validation.valid && validation.answers) return validation.answers;

  throw new AssessmentAnswerMismatchError(
    assessmentVersion
      ? `Answers do not match ${assessmentVersion}.`
      : "Answers do not match the assessment question set.",
    {
      expectedCount: validation.expectedCount,
      receivedCount: validation.receivedCount,
      missingIds: validation.missingQuestionIds,
      extraIds: validation.extraAnswerIds,
      invalidIds: validation.invalidAnswerIds,
    },
  );
}
