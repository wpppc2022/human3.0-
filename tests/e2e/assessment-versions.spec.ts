import { expect, test } from "@playwright/test";

test("public assessment APIs keep 48 questions as the only available version", async ({
  request,
}) => {
  const current = await request.get("/api/content/questions");
  expect(current.status()).toBe(200);
  const currentBody = await current.json();
  expect(currentBody.data).toHaveLength(48);
  expect(currentBody.meta.assessmentVersion).toBe("h3-a48-v1");

  const draft = await request.get(
    "/api/content/questions?assessmentVersion=h3-a32-v1",
  );
  expect(draft.status()).toBe(409);
  await expect(draft.json()).resolves.toMatchObject({
    code: "ASSESSMENT_VERSION_NOT_AVAILABLE",
  });
});

test("legacy v1 share decoding remains bound to 48 answers", async ({ request }) => {
  const fixture = `v1.${"3".repeat(48)}`;
  const response = await request.post("/api/share/decode", {
    data: { code: fixture },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Object.keys(body.data.answers)).toHaveLength(48);
  expect(body.meta).toMatchObject({
    assessmentVersion: "h3-a48-v1",
    resultVersion: "h3-result-v1",
  });
});

test("score API returns structured 422 details for an incomplete answer set", async ({
  request,
}) => {
  const response = await request.post("/api/assessment/score", {
    data: {
      assessmentVersion: "h3-a48-v1",
      answers: { M01: 3 },
    },
  });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error).toMatchObject({
    code: "ASSESSMENT_ANSWER_MISMATCH",
    message: "Answers do not match h3-a48-v1.",
    details: {
      expectedCount: 48,
      receivedCount: 1,
      missingIds: expect.arrayContaining(["M02", "V12"]),
      extraIds: [],
      invalidIds: [],
    },
  });
});
