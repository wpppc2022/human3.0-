# Handoff

## 项目目标

`human-3-assessment` 是 Human 3.0 自我发展评估网站的 1.0 候选版。产品目标是帮助用户看见当前人生系统状态：认知、身体、意义与事业如何协同运转，并得到阶段判断、卡点分析和下一步行动建议。

它不是人格类型测试，也不是医学、心理、法律或职业诊断工具；项目不得使用受保护的人格测试名称或表达。

它也是受 Dan Koe HUMAN 3.0 知识库启发后的中文评估工具化改编，不是源头文章的完整复刻，也不是官方测评。当前 1.0 只覆盖 Human 1.0-3.0 主干，不评估 Level 4.0+。

产品事实来源：后续产品定位、功能状态、需求池和同步规则以 `docs/PRD.md` 为准。本文件只作为 AI 或开发者快速接手摘要。

源头对齐说明：`docs/SOURCE_ALIGNMENT.md` 记录了当前中文项目与 Dan Koe 原始 HUMAN 3.0 知识库的对齐关系、缺口、主动改写、暂不纳入内容、命名风险、版权与安全边界。后续改模型或结果系统前应先阅读该文件。

## 当前完成状态

已完成 1.0 候选版核心能力：

- Living PRD：`docs/PRD.md` 已建立为单一产品事实来源，用于同步新需求、已完成功能、免费版和付费版规划。
- 首页：产品介绍、四象限简介、结果示例和免责声明。
- 答题页：48 道题、5 级选项、上一题、下一题、进度条。
- 本地保存：答题进度刷新后可恢复，最近一次结果保存在 localStorage。
- 结果页：Human 阶段、中文结果名、主导象限、限制象限、四象限状态、核心判断、主要限制因素、7 天/30 天/90 天建议、分享卡片。
- 评分模型升级：每个象限已新增独立发展阶段，整体 Human 3.x / 3.3 门槛已按四象限协同规则收紧。
- 免费结果系统：已加入 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics 和 24 小时 Immediate Next Action。
- 分享卡片下载：已支持在浏览器生成 PNG 并下载。
- 完整报告预览/下载：已支持两页 A4 黑底 PDF 报告版式，可先在浏览器预览，再用同一版式下载 PDF。
- 静态分享链接：已支持复制 `/result/share?a=...`，通过 URL 中的答案码重建同一份结果。
- 真实结果恢复：`/result` 已移除视觉复核用预设结果，正式页面只读取当前浏览器真实答题结果；无结果时展示空态。
- 体验细节：已补充首页信任提示、答题页保存/选择提示、结果页顶部速览、分享入口说明和异常状态操作入口。
- UI v2：已将 `ui-prototypes/` 静态原型的黑白灰视觉方向、Apple 式全屏移动端菜单、问卷大题居中布局、结果报告式结构整合进 Next.js 页面。
- UI v2 第一轮小修：移动端菜单已锁定 body 滚动；问卷页移动端选项改为单列行按钮并隐藏技术标签和可见数字；下一步行动已改为自定义圆点待办控件。
- API 边界：`/api/submit`、`/api/assessment/score`、`/api/share/encode`、`/api/share/decode` 和只读内容 API 已可用；当前均不写数据库。
- 测试和校验：已有核心计分测试、结果生成测试、分享链接测试、Playwright 端到端测试和严格数据校验命令。
- CI：已新增 GitHub Actions，在 push、pull request 和手动触发时运行 `pnpm check`。
- 1.0 发布前材料：已新增真实用户反馈指南和真机移动端验收清单，但对应外部测试尚未实际执行。
- 源头对齐：已新增 `docs/SOURCE_ALIGNMENT.md`，当前只做 1.0 边界说明；题库、结果模板和行动建议的源头维度扩展留到 1.1。

最近一次交接审计结果：

