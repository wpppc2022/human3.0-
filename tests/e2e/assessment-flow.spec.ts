import { expect, test, type Page } from "@playwright/test";

const progressStorageKey = "human-3-assessment-progress";

async function clearBrowserState(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
}

async function answerCurrentQuestion(page: Page, nextButtonName: string) {
  await page.getByRole("radio", { name: /比较符合/ }).click();
  await page.getByRole("button", { name: nextButtonName }).click();
}

test.beforeEach(async ({ page }) => {
  await clearBrowserState(page);
});

test("home page starts the assessment", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "Human 3.0 自我发展评估" }),
  ).toBeVisible();
  await expect(page.getByText("这不是人格标签，也不是心理诊断。")).toBeVisible();

  await page.getByRole("link", { name: /开始评估/ }).click();

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
      }, progressStorageKey),
    )
    .toBe(1);

  await page.reload();

  await expect(page.getByText("2 / 48")).toBeVisible();
  await expect(page.getByText("已回答 1 题")).toBeVisible();
});

test("user can complete assessment, view result, and open share link", async ({
  page,
}) => {
  await page.goto("/assessment");

  for (let index = 0; index < 48; index += 1) {
    await expect(page.getByText(`${index + 1} / 48`)).toBeVisible();
    await answerCurrentQuestion(page, index === 47 ? "查看结果" : "下一题");
  }

  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByText("你的 Human 3.0 当前画像")).toBeVisible();
  await expect(page.getByText("Lifestyle Archetype")).toBeVisible();
  await expect(page.getByText("Core Problem")).toBeVisible();
  await expect(page.getByText("Immediate Next Action")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    /rawScore|averageScore|平均分|原始分数|失衡分/,
  );

  const shareInput = page.getByLabel("结果链接");
  await expect(shareInput).toHaveValue(/\/result\/share\?a=v1\.[1-5]{48}$/);
  const shareUrl = await shareInput.inputValue();

  await page.goto(shareUrl);

  await expect(page.getByText("你的 Human 3.0 当前画像")).toBeVisible();
  await expect(page.getByText("Cross-Quadrant Dynamics")).toBeVisible();
  await expect(page.getByRole("link", { name: "我也测一次" })).toBeVisible();
});
