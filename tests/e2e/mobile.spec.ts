import { expect, test } from "@playwright/test";

test("mobile assessment screen keeps core controls visible", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());

  await page.getByRole("link", { name: /开始评估/ }).click();

  await expect(page.getByText("1 / 48")).toBeVisible();
  await expect(page.getByRole("radio", { name: /不确定/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "上一题" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "下一题" })).toBeDisabled();

  await page.getByRole("radio", { name: /不确定/ }).click();
  await expect(page.getByRole("button", { name: "下一题" })).toBeEnabled();

  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
