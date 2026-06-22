# Development Log

## 2026-06-22

### Living PRD 建立

- 完成：新增 `docs/PRD.md`，作为面向用户和后续 AI 的单一产品事实来源。
- 完成：PRD 覆盖产品概述、目标用户、免费版、付费版、核心模型、已完成功能、需求池、开发同步规则和验收标准。
- 完成：同步更新 `docs/HANDOFF.md`，明确 PRD 为产品事实来源，并把 Living PRD 加入已完成状态。
- 完成：同步更新 `docs/TODO.md`，补充结果系统传播化升级、分享卡片增强和 AI 月度成长教练任务。
- 完成：同步更新 `docs/DECISIONS.md`，记录 PRD 成为单一产品事实来源的决策。
- 修改文件：`docs/PRD.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：PRD 已建立，但后续每次需求变化都需要主动同步维护，否则会重新分散。
- 下一步建议：优先围绕 PRD 中的 P0 方向升级免费结果系统和题目审校。

### 第一阶段：项目基础结构

- 完成：创建 Next.js、TypeScript、Tailwind CSS、shadcn/ui、pnpm 项目。
- 修改文件：`package.json`、`app/`、`components/ui/`、`app/globals.css`、`components.json`。
- 当前风险：pnpm 安装时曾因构建脚本审批机制中断，已用非交互安装继续；需要通过构建验证。
- 下一步建议：保持依赖版本锁定，避免频繁升级主框架。

### 第二阶段：数据模型和 JSON

- 完成：创建四象限、9 个阶段、48 道题、行动建议和结果模板。
- 修改文件：`data/questions.json`、`data/stages.json`、`data/quadrants.json`、`data/recommendations.json`、`data/result-templates.json`。
- 当前风险：题目尚未经过真实用户访谈和心理测量审校。
- 下一步建议：先做产品语气审校，再决定是否增加题库版本。

### 第三阶段：计分逻辑

- 完成：实现反向计分、象限分数、象限状态、Human 层级、阶段、主导象限和限制象限。
- 修改文件：`lib/scoring.ts`、`lib/types.ts`、`lib/constants.ts`、`tests/scoring.test.ts`。
- 当前风险：层级和阶段阈值是 MVP 默认阈值，需要产品验证。
- 下一步建议：用 10-20 个样例答案校准结果分布。

### 第四阶段：首页和答题页

- 完成：首页、四象限简介、评估结果示例、免责声明、答题页、上一题/下一题、选中状态和进度条。
- 修改文件：`app/page.tsx`、`app/assessment/page.tsx`、`components/AssessmentIntro.tsx`、`components/AssessmentFlow.tsx`、`components/QuestionCard.tsx`、`components/ProgressBar.tsx`。
- 当前风险：移动端已按响应式设计，但还需要真机检查。
- 下一步建议：补 Playwright 或手工走完整答题流程。

### 第五阶段：结果页和结果生成

- 完成：结果生成、顶部结果、四象限状态、核心判断、主要限制因素、行动建议和静态分享卡片。
- 修改文件：`lib/result-builder.ts`、`app/result/page.tsx`、`app/result/[id]/page.tsx`、`app/api/submit/route.ts`、`components/ResultClient.tsx`、`components/ResultSummary.tsx`、`components/QuadrantMap.tsx`、`components/RecommendationBlock.tsx`、`components/ShareCard.tsx`。
- 当前风险：`/result/[id]` 第一版没有真实远程读取，只是预留路由。
- 下一步建议：接入 Supabase 后让分享链接读取服务器结果。

### 第六阶段：localStorage 保存和恢复

- 完成：答题进度保存、刷新恢复、结果保存和结果读取。
- 修改文件：`lib/storage.ts`、`components/AssessmentFlow.tsx`、`components/ResultClient.tsx`。
- 当前风险：localStorage 清除后结果不可恢复，这是第一版预期行为。
- 下一步建议：接入数据库前在页面上保持清晰说明。

### 第七阶段：文档和交接

- 完成：补齐 README、产品文档、模型文档、计分规则、数据 schema、技术架构、决策、TODO、开发日志和交接文档。
- 修改文件：`README.md`、`docs/`。
- 当前风险：后续每次改动都必须同步维护文档，否则交接质量会下降。
- 下一步建议：把文档更新加入每次开发完成标准。

### 验证记录

- 完成：`pnpm test` 通过，5 个测试通过。
- 完成：`pnpm lint` 通过。
- 完成：`pnpm build` 通过。
- 完成：本地开发服务器已启动，地址为 `http://localhost:3000`。
- 当前风险：尚未做真实移动设备手工验收。
- 下一步建议：用手机浏览器完整完成一次评估并检查阅读体验。

