import { expect, test } from "@playwright/test";

test("card template exposes shared tokens, states, and accessible controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/debug/ui-templates");

  await expect(
    page.getByRole("heading", { name: "Human 3.0 卡片页面模板" }),
  ).toBeVisible();
  await expect(page.locator(".h3-card.h3-card--content")).toHaveCount(3);
  await expect(page.locator(".h3-media-card")).toHaveCount(2);
  await expect(page.locator("[data-carousel]")).toHaveCount(1);

  const tokenValues = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return {
      section: style.getPropertyValue("--h3-section-bg").trim(),
      card: style.getPropertyValue("--h3-card-bg").trim(),
      radius: style.getPropertyValue("--h3-card-radius").trim(),
    };
  });
  expect(tokenValues).toEqual({ section: "#111", card: "#000", radius: "8px" });

  const carousel = page.locator("[data-carousel]");
  const wideMetrics = await page.locator(".h3-carousel__track").evaluate((track) => ({
    delta: track.scrollWidth - track.clientWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(wideMetrics).toEqual({ delta: 0, viewportWidth: 1440 });
  await expect(carousel).toHaveAttribute("data-overflow", "false");
  await expect(carousel.locator(".h3-carousel__controls")).toBeHidden();

  const cards = carousel.locator(".h3-card--expandable");
  const toggles = cards.locator("[data-card-toggle]");
  await expect(toggles).toHaveCount(3);
  await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "true");

  const initialHeights = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );
  await toggles.nth(1).click();
  await expect(toggles.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(toggles.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(
    carousel.locator('.h3-card--expandable[data-expanded="true"]'),
  ).toHaveCount(1);
  expect(
    await cards.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    ),
  ).toEqual(initialHeights);

  const controlSizes = await page
    .locator(".h3-button, .h3-icon-button")
    .evaluateAll((elements) =>
      elements
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => ({
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        })),
    );
  expect(controlSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBe(
    true,
  );
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    )
    .toBe(true);
});

test("card template carousel keeps the next card visible on narrow screens", async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844, minimumPeek: 24 },
    { width: 320, height: 568, minimumPeek: 20 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/debug/ui-templates");

    const carousel = page.locator("[data-carousel]");
    const track = carousel.locator(".h3-carousel__track");
    await expect.poll(() => carousel.getAttribute("data-overflow")).toBe("true");
    await track.evaluate((element) => element.scrollTo({ left: 0, behavior: "auto" }));

    const metrics = await track.evaluate((element) => {
      const cards = element.querySelectorAll<HTMLElement>("[data-carousel-item]");
      const trackRect = element.getBoundingClientRect();
      const nextRect = cards[1].getBoundingClientRect();
      return {
        nextCardPeek: trackRect.right - nextRect.left,
        noVerticalOverflow: element.scrollHeight === element.clientHeight,
        nextOpacity: getComputedStyle(cards[1]).opacity,
        nextTransform: getComputedStyle(cards[1]).transform,
      };
    });

    expect(metrics.nextCardPeek).toBeGreaterThanOrEqual(viewport.minimumPeek);
    expect(metrics.nextCardPeek).toBeLessThanOrEqual(42);
    expect(metrics.noVerticalOverflow).toBe(true);
    expect(metrics.nextOpacity).toBe("1");
    expect(metrics.nextTransform).toBe("none");
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      )
      .toBe(true);
  }
});

test("card template disables motion when the operating system requests it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/debug/ui-templates");

  const motion = await page.locator(".h3-carousel__track").evaluate((element) => ({
    scrollBehavior: getComputedStyle(element).scrollBehavior,
    transitionDuration: getComputedStyle(element).transitionDuration,
  }));
  expect(motion.scrollBehavior).toBe("auto");
  expect(motion.transitionDuration).toBe("0s");
});
