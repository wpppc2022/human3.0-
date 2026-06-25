import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

import questions from "../../data/questions.json";
import { ASSESSMENT_STORAGE_KEY, RESULT_STORAGE_KEY } from "../../lib/constants";
import type { AnswerValue, Answers, Question } from "../../lib/types";

const typedQuestions = questions as Question[];

async function clearBrowserState(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
}

async function answerCurrentQuestion(page: Page, nextButtonName: string) {
  await page.getByRole("radio", { name: /比较符合/ }).click();
  await page.getByRole("button", { name: nextButtonName }).click();
}

async function expectPngFile(path: string) {
  const file = await readFile(path);
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

  expect(file.byteLength).toBeGreaterThan(10_000);
  expect([...file.subarray(0, pngSignature.length)]).toEqual(pngSignature);
}

async function expectPdfFile(path: string) {
  const file = await readFile(path);

  expect(file.byteLength).toBeGreaterThan(10_000);
  expect(file.subarray(0, 4).toString()).toBe("%PDF");
}

test.beforeEach(async ({ page }) => {
  await clearBrowserState(page);
});

test("home page starts the assessment", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      name: "HUMAN 3.0 看清自己。设计自己。成为更完整的人。",
    }),
  ).toBeVisible();
  await expect(page.getByText("Personal Growth Assessment Framework")).toBeVisible();
  await expect(page.getByText("人不是单点成长的。")).toBeVisible();
  await expect(page.getByText("得到一张关于自己的行动地图。")).toBeVisible();

  await page.getByRole("link", { name: /开始评估/ }).first().click();

  await expect(page).toHaveURL(/\/assessment$/);
  await expect(page.getByText("1 / 48")).toBeVisible();
  await expect(page.getByRole("button", { name: "下一题" })).toBeDisabled();
});

test("assessment progress survives refresh", async ({ page }) => {
  await page.goto("/assessment");

  await answerCurrentQuestion(page, "下一题");
  await expect(page.getByText("2 / 48")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw).currentIndex : null;
      }, ASSESSMENT_STORAGE_KEY),
    )
    .toBe(1);

  await page.reload();

  await expect(page.getByText("2 / 48")).toBeVisible();
  await expect(page.getByRole("radio", { name: /比较符合/ })).toBeVisible();
});

test("assessment ignores corrupted saved progress", async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        answers: { M01: 7 },
        currentIndex: "not-a-number",
        updatedAt: "broken-cache",
      }),
    );
  }, ASSESSMENT_STORAGE_KEY);

  await page.goto("/assessment");

  await expect(page.getByText("1 / 48")).toBeVisible();
  await expect(page.getByRole("button", { name: "下一题" })).toBeDisabled();
});

test("result page handles missing local result", async ({ page }) => {
  await page.goto("/result");

  await expect(page.getByText("还没有可查看的结果")).toBeVisible();
  await expect(page.getByRole("link", { name: "开始评估" })).toBeVisible();
});

test("result page handles corrupted local result", async ({ page }) => {
  await page.goto("/");
  await page.evaluate((key) => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        id: "broken-result",
        answers: { M01: 6 },
        result: {},
        createdAt: "broken-cache",
      }),
    );
  }, RESULT_STORAGE_KEY);

  await page.goto("/result");

  await expect(page.getByText("还没有可查看的结果")).toBeVisible();
  await expect(page.getByRole("link", { name: "开始评估" })).toBeVisible();
});

