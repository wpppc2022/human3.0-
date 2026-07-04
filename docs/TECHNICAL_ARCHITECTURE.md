# Technical Architecture

## 前端架构

项目使用 Next.js App Router。页面位于 `app/`，展示组件位于 `components/`，核心业务逻辑位于 `lib/`，可维护数据位于 `data/`。

交互页面采用客户端组件：

- `components/AssessmentFlow.tsx`：答题流程、进度恢复、结果生成。
- `components/ResultClient.tsx`：读取 localStorage 中最近一次结果的答案，用当前数据模板重建结果并渲染。

展示组件只接收数据并渲染，不包含计分规则。

## 组件职责

- `AssessmentIntro`：首页内容和四象限简介。
- `QuestionCard`：单题展示和 5 级选项。
- `ProgressBar`：答题进度。
- `ResultSummary`：顶部结果和核心判断。
- `QuadrantMap`：四象限状态。
- `RecommendationBlock`：7 天、30 天、90 天建议。
- `ResultReport`：结果页报告结构、行动建议、分享卡片展示、分享链接和 PNG/PDF 下载入口。
- `PrintableResultReport`：PDF 专用两页 A4 黑底报告版式，供浏览器预览和导出复用。
- `HomePrototypeMenuController`：首页静态 HTML 的移动菜单控制器，补齐原型直接渲染后不会自动执行的菜单交互。

## 核心函数

- `normalizeScore`：处理反向计分。
- `calculateQuadrantScores`：计算四象限分数和状态。
- `determineLevel`：判断 Human 1.0、2.0、3.0。
- `determinePhase`：判断 X.1、X.2、X.3。
- `scoreAssessment`：输出完整评分结果。
- `buildResult`：把评分结果、阶段、象限、建议和模板组合为用户报告，包括 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics 和 Immediate Next Action。
- `buildShareCardImage`：用 Canvas 生成黑底 PNG 分享卡片。
- `downloadFullReportPdf`：逐页捕获 `PrintableResultReport` 的 `[data-pdf-sheet]`，写入 A4 PDF；不捕获当前长结果页。
- `encodeAnswersForShare` / `decodeAnswersFromShare`：把 48 个答案编码进 URL，或从静态分享链接恢复答案。
- `formatPhaseLabel`：格式化阶段显示，避免 `phaseName` 已含中英文时再次拼接中文造成重复。

## 数据流

1. 页面加载 `data/questions.json`。
2. 用户在 `/assessment` 作答。
3. `AssessmentFlow` 将答案保存到 localStorage。
4. 完成 48 题后调用 `buildResult`。
5. 结果保存到 localStorage。
6. `/result` 读取最近一次结果的答案，并用当前数据模板重建结果后展示。这样模板升级后，旧浏览器结果也能迁移到新结构。
7. 用户复制分享链接时，`lib/share-link.ts` 将答案按题目顺序编码为 `v1.<48 digits>`，路由 `/result/share?a=...` 再解码并重建结果。

## 状态管理

第一版只使用 React state 和 localStorage。没有全局状态库。

localStorage key：

- `human-3-assessment-progress`
- `human-3-assessment-result`

`lib/storage.ts` 会在读取时校验缓存结构和答案值范围。损坏 JSON、旧结构、非法答案或非法题号进度会被视为无缓存，页面回到初始状态或提示重新评估。

## API 路由

`app/api/submit/route.ts` 是早期提交接口，仍保留为兼容入口。未来接入持久化时可复用同一套 `buildResult` 逻辑。

当前正式流程还提供以下 API：

- `app/api/assessment/score/route.ts`：正式评分接口，接收答案并返回 `BuiltResult`，不写数据库。
- `app/api/share/encode/route.ts`：分享码生成接口，复用 `lib/share-link.ts`。
- `app/api/share/decode/route.ts`：分享码解析接口，复用 `lib/share-link.ts`。
- `app/api/content/*`：只读内容接口，读取 `data/` 下的题库、象限、阶段、推荐、结果模板和站点文案。

页面接入保持克制：`/assessment` 完成答题后优先调用评分 API，失败时回退本地 `buildResult`；`/result/share` 优先调用分享解码 + 评分 API，失败时回退本地解码和生成；复制分享链接优先调用分享编码 API，失败时回退本地编码。

PDF 预览入口：

- `/result?pdfPreview=1`：用当前浏览器本地结果渲染两页 A4 黑底预览。
- `/result/share?a=...&pdfPreview=1`：用分享答案码重建结果并渲染两页 A4 黑底预览。

PDF 导出不再捕获 `.result-prototype main` 长页面，而是捕获 `PrintableResultReport` 里的两张 `[data-pdf-sheet]`。这样每张 sheet 对应 PDF 的一页，避免长截图切片造成的分页拼接感。E2E 会检查两张 sheet 的 `scrollHeight <= clientHeight`，防止模块被裁切。

当前 PDF 已按用户要求撤销未通过的 MUJI 三级分隔线试验并恢复原有单层横线。所有 `.pdf-section-title` 已统一移除前置圆点和占位，标题文字直接左对齐；正文列表的无数字圆点继续保留。E2E 检查全部小节标题无 marker、正文列表 marker 未被误删，以及两页 A4 均不裁切；普通网页结果页不受影响。

