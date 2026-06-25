import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-static";

async function loadHomePrototype() {
  const filePath = path.join(
    process.cwd(),
    "ui-prototypes",
    "human-3-ui-v2.html",
  );
  const html = await readFile(filePath, "utf8");
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);

  if (!styleMatch) {
    throw new Error("Cannot find style in ui-prototypes/human-3-ui-v2.html");
  }

  if (!bodyMatch) {
    throw new Error("Cannot find body in ui-prototypes/human-3-ui-v2.html");
  }

  const body = bodyMatch[1]
    .replace(
      /\s*<aside class="debug-panel" id="debug-panel"[\s\S]*?<\/aside>/,
      "",
    )
    .replace(
      /\s*const debugPanel = document\.getElementById\("debug-panel"\);[\s\S]*?window\.addEventListener\("resize", updateDebugPanel\);/,
      "",
    )
    .replace(
      `function draw(now) {
          const elapsed = now - phaseStart;
          const duration = timings[phase];
          const t = Math.min(elapsed / duration, 1);
          if (t >= 1) nextPhase(now);`,
      `function draw(now) {
          let elapsed = now - phaseStart;
          let duration = timings[phase];
          let t = Math.min(elapsed / duration, 1);
          if (t >= 1) {
            nextPhase(now);
            elapsed = 0;
            duration = timings[phase];
            t = 0;
          }`,
    )
    .replaceAll('href="human-3-assessment-v2.html"', 'href="/assessment"')
    .replaceAll(
      'href="human-3-result-v2.html"',
      'href="/result"',
    );

  return {
    style: styleMatch[1],
    body,
  };
}

export default async function HomePage() {
  const prototype = await loadHomePrototype();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: prototype.style }} />
      {/* API boundary note:
          This page intentionally renders the static prototype body as the
          visual source of truth. Future content API wiring should replace data
          inside these existing sections only:
          hero -> site-content, quadrants -> quadrants,
          levels -> stages, preview/final -> result-templates/site-content.
          Keep the original DOM/class structure unless the UI prototype changes.
       */}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: prototype.body }}
      />
    </>
  );
}
