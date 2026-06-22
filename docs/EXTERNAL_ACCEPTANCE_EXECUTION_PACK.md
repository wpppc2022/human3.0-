# External Acceptance Execution Pack

## 目标

本文件是 HUMAN 3.0 1.0 候选版的外部验收执行包。目标是让测试者拿到公网链接后，可以直接开始真实用户反馈和真实手机验收。

公网测试地址：

```text
https://human3-0-phi.vercel.app/
```

本轮只验证 1.0 免费评估闭环，不引入数据库、用户系统、付费、AI 生成报告或复杂埋点。

## 执行分工

| 事项 | 建议执行者 | 回填位置 |
| --- | --- | --- |
| 真实用户反馈 | 产品负责人、总控指定访谈者或非开发执行者 | `docs/CONTENT_REVIEW.md`、`docs/SCORING_CALIBRATION.md`、`docs/RELEASE_1_0.md` |
| iPhone Safari 真机验收 | 持有 iPhone 的 QA、产品或测试者 | `docs/MOBILE_QA_REPORT.md`、`docs/RELEASE_1_0.md` |
| Android Chrome 真机验收 | 持有 Android 手机的 QA、产品或测试者 | `docs/MOBILE_QA_REPORT.md`、`docs/RELEASE_1_0.md` |
| 发布判定 | 总控或产品负责人 | `docs/RELEASE_1_0.md` |

## 真实用户反馈 Checklist

### 测试前准备

- [ ] 确认测试链接可打开：`https://human3-0-phi.vercel.app/`
- [ ] 准备 3 到 5 位真实用户。
- [ ] 为每位用户分配匿名编号：`U01`、`U02`、`U03`。
- [ ] 不记录真实姓名、手机号、身份证件、医学信息、心理健康信息、收入或其他敏感信息。
- [ ] 告知用户这是 1.0 候选版反馈，不是诊断或人格标签。
- [ ] 准备反馈记录表，可直接复制本文件下方模板。

### 用户选择

优先选择对成长、自我管理、职业状态或生活状态有真实感受的人。3 到 5 位用户尽量覆盖不同背景：

- 学生或刚毕业用户。
- 职场新人。
- 职业转型者。
- 自由职业者。
- 管理者、创业者或承担较多责任的人。

不需要追求人群统计代表性。本轮目标是发现阻塞 1.0 的理解、文案、完成率和传播问题。

### 测试前说明

给用户复制以下说明：

```text
这是 Human 3.0 自我发展评估的 1.0 候选版测试。

测试链接：https://human3-0-phi.vercel.app/

它不是人格标签，也不是医学、心理、法律或职业诊断。请把结果当作当前状态快照和自我理解参考。

请你独立完成一次完整评估。完成后我们会问几个问题，主要想知道：
1. 题目是否自然、清楚、适合中文用户。
2. 结果是否具体、克制、可行动。
3. 哪些地方让你困惑、不舒服，或者感觉说得太满。
4. 结果是否大致符合你对自己当前状态的理解。
5. 你是否愿意下载或分享结果卡片。
```

### 执行步骤

- [ ] 用户打开公网链接。
- [ ] 用户从首页进入评估。
- [ ] 用户完成 48 道题。
- [ ] 记录完成时间。
- [ ] 用户阅读结果页。
- [ ] 记录 Human 阶段、主导象限、限制象限。
- [ ] 用户尝试查看分享卡片。
- [ ] 如用户愿意，尝试下载 PNG 或复制分享链接。
- [ ] 访谈者按问题询问，不引导答案。
- [ ] 将反馈填入记录表。
- [ ] 标记是否存在 P0/P1/P2 问题。

### 访谈问题

1. 你是否能理解这个产品在评估什么？
2. 哪些题目让你停顿、犹豫或不确定？
3. 结果标题和核心判断是否像当前状态，而不是固定身份？
4. 哪一句最像你？哪一句最不像你？
5. 主要限制象限的解释是否清楚？
6. 24 小时、7 天、30 天、90 天行动建议是否具体可做？
7. 你愿意把分享卡片发给朋友吗？如果不愿意，原因是什么？
8. 你是否愿意把分享链接发给朋友让对方也测一次？
9. 页面里有没有让你感觉被诊断、被评判或被过度承诺的表达？

### 反馈记录表

| participant_id | user_type | device_browser | completed | completion_time | result_stage | dominant_quadrant | weak_quadrant | user_fit_rating | clarity_rating | action_rating | share_willingness | confusing_questions | uncomfortable_copy | missing_context | blocker_level | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| U01 | 职场新人 | iPhone Safari | Yes | 8 min | Human 2.2 | Mind | Body | 4 | 4 | 3 | Maybe | Q12 | 无 | 想知道象限含义 | None | 结果大体贴合 |

评分说明：