test("user can complete assessment, view result, and open share link", async ({
  page,
}) => {
  await page.goto("/assessment");

  for (let index = 0; index < 48; index += 1) {
    await expect(page.getByText(`${index + 1} / 48`)).toBeVisible();
    await answerCurrentQuestion(page, index === 47 ? "生成结果" : "下一题");
  }

  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByText("Your Human Pattern Report")).toBeVisible();
  await expect(page.getByText("1. 你的四象限状态")).toBeVisible();
  await expect(page.getByText("2. 当前状态")).toBeVisible();
  await expect(page.getByText("3. 你的状态模式")).toBeVisible();
  await expect(page.getByText("4. 优势与盲点")).toBeVisible();
  await expect(page.getByText("5. 下一步行动")).toBeVisible();
  await expect(page.getByText("6. 分享卡片")).toBeVisible();
  await expect(page.getByText("Metatype")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    /rawScore|averageScore|平均分：|失衡分/,
  );

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /保存卡片/ }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();

  expect(download.suggestedFilename()).toMatch(
    /^human-3-share-card-[1-3]\.[1-3]\.png$/,
  );
  expect(downloadPath).not.toBeNull();
  await expectPngFile(downloadPath as string);

  const pdfDownloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /下载完整报告/ }).click();
  const pdfDownload = await pdfDownloadPromise;
  const pdfDownloadPath = await pdfDownload.path();

  expect(pdfDownload.suggestedFilename()).toMatch(
    /^human-3-full-report-[1-3]\.[1-3]\.pdf$/,
  );
  expect(pdfDownloadPath).not.toBeNull();
  await expectPdfFile(pdfDownloadPath as string);

  await page.goto(`/result/share?a=v1.${"4".repeat(48)}`);

  await expect(page.getByText("Your Human Pattern Report")).toBeVisible();
  await expect(page.locator('[aria-label="四象限发展图"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "返回问卷" })).toBeVisible();
});

test("shared result page handles invalid share code", async ({ page }) => {
  await page.goto("/result/share?a=v1.bad-code");

  await expect(page.getByText("这个分享链接无法读取")).toBeVisible();
  await expect(page.getByRole("link", { name: "开始评估" })).toBeVisible();
});

test("submit API validates missing and invalid answers, then returns a result", async ({
  request,
}) => {
  const missingAnswersResponse = await request.post("/api/submit", {
    data: {},
  });

  expect(missingAnswersResponse.status()).toBe(400);
  await expect(missingAnswersResponse.json()).resolves.toEqual({
    error: "Missing answers.",
  });

  const answers = Object.fromEntries(
    typedQuestions.map((question) => [question.id, 4 as AnswerValue]),
  ) as Answers;
  const invalidAnswers = { ...answers, M01: 6 };
  const invalidAnswersResponse = await request.post("/api/submit", {
    data: { answers: invalidAnswers },
  });

  expect(invalidAnswersResponse.status()).toBe(400);
  await expect(invalidAnswersResponse.json()).resolves.toMatchObject({
    error: expect.stringContaining("invalid answers: M01"),
  });

  const response = await request.post("/api/submit", {
    data: { answers },
  });
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.result.title).toMatch(/^Human [1-3]\.[1-3]｜/);
  expect(body.result.scoring).toBeDefined();
  expect(body.result.scoring.missingQuestionIds).toEqual([]);
  expect(body.result.answers).toEqual(answers);

  const scoreResponse = await request.post("/api/assessment/score", {
    data: { id: "e2e-score", answers },
  });
  const scoreBody = await scoreResponse.json();

  expect(scoreResponse.status()).toBe(200);
  expect(scoreBody.data.id).toBe("e2e-score");
  expect(scoreBody.data.answers).toEqual(answers);

  const encodeResponse = await request.post("/api/share/encode", {
    data: { answers },
  });
  const encodeBody = await encodeResponse.json();

  expect(encodeResponse.status()).toBe(200);
  expect(encodeBody.data.code).toMatch(/^v1\.[1-5]{48}$/);
  expect(encodeBody.data.path).toMatch(/^\/result\/share\?a=v1\./);

  const decodeResponse = await request.post("/api/share/decode", {
    data: { code: encodeBody.data.code },
  });
  const decodeBody = await decodeResponse.json();

  expect(decodeResponse.status()).toBe(200);
  expect(decodeBody.data.answers).toEqual(answers);
});
