# TODO

说明：产品方向、功能状态和需求池以 `docs/PRD.md` 为准；本文件只记录下一步执行任务。

## P0

- 让产品、内容或非技术评审成员阅读 `docs/QUESTION_BANK_SCORING_TABLE.md`，确认题库、反向题和公式解释是否清楚。
- 按 `docs/USER_FEEDBACK_PLAN.md` 找 3 到 5 位真实用户完成题目和结果阅读反馈。
- 按 `docs/MOBILE_QA_CHECKLIST.md` 用真实 iPhone Safari 和 Android Chrome 检查答题页和结果页。
- 按 `docs/USER_FEEDBACK_PLAN.md` 用真实用户或产品团队样例继续复核升级后的 Human 层级、阶段阈值和单象限发展阶段。
- 根据真实用户反馈继续审校免费结果系统文案：Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action。
- 审校分享卡片 PNG 的视觉层级、文案长度和移动端下载体验。

## P1

- 持续观察后续 GitHub Actions CI，确认评分模型升级后的远程构建和 E2E 仍稳定。
- 扩展 Playwright 端到端测试，覆盖更多 API 异常和分享链接边界。
- 增强分享卡片文案和视觉，使其更适合朋友圈、小红书和社群传播。
- 让 `/result/[id]` 在接入数据库后支持数据库短链接，替代当前 URL 答案码方案。

## P2

- Supabase 持久化。
- 用户复测记录。
- 题库版本管理。
- 结果报告版本管理。
- AI 月度成长教练：深度追问、false transformation 检查、月度复盘和 30 天行动计划。
- 付费能力。
- 管理后台。