- `pnpm install` 通过。
- `pnpm validate:data` 通过。
- `pnpm test` 通过，63 个测试通过。
- `pnpm test:e2e` 通过，9 个端到端测试通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- `pnpm check` 通过，已串联数据校验、单元测试、代码检查、生产构建和端到端测试。
- GitHub Actions CI 已配置并已在远程触发首跑；首跑发现 pnpm 11 构建脚本审批配置问题，已在 `pnpm-workspace.yaml` 修复，修复后远程 CI 已通过。
- 公网测试链接：`https://human3-0-phi.vercel.app/`，由 Vercel 从 GitHub `main` 部署，可用于手机和真实用户测试。
- 浏览器流程验证通过：首页进入测评、答题、上一题/下一题、刷新恢复、完成后进入结果页。
- 浏览器结果页检查通过：Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action 和分享卡片可见，且不展示原始分数。
- 移动端 390px 宽度检查通过：首页、答题页、结果页和分享页无横向溢出；结果速览和分享入口可见。
- UI v2 落地后 `pnpm check` 通过：数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试全部通过。
- UI v2 第一轮小修后再次运行 `pnpm check`，数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试全部通过。
- 真实结果恢复和 API 接入后再次运行 `pnpm check`，数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试全部通过。
- PDF 导出版式重构后，`pnpm lint`、`pnpm test`、`pnpm build` 和 `pnpm test:e2e` 已通过；E2E 覆盖 PDF 预览入口、2 张 A4 sheet、黑底、两页均无 `scrollHeight > clientHeight` 裁切和 PDF 文件下载。

## 如何运行

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

默认地址：

```text
http://localhost:3000
```

公网测试地址：

```text
https://human3-0-phi.vercel.app/
```

验证命令：

```bash
pnpm validate:data
pnpm lint
pnpm test
pnpm build
```

完整本地验收命令：

```bash
pnpm check
```

环境注意：在当前 Codex 桌面环境里，系统默认路径可能没有 Node。可使用工作区内置 Node/pnpm，或在本机正常安装 Node.js 和 pnpm 后运行以上命令。

## 页面入口

- `/`：首页。
- `/assessment`：答题页。
- `/result`：读取当前浏览器最近一次结果。
- `/result?pdfPreview=1`：读取当前浏览器最近一次结果，并展示两页 A4 黑底 PDF 预览版。
- `/result/[id]`：预留分享结果路由，第一版仍读取本地结果。
- `/result/share?a=...&pdfPreview=1`：读取分享答案码并展示两页 A4 黑底 PDF 预览版，适合没有本地结果时做版式确认。
- `/api/submit`：预留服务端提交接口。
- `/api/assessment/score`：正式评分接口，接收答案并返回 `BuiltResult`，不写数据库。
- `/api/share/encode`：分享码生成接口，接收答案并返回分享码和 `/result/share?a=...` 路径。
- `/api/share/decode`：分享码解析接口，接收分享码并返回答案对象。
- `/api/content/*`：只读内容接口，包含 site-content、questions、quadrants、stages、recommendations、result-templates 和 version。

## 关键业务规则

- 题目共 48 道，Mind、Body、Spirit、Vocation 各 12 道。
- UI v2 只调整视觉、布局和交互外壳，不改变题库、评分、结果生成、免责声明、分享链接、PNG 下载或 localStorage 流程。
- 每题答案为 1 到 5。
- `reverseScored = true` 时使用 `6 - answer` 反向计分。
- 每个象限总分范围为 12 到 60。
- 结果页不展示原始分数，只展示状态：尚未稳定、正在形成、已有基础、相对成熟，以及轻量的单象限发展阶段解释。
- 每个象限会独立判断 1.1 到 3.3 的发展阶段；这只解释该象限，不代表整体 Human 阶段。
- 主导象限是得分最高象限，限制象限是得分最低象限。
- Human 阶段范围为 Human 1.1 到 Human 3.3。
- 整体 Human 3.0 必须满足平均分不低于 47、最低象限分不低于 41、失衡程度不超过 10、四象限都已有基础或更好、至少 2 个象限相对成熟。
- 整体 Human 3.3 必须满足平均分不低于 51、最低象限分不低于 49、失衡程度不超过 6、四象限都相对成熟。
- 阶段和建议不是诊断结论，只用于自我理解和个人发展参考。
- `Metatype` 和 `Lifestyle Archetype` 是本项目当前状态画像字段，不等于 Dan Koe 原文中的完整组合类型系统。
- 1.0 不纳入 Level 4.0+、Metacrisis、Channels、Flow、Digital Leverage、Glitches 或高风险实践引导。

