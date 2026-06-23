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

test.beforeEach(async ({ page }) => {
  await clearBrowserState(page);
});

test("home page starts the assessment", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Human 3.0 自我发展评估" }),
  ).toBeVisible();
  await expect(page.getByText("这不是人格标签，也不是心理诊断。")).toBeVisible();
  await expect(page.getByText("48 道题")).toBeVisible();
  await expect(page.getByText("无需登录")).toBeVisible();

  await page.getByRole("link", { name: /开始评估/ }).click();

  await expect(page).toHaveURL(/\/assessment$/);
  await expect(page.getByText("1 / 48")).toBeVisible();
  await expect(page.getByText("请选择一个最接近当前状态的选项")).toBeVisible();
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
  await expect(page.getByText("已回答 1 题")).toBeVisible();
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
  await expect(page.getByText("已回答 0 题")).toBeVisible();
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
  await expect(page.getByText("你的 Human 3.0 当前画像")).toBeVisible();
  await expect(page.getByText("主导象限")).toBeVisible();
  await expect(page.getByText("主要限制", { exact: true })).toBeVisible();
  await expect(page.getByText("先做这一步")).toBeVisible();
  await expect(page.getByText("象限发展阶段")).toHaveCount(4);
  await expect(page.getByText("Lifestyle Archetype")).toBeVisible();
  await expect(page.getByText("Core Problem")).toBeVisible();
  await expect(page.getByText("别人眼中的你")).toBeVisible();
  await expect(page.getByText("Immediate Next Action")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    /rawScore|averageScore|平均分|原始分数|失衡分/,
  );

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /下载 PNG/ }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();

  expect(download.suggestedFilename()).toMatch(
    /^human-3-result-[1-3]\.[1-3]\.png$/,
  );
  expect(downloadPath).not.toBeNull();
  await expectPngFile(downloadPath as string);
  await expect(page.getByText("保存或分享结果")).toBeVisible();

  const shareInput = page.getByLabel("结果链接");
  await expect(shareInput).toHaveValue(/\/result\/share\?a=v1\.[1-5]{48}$/);
  const shareUrl = await shareInput.inputValue();

  await page.goto(shareUrl);

  await expect(page.getByText("你的 Human 3.0 当前画像")).toBeVisible();
  await expect(page.getByText("Cross-Quadrant Dynamics")).toBeVisible();
  await expect(page.getByRole("link", { name: "我也测一次" })).toBeVisible();
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
});