- `user_fit_rating`：结果贴合度，1 到 5。
- `clarity_rating`：表达清晰度，1 到 5。
- `action_rating`：行动建议可执行程度，1 到 5。
- `share_willingness`：`Yes`、`Maybe`、`No`。
- `blocker_level`：`P0`、`P1`、`P2`、`None`。

### 阈值复核记录表

| participant_id | result_stage | dominant_quadrant | weak_quadrant | user_fit_rating | product_reviewer_expected_stage | needs_threshold_review | reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| U01 | Human 2.2 | Mind | Body | 4 | Human 2.2 | No | 用户认为结果贴合当前状态。 |

## 真机验收 Checklist

### 测试设备

至少覆盖：

- [ ] iPhone Safari。
- [ ] Android Chrome。

### 测试前准备

- [ ] 打开公网链接：`https://human3-0-phi.vercel.app/`
- [ ] 使用无痕窗口或清理浏览器缓存。
- [ ] 每台设备从首页开始完成一次完整评估。
- [ ] 每台设备至少保留 4 张截图：首页、答题页、结果页、分享卡片或分享链接页。

截图命名建议：

```text
iphone-safari-01-home.png
iphone-safari-02-assessment.png
iphone-safari-03-result.png
iphone-safari-04-share.png
android-chrome-01-home.png
android-chrome-02-assessment.png
android-chrome-03-result.png
android-chrome-04-share.png
```

### 核心路径

- [ ] 首页可读，没有横向溢出。
- [ ] 点击开始按钮后进入 `/assessment`。
- [ ] 题目序号、题干和选项可读。
- [ ] 选项触摸区域足够大，选中状态明显。
- [ ] 下一题和上一题可用。
- [ ] 刷新后进度和答案可恢复。
- [ ] 完成第 48 题后进入结果页。
- [ ] 结果页 Human 阶段、结果名、摘要可读。
- [ ] 四象限状态可读，不展示原始分数。
- [ ] 行动建议完整可见。
- [ ] 分享卡片文字不截断。
- [ ] PNG 下载按钮有明确行为。
- [ ] 复制分享链接后，可以在另一设备或无痕窗口打开。
- [ ] 分享链接页能重建同一份结果。

### PNG 下载行为记录

移动浏览器可能表现不同，不要求每个平台都显示为传统文件下载。记录实际行为即可：

| device | browser | png_action | success | notes |
| --- | --- | --- | --- | --- |
| iPhone | Safari | 打开图片预览 / 保存到照片 / 下载文件 / 触发分享面板 | Yes | 记录实际表现 |
| Android | Chrome | 打开图片预览 / 保存到相册 / 下载文件 / 触发分享面板 | Yes | 记录实际表现 |

### 分享链接跨设备记录

| source_device | source_browser | target_device | target_browser | copied_link_opens | result_rebuilt | raw_scores_hidden | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iPhone | Safari | Android | Chrome | Yes | Yes | Yes | 链接可打开 |

### 真机 QA 记录表

| device | browser | route | check_item | result | severity | screenshot | decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iPhone | Safari | `/assessment` | 底部按钮不被工具栏遮挡 | Pass | None | iphone-safari-02-assessment.png | 无需处理 |

## 阻塞 1.0 的问题

### P0：必须发布前修复

- 用户无法开始或完成 48 题。
- 结果页崩溃、空白或主体内容不可读。
- 结果页出现原始分数。
- 明显诊断化、医学化、心理治疗化、法律或职业承诺表达。
- 使用受保护人格测试名称或造成混淆。
- iPhone Safari 或 Android Chrome 出现核心流程不可用。
- 分享卡片 PNG 和分享链接两个传播能力同时不可用。

### P1：总控判断是否阻塞

- 多位用户认为结果明显不贴合，且贴合度低于 3。
- 多位用户认为题目抽象、难懂，影响完成意愿。
- 分享卡片可以生成，但移动端保存体验粗糙。
- 分享链接可打开，但文案或布局影响理解。

### P2：可进入 1.1

- 个别文案不够顺。
- 个别题目需要润色，但不影响完成。
- 个别设备截图不够美观，但核心流程可用。
- 用户希望增加更多解释、案例或后续功能。

## 1.0 外部验收通过条件

- 至少 3 位真实用户完成完整评估。
- 大多数真实用户理解产品不是诊断或固定人格标签。
- 大多数真实用户结果贴合度不低于 3。
- 至少一台 iPhone Safari 和一台 Android Chrome 完成完整流程。
- 分享卡片 PNG 行为有明确记录。
- 分享链接可跨设备或无痕窗口打开并重建结果。
- 没有未解决 P0。
- P1 已由总控明确发布前修复或进入 1.1。
- 结论已回填到 `docs/CONTENT_REVIEW.md`、`docs/SCORING_CALIBRATION.md`、`docs/MOBILE_QA_REPORT.md` 和 `docs/RELEASE_1_0.md`。