完整规则见 `docs/SCORING_RULES.md`。

## 关键技术文件

- `lib/types.ts`：核心类型。
- `lib/scoring.ts`：计分逻辑入口，包含反向计分、象限状态、象限独立发展阶段、整体 Human 层级、阶段、主导/限制象限。
- `lib/result-builder.ts`：结果生成入口，把评分结果和 JSON 文案组合成用户报告。
- `lib/storage.ts`：localStorage 保存、恢复、清理和缓存结构校验。
- `lib/constants.ts`：站点名称、答案选项、象限顺序、状态文案。
- `lib/supabase.ts`：未来 Supabase 懒初始化入口，目前故意不接入。
- `app/page.tsx`：首页入口。当前 P0 返工后直接读取 `ui-prototypes/human-3-ui-v2.html` 的原 `<style>` 和 `<body>`，只替换开始评估等静态链接到当前路由。不要再用组件重写首页视觉结构。
- `components/AssessmentFlow.tsx`：答题流程。
- `components/SiteNav.tsx`：静态原型产品化后的共享导航，包含桌面四模块下拉导航和移动端 Apple 式两级全屏菜单。
- `components/ResultClient.tsx`：结果页本地读取。正式 `/result` 不再使用视觉复核预设结果，没有真实 localStorage 结果时展示空态。
- `components/ResultReport.tsx`：结果页静态原型产品化报告结构，复用 `result-builder` 输出、行动建议、分享卡片展示、分享链接和 PNG/PDF 下载。
- `components/PrintableResultReport.tsx`：PDF 专用两页 A4 黑底报告版式，使用真实 `BuiltResult` 数据，隐藏网页导航、按钮、菜单和分享控件。
- `lib/share-card-image.ts`：Canvas 生成 PNG 分享卡片。
- `lib/report-pdf.ts`：完整报告 PDF 下载，逐页捕获 `[data-pdf-sheet]` 后写入 A4 PDF，避免长网页截图切片；导出时规避 html2canvas 对 `lab/oklch` 颜色的兼容问题。
- `lib/stage-format.ts`：阶段展示格式化，避免 Phase 中英文重复显示。
- `lib/share-link.ts`：静态分享链接编码和解码。
- `components/SharedResultClient.tsx`：读取分享链接并重建结果；优先调用分享解码和评分 API，失败时回退到本地解码和 `buildResult`。
- `app/api/submit/route.ts`：未来提交接口。
- `app/api/assessment/score/route.ts`：正式评分接口，复用 `buildResult`。
- `app/api/share/encode/route.ts`：分享码生成接口，复用 `encodeAnswersForShare`。
- `app/api/share/decode/route.ts`：分享码解析接口，复用 `decodeAnswersFromShare`。
- `scripts/validate-data.mjs`：严格检查数据文件结构、覆盖范围、重复项、模板占位符和禁止使用的受保护人格测试名称。
- `docs/RELEASE_1_0.md`：1.0 候选发布清单和验收口径。
- `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md`：外部验收执行包，包含公网链接、真实用户反馈 checklist、真机 QA checklist、记录表和阻塞标准。
- `docs/CONTENT_REVIEW.md`：题目、结果文案和敏感边界审校记录。
- `docs/QUESTION_BANK_SCORING_TABLE.md`：48 道题、反向题、分数映射和核心公式，供产品、内容和非技术评审快速核对模型口径。
- `docs/SCORING_CALIBRATION.md`：12 个样例画像的阶段阈值校准记录。
- `docs/USER_FEEDBACK_PLAN.md`：1.0 发布前真实用户反馈和阈值复核执行指南。
- `docs/MOBILE_QA_CHECKLIST.md`：1.0 发布前真实手机浏览器验收清单。
- `docs/MOBILE_QA_REPORT.md`：本机移动端浏览器验收记录。
- `docs/REMOTE_CI_STATUS.md`：远程推送和 GitHub Actions 首跑状态记录。
- `docs/SOURCE_ALIGNMENT.md`：源头对齐审计和模型缺口说明。
- `playwright.config.ts`：端到端测试配置，会在 `127.0.0.1:3100` 启动独立测试服务。
- `tests/e2e/`：端到端测试，覆盖完整测评流程、刷新恢复、脏缓存恢复、PNG 下载、PDF 下载、无本地结果、无效分享链接、提交 API、评分 API、分享编码/解码 API、分享链接和移动端核心控件。
- `app/prototype.css`：问卷页/结果页仍使用从 `ui-prototypes/` 迁移的产品化样式。首页 `/` 现在额外直接注入 `human-3-ui-v2.html` 原始 `<style>`，以原文件为最高视觉基准。
- `.github/workflows/ci.yml`：CI 工作流，使用 Node.js 22、pnpm 11.5.3、Playwright Chromium 和 `pnpm check`。