首页 `/` 的 Canvas 粒子和静态原型脚本依赖浏览器完整解析 HTML。直接加载时脚本正常执行；Next.js 客户端软导航返回首页时，`dangerouslySetInnerHTML` 插入的 `<script>` 不会再次执行，Canvas 会停在默认 `300 × 150` 且粒子运行时状态缺失。因此 `SiteNav` 中所有指向 `/` 或 `/#...` 的跨页入口，以及结果空态“返回首页”，必须使用 `FullDocumentLink` 调用 `window.location.assign` 触发完整文档加载；其他产品路由继续使用普通 `next/link`。首页内部 `#...` 锚点仍保持静态原型行为。E2E 会比较直接打开、从 `/assessment` 返回、从 `/result` 返回的 Canvas、粒子、section、导航和顶部滚动状态，并验证移动菜单完整加载后定位到目标锚点。

首页 `#levels` 与 `#false-transformation` 卡片系统继续以 `ui-prototypes/human-3-ui-v2.html` 为唯一实现源，`app/page.tsx` 不复制 DOM/CSS/JS。两组使用共享的 `.insight-carousel / .insight-track / .insight-card` 样式和 `[data-card-*]` 脚本：每组独立维护滚动位置与 `01 / 03` 索引，同组最多展开一张，卡片外部高度固定。图标使用本地 `lucide-react` 包对应图标节点的静态 SVG 输出，不增加浏览器运行时依赖。差异 token：Levels 为 `#111` section、`#000` card、桌面 `470px`；Transformation 为 `#000` section、`#121212` card、桌面 `420px`。移动端分别为 `430px / 410px`，共享 8px 圆角、1px 7% 白色边界、scroll-snap 和 reduced-motion 规则。

Carousel reveal 规则：`.insight-card` 不得参与全局逐项 `.reveal`，必须始终保持 `opacity: 1; transform: none`。进入视口动画只放在整个 `.insight-carousel` 容器上。原因是移动端下一卡只露出 23-35px，无法达到全局 IntersectionObserver 的 16% 阈值；逐卡 reveal 会让预览边缘透明，并由 translateY 扩大轨道 `scrollHeight`。E2E 在 390px/320px 检查下一卡及第三卡可见、无 transform、轨道 `scrollHeight === clientHeight`。

`app/result/share/page.tsx` 是当前静态分享路由，不依赖数据库。它适合 MVP 验证，但 URL 中包含答案码；接入 Supabase 后应优先使用 `/result/[id]` 短链接。

## Supabase 接入方式

`lib/supabase.ts` 当前只保留占位函数。未来接入时应使用懒初始化，避免构建阶段读取环境变量导致失败。

建议流程：

1. 新增 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
2. 在 `lib/supabase.ts` 创建懒初始化客户端。
3. 在 `/api/submit` 中写入 `assessment_submissions`。
4. 为结果链接 `/result/[id]` 增加服务端读取逻辑。
5. 用 `assessment_versions` 管理题库和报告版本。

## 测试

当前使用 Vitest。`tests/scoring.test.ts` 覆盖核心计分，`tests/result-builder.test.ts` 覆盖免费结果字段、限制象限建议、分享卡片和缺失模板错误，`tests/share-link.test.ts` 覆盖静态分享链接编码和解码。

数据校验使用 `scripts/validate-data.mjs`。它会检查 `data/` 目录的字段集合、题量、象限覆盖、阶段覆盖、重复项、推荐项数量、模板占位符和禁止使用的受保护人格测试名称。`pnpm check` 会串联运行数据校验、单元测试、代码检查、生产构建和端到端测试。

端到端测试使用 Playwright：

- `playwright.config.ts`：在 `127.0.0.1:3100` 启动独立 Next.js 开发服务，避免影响用户当前打开的 `localhost:3000`。
- `tests/e2e/assessment-flow.spec.ts`：覆盖首页进入测评、刷新恢复、脏缓存恢复、无本地结果、完成 48 题、结果页、PNG 下载、PDF 预览、PDF 下载、无效分享链接、静态分享链接、提交 API、评分 API 和分享编码/解码 API。
- `tests/e2e/mobile.spec.ts`：用移动端视口检查首页移动菜单、共享导航移动菜单、答题页核心控件和横向溢出。

首次运行端到端测试前需要执行：

```bash
pnpm exec playwright install chromium
```

## CI

GitHub Actions 工作流位于 `.github/workflows/ci.yml`。

触发方式：

- push 到 `main`。
- pull request 到 `main`。
- 手动触发 `workflow_dispatch`。

CI 使用 Node.js 22 和 pnpm 11.5.3，安装依赖后执行：

```bash
pnpm exec playwright install --with-deps chromium
pnpm check
```

Playwright 浏览器目录会使用 Actions cache 缓存。首次远端运行仍可能耗时较长，需要观察是否能顺利安装系统依赖和 Chromium。

未来建议补充：

- result-builder 快照测试。
- 更多 API 和分享链接边界测试。

## 暂停的架构方向

配置驱动页面模板化已暂停并降为末级 backlog，不属于当前正式产品架构，也不进入本次发布。当前生产数据流仍为静态首页原型、React 问卷/结果组件、现有评分与分享 API、localStorage 和独立 PDF 导出链路。

模板相关本地文件不会被删除，但在重新获得需求授权前，不得让其样式、路由、配置或测试进入生产提交。未来若重启该方向，应重新完成架构评审、生产环境隔离、数据契约和安全边界验证。
