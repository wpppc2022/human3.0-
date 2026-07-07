import { assertAnswersForQuestions } from "@/lib/assessment-input";
import {
  CANDIDATE_ASSESSMENT_VERSION,
  getAssessmentQuestions,
} from "@/lib/assessment-versions";
import type { AnswerValue, Answers } from "@/lib/types";

const CANDIDATE_SHARE_PREFIX = "candidate.v2.a32v1.r2.";
const ANSWER_PATTERN = /^[1-5]{32}$/;

function checksum(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function candidateQuestions() {
  return getAssessmentQuestions(
    CANDIDATE_ASSESSMENT_VERSION,
    "internal-draft",
  );
}

export function encodeCandidateShareEnvelopeForInternalTest(input: unknown) {
  const questions = candidateQuestions();
  const answers = assertAnswersForQuestions(
    questions,
    input,
    CANDIDATE_ASSESSMENT_VERSION,
  );
  const payload = questions.map((question) => answers[question.id]).join("");
  const body = `${CANDIDATE_SHARE_PREFIX}${payload}`;
  return `${body}.${checksum(body)}`;
}

export function decodeCandidateShareEnvelopeForInternalTest(code: string): Answers {
  if (!code.startsWith(CANDIDATE_SHARE_PREFIX)) {
    throw new Error("Unsupported candidate share envelope.");
  }

  const parts = code.split(".");
  if (parts.length !== 6) throw new Error("Invalid candidate share envelope.");
  const payload = parts[4];
  const suppliedChecksum = parts[5];
  const body = parts.slice(0, 5).join(".");
  if (!ANSWER_PATTERN.test(payload) || checksum(body) !== suppliedChecksum) {
    throw new Error("Invalid candidate share envelope.");
  }

  const questions = candidateQuestions();
  const answers = Object.fromEntries(
    questions.map((question, index) => [
      question.id,
      Number(payload[index]) as AnswerValue,
    ]),
  ) as Answers;
  return assertAnswersForQuestions(
    questions,
    answers,
    CANDIDATE_ASSESSMENT_VERSION,
  );
}