## 数据文件说明

- `data/questions.json`：题库。产品人员改题优先改这里。
- `data/stages.json`：Human 1.1 到 Human 3.3 阶段定义。
- `data/quadrants.json`：四象限定义。
- `data/recommendations.json`：按限制象限给出的 24 小时、7 天、30 天、90 天行动建议。
- `data/result-templates.json`：结果标题模板、Metatype、生活方式原型、核心问题、象限互动、摘要和分享关键词。
- `data/site-content.json`：首页产品文案。

当前不要在 1.0 中大改 `data/questions.json` 或 `lib/scoring.ts` 来追源头完整性。源头缺口扩展应先进入 1.1 题库版本、结果模板和行动建议设计，再配套测试和数据版本说明。

改动数据后运行：

```bash
pnpm validate:data
pnpm test
```

交接或发布前运行：

```bash
pnpm check
```

## 已知问题

- `/result/[id]` 还不是真实分享链接，因为第一版没有数据库。
- `/result/share?a=...` 是当前静态分享链接方案，链接包含 48 个答案码；适合 MVP 验证，不适合作为长期隐私方案。
- localStorage 清除后，答题进度和最近一次结果不可恢复。
- 分享卡片 PNG 和两页 A4 PDF 已有桌面端 E2E 下载校验；移动端不同浏览器下载行为可能表现不同，仍需要真机验收。
- PDF 当前是可预览的 2 页 A4 黑底报告版式；Page 1 裁切已修复并有 E2E 防回归断言，仍需要用户或 UI 窗口确认标题字号、四象限图大小、行动建议密度和免责声明长度。
- 端到端测试已覆盖核心流程、脏 localStorage、PNG 下载、PDF 预览、PDF 下载、无本地结果、无效分享链接、提交 API、评分 API、分享编码/解码 API 和非法答案值；仍可继续扩展更多边界输入。
- GitHub CLI 已补齐 `workflow` scope，远程 `main` 已同步；GitHub Actions CI 已触发并在修复 pnpm 构建脚本审批配置后通过，详情见 `docs/REMOTE_CI_STATUS.md`。
- Human 层级和阶段阈值已按 `docs/SCORING_MODEL_UPGRADE_SPEC.md` 升级，并用模拟画像和关键边界分数组合完成自动化校准；仍需要真实用户或产品团队样例继续复核。
- 当前四象限定义仍是 1.0 评估版：Spirit 的关系/共同体、Mind 的情绪/信念/觉察、Vocation 的资源/系统/长期影响、Body 的在场/身体感知主要在文档中说明，尚未完整进入题库和结果建议。
- 当前 `Metatype` / `Lifestyle Archetype` 可能与源头完整系统同名但不同义；后续 1.1 应决定保留并澄清，或改名为“状态名 / 生活模式 / Human Pattern”。
- 首页已按用户 P0 返工要求改为“直接套用原 HTML 文件”：`/` 读取 `ui-prototypes/human-3-ui-v2.html`，保留原 DOM、class、CSS、section 顺序、脚本和静态文案，只把开始评估链接接到 `/assessment`。问卷页和结果页仍是静态原型产品化 React 版本。
- API 边界：首页后续只允许按原 section 替换展示数据，建议映射为 `hero -> site-content`、`quadrants -> quadrants`、`levels -> stages`、`preview/final -> result-templates/site-content`。在 Debug/API 窗口方案确认前，不要重构首页内容来源。
- 静态原型产品化已通过本地 `pnpm check`：数据校验、63 个单元测试、lint、生产构建和 9 个 E2E 均通过；仍需要 UI 视觉与交互窗口逐页对照原型做人工验收。
- 真实结果恢复和 API 接入已通过本地 `pnpm check`：`/assessment` 提交优先走评分 API，`/result/share` 优先走分享解码 + 评分 API，复制分享链接优先走分享编码 API；正式结果页不再默认假结果。
- 题目尚未经过正式心理测量或大样本验证，不能宣传为科学诊断。

