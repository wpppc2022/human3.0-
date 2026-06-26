# Release 1.0

## 目标

Human 3.0 自我发展评估 1.0 是一个可公开试用、可分享、可交接维护的免费评估版本。

当前产品是受 Dan Koe HUMAN 3.0 知识库启发后的中文评估工具化改编，不是源头文章的完整复刻，也不是官方测评。1.0 只完成源头主干对齐和边界说明，优先保证核心评估流程、结果解释和交接维护质量。

1.0 的重点不是增加复杂商业功能，而是让当前静态评估体验稳定、克制、可验证：

- 用户可以完整完成评估。
- 用户可以理解自己的当前画像。
- 用户可以获得具体行动建议。
- 用户可以下载分享卡片或复制分享链接。
- 下一个开发者可以通过文档、数据文件、测试和 CI 继续维护。

## 1.0 范围

1.0 包含：

- 首页、答题页、结果页。
- 48 道题，四象限各 12 题。
- localStorage 保存和恢复答题进度。
- Human 1.1 到 Human 3.3 阶段判断。
- 主导象限、限制象限、四象限状态和单象限独立发展阶段。
- Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics。
- 24 小时、7 天、30 天、90 天行动建议。
- PNG 分享卡片下载。
- 两页 A4 黑底完整报告 PDF 预览和下载。
- 静态分享链接。
- `/api/submit` 预留接口。
- `/api/assessment/score` 正式评分接口。
- `/api/share/encode` 和 `/api/share/decode` 分享编码/解码接口。
- 数据校验、单元测试、端到端测试和 CI。
- 完整交接文档。
- 源头对齐与边界说明，记录在 `docs/SOURCE_ALIGNMENT.md`。

1.0 不包含：

- 登录。
- 付费。
- 用户系统。
- 数据库持久化。
- AI 自动生成报告。
- 管理后台。
- 文章系统。
- App。
- Level 4.0+ 评估。
- Metacrisis、Flow、Channels、Digital Leverage 等高级报告。
- Glitches、psychedelics 或其他高风险实践引导。
- 源头完整 Archetype / Metatype 组合系统。

## 发布门槛

1. 产品边界

- 不使用受保护的人格测试名称或表达。
- 不模仿人格类型测试。
- 不把结果写成固定身份、医学诊断、心理诊断、法律建议或职业诊断。
- 不展示原始分数。
- 不让用户误以为当前产品是 Dan Koe 官方测评或源头知识库完整复刻。
- 不把 Level 4.0+、Glitches 或高风险实践混入当前结果。

2. 内容质量

- 48 道题语气自然，适合中文用户。
- 每个象限正向题和反向题分布合理。
- 结果文案具体、克制、可行动，不玄学化，不夸大承诺。
- 免责声明在首页和结果语境中保持清晰。

3. UI 原型一致性

- 当前产品界面以 `ui-prototypes/human-3-ui-v2.html`、`human-3-assessment-v2.html`、`human-3-result-v2.html` 为基准产品化。
- 页面不再按“近似复刻”或“二次设计”路线推进；只允许在静态原型结构上接入真实业务能力。
- 黑白灰视觉系统、桌面四模块导航、移动端两级全屏菜单、问卷圆点选项、结果页报告结构和分享卡片形态需要保持与静态原型一致。

4. 工程质量

- `pnpm validate:data` 通过。
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- `pnpm test:e2e` 通过。
- `pnpm check` 通过。
- GitHub Actions CI 已配置。

5. 交接质量

- README 说明安装、运行、构建、测试、核心文件和当前状态。
- `docs/HANDOFF.md` 足够让下一个开发者快速接手。
- `docs/PRD.md` 是产品事实来源。
- `docs/DATA_SCHEMA.md` 说明数据文件字段和维护规则。
- `docs/SCORING_RULES.md` 说明计分规则和边界情况。
- `docs/SOURCE_ALIGNMENT.md` 说明与源头 HUMAN 3.0 知识库的对齐关系、主动改写和未覆盖内容。
- `docs/DEVELOPMENT_LOG.md` 记录最近改动和风险。

## 当前 1.0 状态

当前项目处于 1.0 候选推进阶段。

已满足：

- 核心评估流程可用。
- 结果页和分享能力可用。
- 数据校验、单元测试、E2E 和 CI 已建立。
- 本地完整验收命令 `pnpm check` 可用。

已完成：

