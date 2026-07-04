import { readFile } from "node:fs/promises";
import path from "node:path";

import { HomePrototypeMenuController } from "@/components/HomePrototypeMenuController";

export const dynamic = "force-static";

const HOME_MOBILE_MENU = `
        <button class="menu-button" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="home-mobile-menu">≡</button>
      </div>
      <nav class="mobile-menu" id="home-mobile-menu" data-open="false" data-view="root" aria-label="移动端菜单">
        <button class="mobile-menu-close" type="button" aria-label="关闭菜单">×</button>
        <div class="mobile-menu-track">
          <div class="mobile-menu-screen">
            <div class="mobile-menu-heading">Menu</div>
            <button class="mobile-module" type="button" data-menu-key="overview">概览 <span>Overview</span></button>
            <button class="mobile-module" type="button" data-menu-key="assessment">测试 <span>Assessment</span></button>
            <button class="mobile-module" type="button" data-menu-key="result">结果 <span>Result</span></button>
            <button class="mobile-module" type="button" data-menu-key="support">支持 <span>Support</span></button>
          </div>
          <div class="mobile-menu-screen">
            <button class="mobile-back" type="button">‹ 返回</button>
            <div class="mobile-detail-title">HUMAN 3.0</div>
            <div class="mobile-subitems" data-active="false" data-panel="overview">
              <a class="mobile-subitem" href="#why">为什么 <span>模型</span></a>
              <a class="mobile-subitem" href="#quadrants">四象限 <span>系统</span></a>
              <a class="mobile-subitem" href="#levels">发展层级 <span>层级</span></a>
            </div>
            <div class="mobile-subitems" data-active="false" data-panel="assessment">
              <a class="mobile-subitem" href="/assessment">开始评估 <span>当前</span></a>
              <a class="mobile-subitem" href="#flow">评估流程 <span>说明</span></a>
              <a class="mobile-subitem" href="#quadrants">测量象限 <span>象限</span></a>
            </div>
            <div class="mobile-subitems" data-active="false" data-panel="result">
              <a class="mobile-subitem" href="/result">查看结果 <span>报告</span></a>
              <a class="mobile-subitem" href="#preview">结果预览 <span>示例</span></a>
              <a class="mobile-subitem" href="#final">边界说明 <span>声明</span></a>
            </div>
            <div class="mobile-subitems" data-active="false" data-panel="support">
              <a class="mobile-subitem" href="#final">常见问题 <span>帮助</span></a>
              <a class="mobile-subitem" href="#final">非诊断声明 <span>边界</span></a>
              <a class="mobile-subitem" href="/">返回首页 <span>首页</span></a>
            </div>
          </div>
        </div>
      </nav>`;

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
    )
    .replace(
      '        <a class="nav-cta" href="/assessment">开始评估</a>\n      </div>',
      `        <a class="nav-cta" href="/assessment">开始评估</a>\n${HOME_MOBILE_MENU}`,
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
        className="home-prototype"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: prototype.body }}
      />
      <HomePrototypeMenuController />
    </>
  );
}