## 下一步建议

1. 先阅读 `docs/PRD.md`，确认当前产品方向和需求状态。
2. 阅读 `docs/RELEASE_1_0.md`，确认 1.0 候选版验收口径。
3. 阅读 `docs/QUESTION_BANK_SCORING_TABLE.md`，让产品、内容或非技术评审先确认题库、反向题和公式解释是否清楚。
4. 按 `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md` 组织外部验收，公网测试地址为 `https://human3-0-phi.vercel.app/`。
5. 按 `docs/USER_FEEDBACK_PLAN.md` 组织 3 到 5 位真实用户反馈，并把结论回填到 `docs/CONTENT_REVIEW.md` 和 `docs/SCORING_CALIBRATION.md`。
6. 用真实用户或产品团队样例继续复核 `lib/scoring.ts` 的层级和阶段阈值；当前升级规则和边界案例见 `docs/SCORING_CALIBRATION.md`。
7. 按 `docs/MOBILE_QA_CHECKLIST.md` 完成真实 iPhone Safari 和 Android Chrome 验收，并记录分享卡片 PNG 的移动端下载表现；本机 Chromium 记录见 `docs/MOBILE_QA_REPORT.md`。
8. 让 UI 视觉与交互窗口先重点核对首页：`file://.../ui-prototypes/human-3-ui-v2.html` 对照 `http://localhost:3000/`，确认首屏、导航、粒子、模型叙事、四象限、层级、流程、结果预览和 debug panel 已接近原文件。
9. 再按静态 HTML 验收标准核对 `/assessment`、`/result`、`/result/share`，重点看问卷圆点选项、结果页四象限轴线图、下一步圆点待办和分享卡片。
10. 让 UI 视觉窗口重新打开 `/result?pdfPreview=1` 或 `/result/share?a=v1.444444444444444444444444444444444444444444444444&pdfPreview=1`，确认 Page 1 不再裁切，并继续复核 PDF 版式。
11. 让总控安排 GitHub/Vercel 同步窗口，把已通过本地验证的 PDF 预览/导出版本发布到远程。
12. 继续扩展更细的边界输入端到端测试，尤其是非 JSON 请求体、极短/极长分享码和 API 回退路径。
13. 1.1 再做源头维度扩展：题库版本、结果模板和行动建议补充 Spirit 关系/共同体、Mind 情绪/信念/觉察、Vocation 资源/系统/长期影响、Body 在场/身体感知。
14. 2.0 再承接高级报告：Metacrisis、AI、Flow、Channels、Digital Leverage、完整 Archetype / Metatype 系统。
15. 接入 Supabase，落地 `assessment_submissions` 和 `assessment_versions`。
16. 让 `/result/[id]` 读取数据库结果，并替代当前 URL 答案码分享方案。
17. 实现复测记录。
