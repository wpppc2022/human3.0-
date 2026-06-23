# Release 1.0

## 目标

Human 3.0 自我发展评估 1.0 是一个可公开试用、可分享、可交接维护的免费评估版本。

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
- 静态分享链接。
- `/api/submit` 预留接口。
- 数据校验、单元测试、端到端测试和 CI。
- 完整交接文档。

1.0 不包含：

- 登录。
- 付费。
- 用户系统。
- 数据库持久化。
- AI 自动生成报告。
- 管理后台。
- 文章系统。
- App。

## 发布门槛

1. 产品边界

- 不使用受保护的人格测试名称或表达。
- 不模仿人格类型测试。
- 不把结果写成固定身份、医学诊断、心理诊断、法律建议或职业诊断。
- 不展示原始分数。

2. 内容质量

- 48 道题语气自然，适合中文用户。
- 每个象限正向题和反向题分布合理。
- 结果文案具体、克制、可行动，不玄学化，不夸大承诺。
- 免责声明在首页和结果语境中保持清晰。

3. 工程质量

- `pnpm validate:data` 通过。
- `pnpm test` 通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- `pnpm test:e2e` 通过。
- `pnpm check` 通过。
- GitHub Actions CI 已配置。

4. 交接质量

- README 说明安装、运行、构建、测试、核心文件和当前状态。
- `docs/HANDOFF.md` 足够让下一个开发者快速接手。
- `docs/PRD.md` 是产品事实来源。
- `docs/DATA_SCHEMA.md` 说明数据文件字段和维护规则。
- `docs/SCORING_RULES.md` 说明计分规则和边界情况。
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

仍需完成或确认：

- 按 `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md` 执行外部验收闭环，并回填结果。
- 按 `docs/USER_FEEDBACK_PLAN.md` 找 3 到 5 位真实用户完成题目和结果阅读反馈。
- 按 `docs/USER_FEEDBACK_PLAN.md` 用真实用户或产品团队样例继续复核阶段阈值的产品直觉。
- 按 `docs/MOBILE_QA_CHECKLIST.md` 用真实 iPhone Safari 和 Android Chrome 检查答题页、结果页和分享卡片下载体验。

## 发布判定

当以上“仍需完成或确认”项目处理完，并且 `pnpm check` 通过后，可以将项目版本升级为 `1.0.0`，并在 `docs/DEVELOPMENT_LOG.md` 记录 1.0 发布。
