import { describe, expect, it } from "vitest";

import { validateAnswersForQuestions } from "../lib/assessment-input";
import {
  AssessmentVersionError,
  DEFAULT_ASSESSMENT_VERSION,
  getAssessmentQuestions,
  getAssessmentVersionManifest,
  resolveAssessmentVersion,
} from "../lib/assessment-versions";
import {
  decodeCandidateShareEnvelopeForInternalTest,
  encodeCandidateShareEnvelopeForInternalTest,
} from "../lib/candidate-share";
import {
  decodeAnswersFromShare,
  decodeLegacyV1Answers,
  encodeLegacyV1Answers,
} from "../lib/share-link";
import {
  getVersionedAssessmentStorageKey,
  identifyStoredAssessmentVersion,
  identifyStoredResultVersions,
} from "../lib/storage";
import type {
  AnswerValue,
  Answers,
  AssessmentVersionId,
  QuadrantId,
  Question,
} from "../lib/types";
import {
  getQuestionIdsForAssessmentVersion,
  scoreCandidateAssessmentForInternalTest,
} from "../lib/versioned-scoring";

const quadrantOrder: QuadrantId[] = ["mind", "body", "spirit", "vocation"];

function answersWithNormalizedTotals(
  questions: readonly Question[],
  totals: Record<QuadrantId, number>,
) {
  const answers: Answers = {};
  for (const quadrant of quadrantOrder) {
    const quadrantQuestions = questions.filter(
      (question) => question.quadrant === quadrant,
    );
    let remaining = totals[quadrant] - quadrantQuestions.length;
    for (const question of quadrantQuestions) {
      const normalized = Math.min(5, 1 + Math.max(0, remaining));
      remaining -= normalized - 1;
      answers[question.id] = (question.reverseScored
        ? 6 - normalized
        : normalized) as AnswerValue;
    }
    expect(remaining).toBe(0);
  }
  return answers;
}

function allAnswers(
  assessmentVersion: AssessmentVersionId,
  value: AnswerValue,
) {
  return Object.fromEntries(
    getAssessmentQuestions(assessmentVersion, "internal-draft").map(
      (question) => [question.id, value],
    ),
  ) as Answers;
}

describe("assessment version registry", () => {
  it("is JSON-safe and keeps the stable 48-question version as the only public default", () => {
    const manifest = getAssessmentVersionManifest();
    expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
    expect(manifest.defaultAssessmentVersion).toBe(DEFAULT_ASSESSMENT_VERSION);
    expect(manifest.assessments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "h3-a48-v1",
          status: "stable",
          questionCount: 48,
          resultVersion: "h3-result-v1",
          allowNewSessions: true,
        }),
        expect.objectContaining({
          id: "h3-a32-v1",
          status: "draft",
          calibrationStatus: "not-started",
          questionCount: 32,
          questionSetHash: null,
          allowNewSessions: false,
          allowPublicQuestions: false,
          allowPublicScoring: false,
          allowPublicShare: false,
        }),
      ]),
    );
  });

  it("loads the default as 48 and requires explicit internal access for the draft", () => {
    expect(resolveAssessmentVersion(undefined, "public-questions").id).toBe(
      "h3-a48-v1",
    );
    expect(
      getAssessmentQuestions("h3-a48-v1", "public-questions"),
    ).toHaveLength(48);
    expect(() =>
      getAssessmentQuestions("h3-a32-v1", "public-questions"),
    ).toThrow(AssessmentVersionError);
    expect(
      getAssessmentQuestions("h3-a32-v1", "internal-draft"),
    ).toHaveLength(32);
  });

  it("keeps the candidate at 8 questions and 2 reverse-scored items per quadrant", () => {
    const questions = getAssessmentQuestions("h3-a32-v1", "internal-draft");
    for (const quadrant of quadrantOrder) {
      const items = questions.filter((question) => question.quadrant === quadrant);
      expect(items).toHaveLength(8);
      expect(items.filter((question) => question.reverseScored)).toHaveLength(2);
    }
    expect(
      questions
        .filter((question) => question.reverseScored)
        .map((question) => question.id),
    ).toEqual([
      "M-C04",
      "M-C05",
      "B-C04",
      "B-C06",
      "S-C04",
      "S-C07",
      "V-C04",
      "V-C06",
    ]);
  });
});

describe("strict version input validation", () => {
  it("rejects missing, extra, invalid and cross-version answer sets", () => {
    const stableQuestions = getAssessmentQuestions("h3-a48-v1", "internal-draft");
    const stableAnswers = allAnswers("h3-a48-v1", 3);
    const candidateAnswers = allAnswers("h3-a32-v1", 3);
    const missing = { ...stableAnswers };
    delete missing.M01;

    expect(validateAnswersForQuestions(stableQuestions, missing)).toMatchObject({
      valid: false,
      missingQuestionIds: ["M01"],
    });
    expect(
      validateAnswersForQuestions(stableQuestions, {
        ...stableAnswers,
        UNKNOWN: 3,
      }),
    ).toMatchObject({ valid: false, extraAnswerIds: ["UNKNOWN"] });
    expect(
      validateAnswersForQuestions(stableQuestions, {
        ...stableAnswers,
        M01: 2.5,
      }),
    ).toMatchObject({ valid: false, invalidAnswerIds: ["M01"] });
    expect(validateAnswersForQuestions(stableQuestions, candidateAnswers).valid).toBe(
      false,
    );
  });
});