- 完成一轮题目和结果文案内部发布审校，记录在 `docs/CONTENT_REVIEW.md`。
- 完成评分模型升级后的模拟画像和关键边界分数组合校准，记录在 `docs/SCORING_CALIBRATION.md`。
- 建立外部验收执行包，记录在 `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md`，可直接使用公网链接组织真实用户反馈和真机验收。
- 建立真实用户反馈和阈值复核执行指南，记录在 `docs/USER_FEEDBACK_PLAN.md`。
- 建立真实手机浏览器验收清单，记录在 `docs/MOBILE_QA_CHECKLIST.md`。
- 完成本机移动端 Chromium 验收，记录在 `docs/MOBILE_QA_REPORT.md`。
- 已补齐 GitHub CLI `workflow` scope，并成功推送远程 `main`。
- GitHub Actions 首次 CI 已触发；首跑发现 pnpm 11 构建脚本审批配置问题，修复后远程 CI 已通过，记录在 `docs/REMOTE_CI_STATUS.md`。
- 已通过 Vercel 从 GitHub `main` 部署公网测试版本，当前可访问地址：`https://human3-0-phi.vercel.app/`。
- 完成一轮 1.0 候选体验细节打磨：首页信任提示、答题提示、结果速览、分享入口和异常状态文案。
- 完成评分模型升级：每个象限新增 1.1 到 3.3 独立发展阶段，整体 Human 3.x 和 3.3 门槛按四象限协同规则收紧，避免 42/42/42/42 或 48/48/48/36 过早进入 Human 3.3。
- 完成源头对齐审计，确认 1.0 只做主干对齐与边界说明，1.1 再做题库版本和结果/行动建议扩展，2.0 再承接 Metacrisis、AI、Flow、Digital Leverage 和完整 Archetype / Metatype 系统。
- 完成 P0 UI 纠偏：直接将 `ui-prototypes/` 三份静态 HTML/CSS/JS 产品化为首页、问卷页和结果页，保留现有题库、评分、结果生成、localStorage、分享链接和 PNG 下载链路。
- 完成首页 P0 返工：`/` 已改为直接读取 `ui-prototypes/human-3-ui-v2.html` 原文件的 `<style>` 和 `<body>`，只把静态评估链接替换为 `/assessment`，并保留未来内容 API 按 section 接入的边界说明。
- P0 UI 纠偏后再次运行 `pnpm check`，数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试全部通过。
- 完成真实结果恢复：`/result` 已移除视觉复核用预设结果，正式页面只读取 localStorage 真实答题结果；无真实结果时展示空态。
- 完成正式评分和分享 API：新增 `POST /api/assessment/score`、`POST /api/share/encode`、`POST /api/share/decode`，均复用现有 `buildResult` 或 `share-link`，不写数据库、不改评分规则。
- 完成页面克制接入：`/assessment` 完成答题后优先走评分 API，失败时本地回退；`/result/share` 优先走分享解码 + 评分 API，失败时本地回退；复制分享链接优先走分享编码 API。
- 完成下载验证：黑底分享卡片 PNG 和完整报告 PDF 已纳入 E2E 下载校验。
- 完成 PDF 导出版式重构：新增两页 A4 黑底预览版，导出时逐页捕获 PDF 专用 sheet，不再捕获长网页并切片分页；预览入口为 `/result?pdfPreview=1` 或 `/result/share?a=...&pdfPreview=1`。
- 真实结果和 API 接入后再次运行 `pnpm check`，数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试全部通过。

仍需完成或确认：

- 由 UI 视觉与交互窗口优先对照 `ui-prototypes/human-3-ui-v2.html` 和 `/` 做人工复核，确认首页已符合“直接套用原文件”的要求；再复核 `/assessment`、`/result`、`/result/share`。
- 由总控安排 GitHub/Vercel 同步窗口，把本地已通过验证的真实结果和 API 接入版本发布到远程。
- 按 `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md` 执行外部验收闭环，并回填结果。
- 按 `docs/USER_FEEDBACK_PLAN.md` 找 3 到 5 位真实用户完成题目和结果阅读反馈。
- 按 `docs/USER_FEEDBACK_PLAN.md` 用真实用户或产品团队样例继续复核阶段阈值的产品直觉。
- 按 `docs/MOBILE_QA_CHECKLIST.md` 用真实 iPhone Safari 和 Android Chrome 检查答题页、结果页、分享卡片 PNG 和完整报告 PDF 下载体验。
- 由用户或 UI 窗口确认两页 A4 PDF 预览版式，包括标题字号、四象限图大小、行动建议密度和免责声明长度。

## 发布判定

当以上“仍需完成或确认”项目处理完，并且 `pnpm check` 通过后，可以将项目版本升级为 `1.0.0`，并在 `docs/DEVELOPMENT_LOG.md` 记录 1.0 发布。
