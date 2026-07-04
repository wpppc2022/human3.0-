import { expect, test } from "@playwright/test";

test("mobile home menu opens detail view and closes", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "打开菜单" }).click();
  await expect(page.getByRole("navigation", { name: "移动端菜单" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");

  await page.getByRole("button", { name: /测试/ }).click();
  await expect(
    page.locator(".mobile-menu").getByRole("link", { name: /开始评估/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: /返回/ }).click();
  await expect(page.getByRole("button", { name: /概览/ })).toBeVisible();

  await page.getByRole("button", { name: "关闭菜单" }).click();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("mobile shared nav menu opens detail view and closes", async ({ page }) => {
  await page.goto("/assessment");

  await page.getByRole("button", { name: "打开菜单" }).click();
  await expect(page.getByRole("navigation", { name: "移动端菜单" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");

  await page.getByRole("button", { name: /结果/ }).click();
  await expect(page.getByRole("link", { name: /查看结果/ })).toBeVisible();

  await page.getByRole("button", { name: /返回/ }).click();
  await expect(page.getByRole("button", { name: /支持/ })).toBeVisible();

  await page.getByRole("button", { name: "关闭菜单" }).click();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("mobile menu reloads the home runtime before jumping to an anchor", async ({ page }) => {
  await page.goto("/assessment");
  await page.evaluate(() => {
    (window as typeof window & { __homeNavigationMarker?: string }).__homeNavigationMarker =
      "soft-navigation-survives";
  });

  await page.getByRole("button", { name: "打开菜单" }).click();
  await page.getByRole("button", { name: /概览/ }).click();
  await page.getByRole("link", { name: /为什么需要/ }).click();

  await expect(page).toHaveURL(/\/#why$/);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __homeNavigationMarker?: string })
            .__homeNavigationMarker,
      ),
    )
    .toBeUndefined();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const canvas = document.querySelector<HTMLCanvasElement>("#particle-hero-canvas");
        const runtimeWindow = window as typeof window & {
          __human3ParticleStats?: { count: number };
        };
        return Boolean(canvas && canvas.width > 300 && runtimeWindow.__human3ParticleStats?.count);
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() => document.querySelector("#why")?.getBoundingClientRect().top ?? 9999),
    )
    .toBeLessThan(100);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("mobile assessment screen keeps core controls visible", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());

  await page.getByRole("link", { name: /开始评估/ }).first().click();

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

test("mobile home card tracks snap without page overflow", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844, minimumPeek: 24, maximumPeek: 40 },
    { width: 320, height: 568, minimumPeek: 20, maximumPeek: 28 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/#levels");

    const tracks = page.locator("[data-card-track]");
    await expect(tracks).toHaveCount(2);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);

    for (const track of await tracks.all()) {
      await track.evaluate((element) => {
        element.scrollLeft = 0;
      });
      await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThanOrEqual(2);

      const metrics = await track.evaluate((element) => {
        const cards = Array.from(element.querySelectorAll<HTMLElement>(".insight-card"));
        const trackRect = element.getBoundingClientRect();
        const secondRect = cards[1].getBoundingClientRect();
        const secondStyle = window.getComputedStyle(cards[1]);
        const style = window.getComputedStyle(element);
        return {
          cardWidth: cards[0].getBoundingClientRect().width,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
          nextCardPeek: trackRect.right - secondRect.left,
          secondOpacity: secondStyle.opacity,
          secondTransform: secondStyle.transform,
          scrollSnapType: style.scrollSnapType,
          touchAction: style.touchAction,
        };
      });

      expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
      expect(metrics.scrollHeight).toBe(metrics.clientHeight);
      expect(metrics.cardWidth).toBeLessThanOrEqual(viewport.width);
      expect(metrics.nextCardPeek).toBeGreaterThanOrEqual(viewport.minimumPeek);
      expect(metrics.nextCardPeek).toBeLessThanOrEqual(viewport.maximumPeek);
      expect(metrics.secondOpacity).toBe("1");
      expect(metrics.secondTransform).toBe("none");
      expect(metrics.scrollSnapType).toContain("mandatory");
      expect(metrics.touchAction).toContain("pan-x");

      const secondCardOffset = await track.evaluate((element) => {
        const secondCard = element.querySelectorAll<HTMLElement>(".insight-card")[1];
        element.scrollTo({ left: secondCard.offsetLeft, behavior: "auto" });
        return secondCard.offsetLeft;
      });
      await expect
        .poll(() => track.evaluate((element) => element.scrollLeft))
        .toBeGreaterThanOrEqual(secondCardOffset - 2);

      const thirdCardState = await track.evaluate((element) => {
        const thirdCard = element.querySelectorAll<HTMLElement>(".insight-card")[2];
        const trackRect = element.getBoundingClientRect();
        const thirdRect = thirdCard.getBoundingClientRect();
        const style = window.getComputedStyle(thirdCard);
        return {
          visibleWidth: trackRect.right - thirdRect.left,
          opacity: style.opacity,
          transform: style.transform,
          noVerticalOverflow: element.scrollHeight === element.clientHeight,
        };
      });

      expect(thirdCardState.visibleWidth).toBeGreaterThan(0);
      expect(thirdCardState.opacity).toBe("1");
      expect(thirdCardState.transform).toBe("none");
      expect(thirdCardState.noVerticalOverflow).toBe(true);
    }
  }
});