describe("32-question candidate scoring", () => {
  const questions = getAssessmentQuestions("h3-a32-v1", "internal-draft");

  it.each([
    [1, 16, 24, "1.1"],
    [2, 20, 30, "2.1"],
    [3, 24, 36, "2.2"],
    [4, 28, 42, "2.2"],
    [5, 32, 48, "2.3"],
  ] as const)(
    "keeps all-%i response math exact",
    (answer, normalizedTotal, equivalentScore, stage) => {
      const envelope = scoreCandidateAssessmentForInternalTest(
        allAnswers("h3-a32-v1", answer),
      );
      expect(envelope.scoring.stage).toBe(stage);
      for (const quadrant of quadrantOrder) {
        expect(envelope.scoring.quadrantScores[quadrant]).toMatchObject({
          normalizedTotal,
          equivalentScore,
        });
      }
    },
  );

  it.each([
    [12, "1.1"],
    [13, "1.2"],
    [16, "1.2"],
    [17, "1.3"],
    [18, "1.3"],
    [19, "2.1"],
    [21, "2.1"],
    [22, "2.2"],
    [24, "2.2"],
    [25, "2.3"],
    [29, "2.3"],
    [30, "3.1"],
    [32, "3.1"],
    [33, "3.2"],
    [36, "3.2"],
    [37, "3.3"],
  ] as const)("maps normalized total %i without rounding", (total, stage) => {
    const answers = answersWithNormalizedTotals(questions, {
      mind: total,
      body: 24,
      spirit: 24,
      vocation: 24,
    });
    const scoring = scoreCandidateAssessmentForInternalTest(answers).scoring;
    expect(scoring.quadrantScores.mind.equivalentScore).toBe(total * 1.5);
    expect(scoring.quadrantScores.mind.development.stage).toBe(stage);
  });

  it.each([
    [[8, 8, 8, 8], "1.1"],
    [[40, 40, 40, 40], "3.3"],
    [[28, 28, 28, 28], "2.2"],
    [[32, 32, 32, 32], "2.3"],
    [[33, 33, 30, 30], "3.1"],
    [[34, 33, 33, 33], "3.2"],
    [[37, 37, 37, 37], "3.3"],
    [[36, 36, 32, 27], "2.2"],
  ] as const)("keeps strict whole-system boundary %j", (totals, stage) => {
    const answers = answersWithNormalizedTotals(questions, {
      mind: totals[0],
      body: totals[1],
      spirit: totals[2],
      vocation: totals[3],
    });
    expect(scoreCandidateAssessmentForInternalTest(answers).scoring.stage).toBe(
      stage,
    );
  });

  it("preserves exact dominant and weak ties instead of selecting by order", () => {
    const answers = answersWithNormalizedTotals(questions, {
      mind: 34,
      body: 34,
      spirit: 22,
      vocation: 22,
    });
    const scoring = scoreCandidateAssessmentForInternalTest(answers).scoring;
    expect(scoring.dominantQuadrants).toEqual(["mind", "body"]);
    expect(scoring.weakQuadrants).toEqual(["spirit", "vocation"]);

    const equal = scoreCandidateAssessmentForInternalTest(
      allAnswers("h3-a32-v1", 3),
    ).scoring;
    expect(equal.dominantQuadrants).toEqual(quadrantOrder);
    expect(equal.weakQuadrants).toEqual(quadrantOrder);
  });
});

describe("share and storage compatibility", () => {
  it("permanently decodes a fixed v1 48-answer fixture", () => {
    const fixture = `v1.${"3".repeat(48)}`;
    const answers = decodeLegacyV1Answers(fixture);
    expect(Object.keys(answers)).toEqual(
      getQuestionIdsForAssessmentVersion("h3-a48-v1"),
    );
    expect(encodeLegacyV1Answers(answers)).toBe(fixture);
  });

  it("does not let the legacy decoder silently use the candidate order", () => {
    const candidateQuestions = getAssessmentQuestions(
      "h3-a32-v1",
      "internal-draft",
    );
    expect(() =>
      decodeAnswersFromShare(
        [...candidateQuestions],
        `v1.${"3".repeat(32)}`,
      ),
    ).toThrow("frozen h3-a48-v1 question order");
  });

  it("round-trips an internal candidate envelope without making it a v1 link", () => {
    const answers = allAnswers("h3-a32-v1", 4);
    const code = encodeCandidateShareEnvelopeForInternalTest(answers);
    expect(code).toMatch(/^candidate\.v2\.a32v1\.r2\./);
    expect(decodeCandidateShareEnvelopeForInternalTest(code)).toEqual(answers);
    expect(() => decodeLegacyV1Answers(code)).toThrow("Unsupported share link");
    const replacement = code.endsWith("0") ? "1" : "0";
    expect(() =>
      decodeCandidateShareEnvelopeForInternalTest(
        `${code.slice(0, -1)}${replacement}`,
      ),
    ).toThrow("Invalid candidate share envelope");
  });

  it("identifies unversioned storage as the frozen 48-question version", () => {
    expect(
      identifyStoredAssessmentVersion({
        answers: { M01: 3 },
        currentIndex: 1,
        updatedAt: "2026-07-05T00:00:00.000Z",
      }),
    ).toBe("h3-a48-v1");
    expect(
      identifyStoredResultVersions({
        id: "legacy-result",
        answers: { M01: 3 },
        result: {},
        createdAt: "2026-07-05T00:00:00.000Z",
      }),
    ).toEqual({
      assessmentVersion: "h3-a48-v1",
      resultVersion: "h3-result-v1",
      inferredLegacyVersion: true,
    });
    expect(getVersionedAssessmentStorageKey("h3-a48-v1")).not.toBe(
      getVersionedAssessmentStorageKey("h3-a32-v1"),
    );
  });
});