### 开发服务器字体修复

- 完成：移除 `next/font/google`，改用系统中文字体栈。
- 修改文件：`app/layout.tsx`、`app/globals.css`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：无外部字体依赖后视觉会略不同，但中文显示更稳定。
- 下一步建议：刷新浏览器确认首页正常显示。

### 工程交接审计

- 完成：检查 README、HANDOFF、MODEL、SCORING_RULES，补齐构建方式、关键业务规则、页面入口、数据文件说明、边界情况和下一步建议。
- 完成：新增 `data/site-content.json`，将首页产品文案从组件中移出。
- 完成：新增 `scripts/validate-data.mjs` 和 `pnpm validate:data`，验证题库字段、48 题、四象限各 12 题、反向题、阶段覆盖、象限覆盖和建议覆盖。
- 完成：检查代码结构，确认计分在 `lib/scoring.ts`，结果生成在 `lib/result-builder.ts`，类型在 `lib/types.ts`，localStorage 在 `lib/storage.ts`。
- 完成：运行 `pnpm install`、`pnpm validate:data`、`pnpm test`、`pnpm lint`、`pnpm build`，全部通过。
- 完成：浏览器验证首页进入测评、答题选择、下一题、刷新恢复、上一题、完成后进入结果页、结果页不展示原始分数。
- 完成：移动端 390px 宽度检查首页、答题页、结果页无横向溢出；答题页底部增加安全留白，避免开发工具浮层遮挡按钮。
- 修改文件：`README.md`、`docs/HANDOFF.md`、`docs/MODEL.md`、`docs/SCORING_RULES.md`、`docs/DATA_SCHEMA.md`、`docs/DECISIONS.md`、`docs/TODO.md`、`docs/DEVELOPMENT_LOG.md`、`data/site-content.json`、`scripts/validate-data.mjs`、`package.json`、`components/AssessmentIntro.tsx`、`components/AssessmentFlow.tsx`、`app/page.tsx`、`lib/types.ts`。
- 当前风险：Human 阶段阈值仍是 MVP 默认规则；题目尚未完成产品/测量审校；还没有正式端到端自动化测试。
- 下一步建议：从 `docs/HANDOFF.md` 开始接手，优先补 `result-builder` 测试和端到端测试，再校准计分阈值。

### Git 存档

- 完成：初始化 Git 仓库，并准备将当前可交接 MVP 状态作为首次提交存档。
- 修改文件：`docs/DEVELOPMENT_LOG.md`。
- 当前风险：仓库当前仅为本地 Git 存档，尚未绑定远程仓库。
- 下一步建议：如需多人协作，创建远程仓库并推送当前提交。

### 免费结果系统升级

- 完成：按 Living PRD 升级免费结果系统，新增 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics 和 24 小时 Immediate Next Action。
- 完成：扩展 `data/result-templates.json`，为 9 个 Human 阶段补充传播型结果名、生活方式原型、核心问题和象限互动模板。
- 完成：扩展 `data/recommendations.json`，为每个限制象限补充 `immediateAction`。
- 完成：更新 `lib/result-builder.ts` 和 `lib/types.ts`，让报告输出新字段，并让分享卡片使用 Metatype 和即时行动。
- 完成：更新结果页展示，在顶部结果、行动建议和分享卡片中呈现新字段。
- 完成：结果页改为用 localStorage 中的答案和当前模板重建结果，兼容旧缓存结果结构。
- 完成：补充 `tests/result-builder.test.ts`，覆盖免费结果字段、限制象限建议、分享卡片和模板缺失错误。
- 完成：增强 `scoreAssessment` 运行时答案校验，非法答案会抛出包含题号的错误。
- 完成：增强 `pnpm validate:data`，校验结果模板覆盖、模板字段、关键词和 24 小时行动。
- 完成：运行 `pnpm install`、`pnpm validate:data`、`pnpm test`、`pnpm lint`、`pnpm build`，全部通过；测试数从 5 个增加到 10 个。
- 完成：浏览器检查 `/result`，确认 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action 和分享卡片可见，且不展示原始分数。
- 修改文件：`data/result-templates.json`、`data/recommendations.json`、`lib/types.ts`、`lib/scoring.ts`、`lib/result-builder.ts`、`components/ResultSummary.tsx`、`components/RecommendationBlock.tsx`、`components/ShareCard.tsx`、`components/ResultClient.tsx`、`tests/scoring.test.ts`、`tests/result-builder.test.ts`、`scripts/validate-data.mjs`、`docs/`。
- 当前风险：Metatype 和核心问题文案仍需真实用户反馈审校；分享卡片视觉还只是增强文案，没有实现图片下载。
- 下一步建议：运行端到端测试或手工浏览器检查结果页视觉，再继续做分享图下载和 Supabase 分享链接。

