import { expect, test } from "@playwright/test";

test("template gallery lists metadata and keeps filters in the URL", async ({ page }) => {
  await page.goto("/debug/template-gallery");

  await expect(page.getByRole("heading", { name: "Template Gallery" })).toBeVisible();
  await expect(page.locator("[data-template-id]")).toHaveCount(12);
  await expect(page.getByText("12 templates")).toBeVisible();

  await page.getByRole("tab", { name: "Page" }).click();
  await expect(page).toHaveURL(/type=page/);
  await expect(page.locator("[data-template-id]")).toHaveCount(5);

  await page.goto("/debug/template-gallery?type=page&query=no-such-template");
  await expect(page.getByRole("heading", { name: "No matching templates." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Clear filters" })).toBeVisible();
});

test("template preview has an inert insert action and handles unknown IDs", async ({ page }) => {
  await page.goto("/debug/template-gallery?preview=marketing-page");

  const dialog = page.getByRole("dialog", { name: "Template preview detail" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Marketing Page" })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Insert template" })).toBeDisabled();
  await expect(page.getByText("插入动作已预留接口，本轮未连接编辑器或数据库。"))
    .toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/debug\/template-gallery$/);

  await page.goto("/debug/template-gallery?preview=missing-template");
  await expect(page.getByRole("heading", { name: "Unknown template" })).toBeVisible();
  await expect(page.getByText(/The Gallery will not guess a renderer/)).toBeVisible();
});

test("two configs reuse the same marketing template and product uses another template", async ({
  page,
}) => {
  await page.goto("/debug/template-examples/marketing-levels");
  await expect(page.locator('[data-page-template="marketing-page"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "成长不是更忙，而是更有意识。" })).toBeVisible();

  await page.goto("/debug/template-examples/marketing-transformation");
  await expect(page.locator('[data-page-template="marketing-page"]')).toBeVisible();
  await expect(page.getByRole("heading", { name: "不要把理解误认为改变。" })).toBeVisible();

  await page.goto("/debug/template-examples/product-report");
  await expect(page.locator('[data-page-template="product-page"]')).toBeVisible();
  await page.getByRole("button", { name: "这是心理诊断吗？" }).click();
  await expect(page.getByText("不是。本评估仅用于自我理解和个人发展参考。"))
    .toBeVisible();
});

test("gallery grid is responsive without page overflow", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900, columns: 3 },
    { width: 1024, height: 768, columns: 2 },
    { width: 390, height: 844, columns: 1 },
    { width: 320, height: 568, columns: 1 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(`/debug/template-gallery?qaWidth=${viewport.width}`);
    await expect(page.locator(".h3-gallery-grid")).toBeVisible();
    const gridMetrics = await page.locator(".h3-gallery-grid").evaluate((grid) => {
      const items = Array.from(grid.children).slice(0, 6);
      const columnOffsets = new Set(
        items.map((item) => Math.round(item.getBoundingClientRect().left)),
      );
      return {
        columnCount: columnOffsets.size,
        viewportWidth: window.innerWidth,
        mediumBreakpoint: window.matchMedia("(max-width: 1199px)").matches,
      };
    });
    expect(gridMetrics).toEqual({
      columnCount: viewport.columns,
      viewportWidth: viewport.width,
      mediumBreakpoint: viewport.width <= 1199,
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});

test("gallery remains readable at 200 percent text size and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/debug/template-gallery");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expect(page.getByRole("heading", { name: "Template Gallery" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
  const transition = await page.locator(".h3-gallery-card").first().evaluate(
    (card) => getComputedStyle(card).transitionDuration,
  );
  expect(["0s", "0.001s"]).toContain(transition);
});
