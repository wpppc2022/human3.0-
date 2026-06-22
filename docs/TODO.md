# TODO

说明：产品方向、功能状态和需求池以 `docs/PRD.md` 为准；本文件只记录下一步执行任务。

## P0

- 完成一次人工题目审校，确认题干语气、反向题比例和敏感表述。
- 用真实手机浏览器检查答题页和结果页。
- 确认 Human 层级和阶段阈值是否符合产品直觉。
- 审校免费结果系统文案：Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action。
- 审校分享卡片 PNG 的视觉层级、文案长度和移动端下载体验。

## P1

- 增加 Playwright 端到端测试。
- 将 `pnpm check` 接入 CI。
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