### 分享卡片下载

- 完成：新增 `lib/share-card-image.ts`，使用浏览器 Canvas 生成 1080x1440 PNG 分享卡片。
- 完成：在 `components/ShareCard.tsx` 增加“下载 PNG”按钮。
- 完成：浏览器检查结果页，确认“下载 PNG”按钮可见，点击后无控制台错误。
- 完成：同步更新 PRD、README、HANDOFF、TECHNICAL_ARCHITECTURE、TODO 和 DECISIONS。
- 修改文件：`components/ShareCard.tsx`、`lib/share-card-image.ts`、`docs/PRD.md`、`docs/TODO.md`、`docs/HANDOFF.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/DECISIONS.md`、`README.md`。
- 当前风险：Canvas 生成图的视觉仍需真实社交平台场景审校；移动端浏览器下载行为可能因平台而异。
- 下一步建议：用手机浏览器测试 PNG 下载和分享路径。

### 静态分享链接

- 完成：新增 `lib/share-link.ts`，将 48 个答案按题目顺序编码为 `v1.<48 digits>`，并支持从分享码解码答案。
- 完成：新增 `/result/share?a=...` 路由和 `components/SharedResultClient.tsx`，可不依赖 localStorage 重建分享结果。
- 完成：在 `components/ShareCard.tsx` 增加“复制链接”按钮，支持 Clipboard API 和文本框回退复制。
- 完成：新增 `tests/share-link.test.ts`，覆盖编码、解码、路径生成、缺失答案和非法分享码。
- 完成：运行 `pnpm test`，当前 14 个测试通过；运行 `pnpm build`，`/result/share` 路由构建通过。
- 完成：浏览器验证结果链接输入框可见，复制出的 `/result/share?a=...` 链接可重建结果页，且不展示原始分数。
- 修改文件：`lib/share-link.ts`、`components/ShareCard.tsx`、`components/SharedResultClient.tsx`、`app/result/share/page.tsx`、`tests/share-link.test.ts`、`docs/`。
- 当前风险：静态分享链接包含答案码，不适合作为长期隐私方案。
- 下一步建议：接入 Supabase 后，用数据库短链接替代 `/result/share?a=...`。

### 严格数据校验和本地验收命令

- 完成：增强 `scripts/validate-data.mjs`，新增字段集合、重复项、题号格式、阶段编号一致性、推荐项数量、模板占位符和受保护人格测试名称检查。
- 完成：新增 `pnpm check`，串联运行 `pnpm validate:data`、`pnpm test`、`pnpm lint` 和 `pnpm build`。
- 完成：同步更新 README、DATA_SCHEMA、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`scripts/validate-data.mjs`、`package.json`、`README.md`、`docs/DATA_SCHEMA.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：校验脚本仍是手写规则，不是通用 JSON schema；如果未来数据结构大改，需要同步更新脚本。
- 下一步建议：把 `pnpm check` 接入 CI，并继续补 Playwright 端到端测试。

### Playwright 端到端测试

- 完成：新增 Playwright 依赖、`playwright.config.ts` 和 `pnpm test:e2e`。
- 完成：端到端测试覆盖首页进入测评、答题进度刷新恢复、完成 48 题、结果页核心字段、不展示原始分数、静态分享链接重建结果和移动端核心控件。
- 完成：`pnpm check` 已纳入 Playwright 端到端测试。
- 完成：收窄 Vitest 配置，只运行 `tests/**/*.test.ts`，避免读取 Playwright `.spec.ts` 文件。
- 完成：安装 Chromium 测试浏览器，并运行 `pnpm test:e2e`，4 个端到端测试通过。
- 完成：运行 `pnpm check`，数据校验、14 个单元测试、lint、生产构建和 4 个端到端测试全部通过。
- 完成：同步更新 README、PRD、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`package.json`、`pnpm-lock.yaml`、`.gitignore`、`playwright.config.ts`、`vitest.config.ts`、`tests/e2e/assessment-flow.spec.ts`、`tests/e2e/mobile.spec.ts`、`docs/`、`README.md`。
- 当前风险：E2E 目前覆盖核心 happy path，尚未覆盖异常分享链接、无本地结果、下载 PNG 和 API 路由。
- 下一步建议：把 `pnpm check` 接入 CI，并继续扩展异常路径测试。

### GitHub Actions CI

- 完成：新增 `.github/workflows/ci.yml`，在 push、pull request 和手动触发时运行 CI。
- 完成：CI 使用 Node.js 22、pnpm 11.5.3、锁文件安装依赖、安装 Playwright Chromium，并执行 `pnpm check`。
- 完成：为 Playwright 浏览器目录配置 Actions cache，降低后续运行耗时。
- 完成：在 `package.json` 增加 `packageManager` 字段，固定 pnpm 版本。
- 完成：同步更新 README、PRD、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`.github/workflows/ci.yml`、`package.json`、`README.md`、`docs/PRD.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：CI 已配置但尚未在远程仓库实际运行，首次 push 后需要检查 Actions 日志。
- 下一步建议：推送远程仓库并观察首次 CI 运行；若浏览器安装耗时过长，再拆分 job 或优化缓存策略。

