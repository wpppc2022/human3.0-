import { describe, expect, it } from "vitest";

import { POST as score } from "../app/api/assessment/score/route";
import { POST as submit } from "../app/api/submit/route";
import { GET as questions } from "../app/api/content/questions/route";
import { POST as encodeShare } from "../app/api/share/encode/route";
import { getAssessmentQuestions } from "../lib/assessment-versions";
import type { Answers } from "../lib/types";

function completeAnswers(version: "h3-a48-v1" | "h3-a32-v1") {
  return Object.fromEntries(
    getAssessmentQuestions(version, "internal-draft").map((question) => [
      question.id,
      3,
    ]),
  ) as Answers;
}

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("versioned public assessment APIs", () => {
  it("returns the stable 48 questions by default and when explicitly requested", async () => {
    for (const url of [
      "http://localhost/api/content/questions",
      "http://localhost/api/content/questions?assessmentVersion=h3-a48-v1",
    ]) {
      const response = questions(new Request(url));
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(body.data).toHaveLength(48);
      expect(body.meta).toMatchObject({
        assessmentVersion: "h3-a48-v1",
        resultVersion: "h3-result-v1",
        defaultAssessmentVersion: "h3-a48-v1",
      });
    }
  });

  it("does not expose draft questions or unknown versions", async () => {
    const draft = questions(
      new Request(
        "http://localhost/api/content/questions?assessmentVersion=h3-a32-v1",
      ),
    );
    const unknown = questions(
      new Request(
        "http://localhost/api/content/questions?assessmentVersion=unknown",
      ),
    );
    expect(draft.status).toBe(409);
    expect(await draft.json()).toMatchObject({
      code: "ASSESSMENT_VERSION_NOT_AVAILABLE",
    });
    expect(unknown.status).toBe(404);
    expect(await unknown.json()).toMatchObject({
      code: "UNKNOWN_ASSESSMENT_VERSION",
    });
  });

  it("scores legacy unversioned and explicit 48 requests without changing result data", async () => {
    const answers = completeAnswers("h3-a48-v1");
    const legacy = await score(
      jsonRequest("http://localhost/api/assessment/score", { answers }),
    );
    const explicit = await score(
      jsonRequest("http://localhost/api/assessment/score", {
        assessmentVersion: "h3-a48-v1",
        resultVersion: "h3-result-v1",
        answers,
      }),
    );
    const legacyBody = await legacy.json();
    const explicitBody = await explicit.json();
    expect(legacy.status).toBe(200);
    expect(explicit.status).toBe(200);
    expect(legacyBody.data.scoring).toEqual(explicitBody.data.scoring);
    expect(legacyBody.meta.inferredLegacyVersion).toBe(true);
    expect(explicitBody.meta.inferredLegacyVersion).toBe(false);
  });

  it("keeps draft and incompatible result versions at 409", async () => {
    const candidateAnswers = completeAnswers("h3-a32-v1");
    const stableAnswers = completeAnswers("h3-a48-v1");
    const draft = await score(
      jsonRequest("http://localhost/api/assessment/score", {
        assessmentVersion: "h3-a32-v1",
        answers: candidateAnswers,
      }),
    );
    const incompatible = await score(
      jsonRequest("http://localhost/api/assessment/score", {
        assessmentVersion: "h3-a48-v1",
        resultVersion: "h3-result-v2",
        answers: stableAnswers,
      }),
    );
    expect(draft.status).toBe(409);
    expect(incompatible.status).toBe(409);
  });

  it("returns the exact 422 contract for missing, extra, invalid and crossed answers", async () => {
    const stableQuestions = getAssessmentQuestions(
      "h3-a48-v1",
      "internal-draft",
    );
    const candidateQuestions = getAssessmentQuestions(
      "h3-a32-v1",
      "internal-draft",
    );
    const stableAnswers = completeAnswers("h3-a48-v1");
    const candidateAnswers = completeAnswers("h3-a32-v1");
    const missingAnswers = { ...stableAnswers };
    delete missingAnswers.M01;

    const cases = [
      {
        answers: missingAnswers,
        details: {
          expectedCount: 48,
          receivedCount: 47,
          missingIds: ["M01"],
          extraIds: [],
          invalidIds: [],
        },
      },
      {
        answers: { ...stableAnswers, UNKNOWN: 3 },
        details: {
          expectedCount: 48,
          receivedCount: 49,
          missingIds: [],
          extraIds: ["UNKNOWN"],
          invalidIds: [],
        },
      },
      {
        answers: { ...stableAnswers, M01: 6 },
        details: {
          expectedCount: 48,
          receivedCount: 48,
          missingIds: [],
          extraIds: [],
          invalidIds: ["M01"],
        },
      },
      {
        answers: candidateAnswers,
        details: {
          expectedCount: 48,
          receivedCount: 32,
          missingIds: stableQuestions.map((question) => question.id),
          extraIds: candidateQuestions.map((question) => question.id),
          invalidIds: [],
        },
      },
    ];

    for (const item of cases) {
      const response = await score(
        jsonRequest("http://localhost/api/assessment/score", {
          assessmentVersion: "h3-a48-v1",
          answers: item.answers,
        }),
      );
      expect(response.status).toBe(422);
      expect(await response.json()).toEqual({
        error: {
          code: "ASSESSMENT_ANSWER_MISMATCH",
          message: "Answers do not match h3-a48-v1.",
          details: item.details,
        },
      });
    }
  });

  it("uses the same 422 contract on the legacy submit route", async () => {
    const answers = completeAnswers("h3-a48-v1");
    const response = await submit(
      jsonRequest("http://localhost/api/submit", {
        answers: { ...answers, M01: 0 },
      }),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: {
        code: "ASSESSMENT_ANSWER_MISMATCH",
        message: "Answers do not match h3-a48-v1.",
        details: {
          expectedCount: 48,
          receivedCount: 48,
          missingIds: [],
          extraIds: [],
          invalidIds: ["M01"],
        },
      },
    });
  });

  it("keeps public share encoding limited to the stable 48-question version", async () => {
    const draft = await encodeShare(
      jsonRequest("http://localhost/api/share/encode", {
        assessmentVersion: "h3-a32-v1",
        answers: completeAnswers("h3-a32-v1"),
      }),
    );
    const stable = await encodeShare(
      jsonRequest("http://localhost/api/share/encode", {
        answers: completeAnswers("h3-a48-v1"),
      }),
    );
    expect(draft.status).toBe(409);
    expect(stable.status).toBe(200);
    expect((await stable.json()).data.code).toMatch(/^v1\.[1-5]{48}$/);
  });

  it("uses the 422 mismatch contract for public share answer sets", async () => {
    const answers = completeAnswers("h3-a48-v1");
    delete answers.V12;
    const response = await encodeShare(
      jsonRequest("http://localhost/api/share/encode", { answers }),
    );
    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      error: {
        code: "ASSESSMENT_ANSWER_MISMATCH",
        message: "Answers do not match h3-a48-v1.",
        details: {
          expectedCount: 48,
          receivedCount: 47,
          missingIds: ["V12"],
          extraIds: [],
          invalidIds: [],
        },
      },
    });
  });
});
