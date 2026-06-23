# User Feedback Plan

公网测试地址：

```text
https://human3-0-phi.vercel.app/
```

可直接执行的总入口见 `docs/EXTERNAL_ACCEPTANCE_EXECUTION_PACK.md`。

## 目标

本文件用于 1.0 发布前的小样本真实用户反馈。目标不是证明测评具有临床或心理测量效度，而是确认当前 1.0 候选版是否满足以下产品标准：

- 用户能顺利完成 48 道题。
- 用户理解产品不是人格标签或诊断。
- 用户觉得结果具体、克制、可行动。
- 用户能指出题目或结果中不清楚、太抽象、冒犯或过度承诺的地方。
- 用户样例能帮助复核 Human 层级和阶段阈值是否符合产品直觉。
- 用户是否能理解单象限发展阶段只是局部状态，不等于整体 Human 阶段。

## 样本建议

1. 真实用户 3 到 5 人。
2. 每位用户独立完成一次完整评估。
3. 尽量覆盖不同状态：学生、职场新人、职业转型者、自由职业者、管理者或创业者。
4. 不收集医学、心理健康、身份证件、收入、联系方式等敏感信息。
5. 只记录用户自愿提供的产品反馈和结果感受。

用户选择原则：

- 优先选择会认真阅读结果、能说出真实感受的人。
- 不需要追求人群统计代表性；本轮目标是发现阻塞 1.0 的理解、文案、完成率和传播问题。
- 每位用户使用匿名编号记录，例如 `U01`、`U02`、`U03`，不要记录真实姓名。

## 执行 Checklist

- [ ] 确认公网测试地址可打开：`https://human3-0-phi.vercel.app/`
- [ ] 为每位用户分配匿名编号。
- [ ] 复制“测试前说明”给用户。
- [ ] 用户从首页开始独立完成 48 道题。
- [ ] 记录设备、浏览器和大致完成时间。
- [ ] 记录 Human 阶段、主导象限、限制象限。
- [ ] 记录用户是否理解四象限中新增的“象限发展阶段”。
- [ ] 用户阅读结果页和分享卡片。
- [ ] 如用户愿意，尝试下载 PNG 或复制分享链接。
- [ ] 按访谈问题询问，不引导答案。
- [ ] 填写观察记录和阈值复核记录。
- [ ] 标记是否存在 P0/P1/P2 问题。

## 测试前说明

给用户看的说明：

```text
这是一个 Human 3.0 自我发展评估的 1.0 候选版测试。

测试链接：https://human3-0-phi.vercel.app/

它不是人格标签，也不是医学、心理、法律或职业诊断。请把结果当作当前状态快照和自我理解参考。

我们希望知道：
1. 题目是否自然、清楚、适合中文用户。
2. 结果是否具体、克制、可行动。
3. 哪些地方让你困惑、不舒服，或者感觉说得太满。
4. 结果是否大致符合你对自己当前状态的理解。
```

## 观察记录

每位用户记录一行：

| 字段 | 说明 |
| --- | --- |
| participant_id | 内部编号，例如 U01，不记录真实姓名。 |
| device | 设备和浏览器，例如 iPhone Safari、Android Chrome、Mac Chrome。 |
| completed | 是否完成 48 题。 |
| completion_time | 大致完成时间。 |
| result_stage | 用户得到的 Human 阶段，例如 Human 2.2。 |
| dominant_quadrant | 主导象限。 |
| weak_quadrant | 限制象限。 |
| quadrant_stage_feedback | 用户是否理解单象限发展阶段。 |
| user_fit_rating | 用户主观贴合度，1 到 5。 |
| clarity_rating | 用户主观清晰度，1 到 5。 |
| action_rating | 行动建议可执行程度，1 到 5。 |
| share_willingness | 是否愿意分享结果卡片或链接，Yes / Maybe / No。 |
| confusing_questions | 用户认为难懂或抽象的题号。 |
| uncomfortable_copy | 用户觉得冒犯、诊断化或说太满的文案。 |
| missing_context | 用户觉得结果缺少的解释。 |
| blocker_level | 是否存在 P0 / P1 / P2 / None。 |
| notes | 观察者备注。 |

可直接复制的记录表：

| participant_id | user_type | device_browser | completed | completion_time | result_stage | dominant_quadrant | weak_quadrant | quadrant_stage_feedback | user_fit_rating | clarity_rating | action_rating | share_willingness | confusing_questions | uncomfortable_copy | missing_context | blocker_level | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U01 | 职场新人 | iPhone Safari | Yes | 8 min | Human 2.2 | Mind | Body | 能理解 | 4 | 4 | 3 | Maybe | Q12 | 无 | 想知道象限含义 | None | 结果大体贴合 |

## 访谈问题

完成测评后，按顺序询问：

1. 你是否能理解这个产品在评估什么？
2. 哪些题目让你停顿、犹豫或不确定？
3. 结果标题和核心判断是否像当前状态，而不是固定身份？
4. 哪一句最像你？哪一句最不像你？
5. 主要限制象限的解释是否清楚？
6. 你是否能理解每个象限自己的发展阶段，和整体 Human 阶段不是一回事？
7. 24 小时、7 天、30 天、90 天行动建议是否具体可做？
8. 你愿意把分享卡片发给朋友吗？如果不愿意，原因是什么？
9. 你愿意把分享链接发给朋友让对方也测一次吗？如果不愿意，原因是什么？
10. 页面里有没有让你感觉被诊断、被评判或被过度承诺的表达？

## 阈值复核记录

真实用户样例用于复核阶段阈值时，不需要记录原始逐题答案。只记录结果摘要和主观判断：

| participant_id | result_stage | dominant_quadrant | weak_quadrant | user_fit_rating | product_reviewer_expected_stage | needs_threshold_review | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| U01 | Human 2.2 | Mind | Body | 4 | Human 2.2 | No | 结果和用户反馈一致。 |

判断规则：

- 如果用户贴合度低于 3，必须复核结果文案和阈值。
- 如果多位用户集中在 Human 2.2，但反馈差异很大，需要复核平均分和失衡阈值。
- 如果用户明显有多象限成熟表现却落在 Human 2.x，需要检查失衡阈值是否过严。
- 如果用户多象限尚未稳定却落在 Human 3.x，需要检查 Human 3.0 门槛是否过松。

## 阻塞等级

- P0：无法完成评估、结果页崩溃、结果主体不可读、出现明显诊断化表达、使用受保护人格测试名称、结果被用户理解为医学/心理/法律/职业结论。
- P1：用户仍能完成核心流程，但多位用户认为题目难懂、结果明显不贴合、分享卡片或链接影响传播意愿。
- P2：个别文案润色、解释补充或视觉细节，可进入 1.1。

## 1.0 通过标准

1. 至少 3 位真实用户完成完整评估。
2. 没有 P0 级别问题：无法完成、结果页崩溃、明显诊断化表达、受保护名称误用。
3. 大多数用户认为产品边界清楚，不会误解为诊断。
4. 大多数用户对结果贴合度评分不低于 3。
5. 题目和结果中的高风险文案已修正，或明确记录为 1.1 待办。
6. 阈值复核没有发现必须阻止 1.0 发布的问题。

## 整理方式

完成反馈后：

1. 将结论写入 `docs/CONTENT_REVIEW.md`。
2. 将阶段阈值结论写入 `docs/SCORING_CALIBRATION.md`。
3. 如有文案或题目调整，更新 `data/questions.json`、`data/result-templates.json` 或 `data/recommendations.json`。
4. 运行 `pnpm check`。
5. 更新 `docs/RELEASE_1_0.md` 的当前状态。