### 异常路径和 API E2E 覆盖

- 完成：扩展 `tests/e2e/assessment-flow.spec.ts`，新增无本地结果页、无效分享链接和 `/api/submit` 提交接口测试。
- 完成：API E2E 覆盖缺失答案返回 400，以及完整答案返回结果对象、无缺失题目和答案回显。
- 完成：运行 `pnpm test:e2e`，7 个端到端测试通过。
- 完成：同步更新 README、PRD、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`tests/e2e/assessment-flow.spec.ts`、`README.md`、`docs/PRD.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：E2E 仍未覆盖 PNG 下载和更多边界输入，例如损坏 localStorage、非法答案值、过短或过长分享码。
- 下一步建议：继续补下载 PNG 和边界输入测试，或进入题目与结果文案审校。

### 分享卡片 PNG 下载 E2E

- 完成：在完整测评 E2E 中点击“下载 PNG”，监听浏览器下载事件。
- 完成：校验下载文件名符合 `human-3-result-{stage}.png`，文件大小大于 10KB，且文件头符合 PNG 签名。
- 完成：运行 `pnpm test:e2e`，7 个端到端测试通过。
- 完成：同步更新 README、PRD、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`tests/e2e/assessment-flow.spec.ts`、`README.md`、`docs/PRD.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：桌面端下载已自动化验证；移动端浏览器下载行为和社交平台实际展示效果仍需真机验收。
- 下一步建议：补更多边界输入测试，或进入题目与结果文案审校。

### localStorage 和边界输入防护

- 完成：增强 `lib/storage.ts`，读取答题进度和结果时校验缓存结构、`currentIndex` 和答案值范围。
- 完成：损坏或旧结构 localStorage 会按无缓存处理，答题页回到第 1 题，结果页提示重新评估。
- 完成：扩展 E2E，覆盖损坏答题进度、损坏本地结果、API 非法答案值。
- 完成：扩展 `tests/share-link.test.ts`，覆盖过长分享码、非法字符和空答案码。
- 完成：运行 `pnpm test`，14 个单元测试通过；运行 `pnpm test:e2e`，9 个端到端测试通过。
- 完成：运行 `pnpm check`，数据校验、单元测试、lint、生产构建和端到端测试全部通过。
- 完成：同步更新 README、PRD、TECHNICAL_ARCHITECTURE、HANDOFF、TODO 和 DECISIONS。
- 修改文件：`lib/storage.ts`、`tests/e2e/assessment-flow.spec.ts`、`tests/share-link.test.ts`、`README.md`、`docs/PRD.md`、`docs/TECHNICAL_ARCHITECTURE.md`、`docs/HANDOFF.md`、`docs/TODO.md`、`docs/DECISIONS.md`、`docs/DEVELOPMENT_LOG.md`。
- 当前风险：还可以继续扩展更多 API 边界，例如非 JSON 请求体、额外字段和极端答案组合。
- 下一步建议：进入题目与结果文案审校，或继续补 API 和分享链接边界测试。
