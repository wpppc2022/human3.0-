# HUMAN 3.0 32 题研究与校准计划（Archive / Optional）

> 状态：`archived-cancelled`。2026-07-05 产品决定取消 32 题认知访谈、48/32 配对、复测、招募和准确性统计。本文件仅保留为未来可能重新授权时的历史参考；当前不得执行、派发或据此收集数据。取消研究不代表 32 题通过验证，`h3-a32-v1` 无限期保持 `draft / unvalidated`。

## 1. 当前状态

- 产品决策：取消全部 32 题产品准确性研究，不再执行认知访谈、配对、复测或招募。
- 研究状态：`archived-cancelled / no-data`。
- 32 题候选：`h3-a32-v1`，保持 `draft / not-started`。
- 48 题基准：`h3-a48-v1`，继续作为正式生产默认和准确性基准。
- 32 题当前 `questionSetHash = null`；没有新的产品授权时不冻结、不进入 `calibrating`。
- 截至本文建立时，没有真实配对或复测数据，不得填写通过结论或推断效果。
- 本文只定义研究、记录和分析规则，不修改正式题库、评分、UI、API 或生产默认。

以下设计是取消前形成的可选研究方案，不是当前任务。由于研究被取消，题目语义、社会赞许、角色偏差、等价性和稳定性均保持未知，不能对外宣称已验证。

配套材料：

- 内容规格：`docs/QUESTION_BANK_32_CONTENT_SPEC.md`
- 评分规格：`docs/ASSESSMENT_32_SCORING_SPEC.md`
- 版本兼容：`docs/DEBUG_AND_API_ARCHITECTURE.md`
- 空白数据模板：`docs/calibration/`
- 空白报告：`docs/calibration/ASSESSMENT_32_CALIBRATION_REPORT_TEMPLATE.md`

## 2. 归档研究路径（当前不执行）

1. `draft-freeze-review`：产品、内容、模型审阅当前 32 题工作稿、作答说明、选项、顺序和计分方向。
2. `snapshot-freeze`：生成 `candidateRevision + questionSetHash`，保存不可变研究快照。
3. `calibrating`：直接执行至少 40 名、建议 60-80 名有效参与者的 48/32 配对研究。
4. `retest`：从配对样本中取得 25-30 名有效复测参与者，让 48 和 32 题都完成 test/retest。
5. `gate-review`：按 Accuracy-first 不可补偿门槛、角色分层和单题质量逐项判定。
6. `qualified / failed-revise / inconclusive`：只有全部通过才可进入 `stable` 评审；否则保持 48 题正式默认。

## 3. 题库快照与 questionSetHash

### 3.1 审阅式冻结

没有认知访谈前置后，冻结只代表“本轮量化研究使用同一份题目”，不代表题目语义已经被用户验证。

冻结前必须完成：

1. 产品、内容、模型确认 32 题数量、四象限覆盖和结果解释边界。
2. 确认四道新题只使用窄解释：Mind 情绪觉察、Body 身体在场、Spirit 可获得的关系连接、Vocation 资源与协作准备。
3. 确认作答窗口、说明、1-5 选项标签、题号、顺序、象限、维度和 `reverseScored`。
4. 确认候选仍不可公开，不生成正式分享结果。
5. 对当前工作稿创建 `candidateRevision`，建议首个量化研究快照为 `pair-r1`。

### 3.2 hash 规范载荷

`questionSetHash` 必须覆盖实际影响回答和计分的内容：

```json
{
  "hashSchema": "h3-question-set-hash-v1",
  "assessmentVersion": "h3-a32-v1",
  "candidateRevision": "pair-r1",
  "recallWindow": "past-4-weeks",
  "instructions": "exact rendered instructions",
  "answerScale": [
    { "value": 1, "label": "exact label" },
    { "value": 2, "label": "exact label" },
    { "value": 3, "label": "exact label" },
    { "value": 4, "label": "exact label" },
    { "value": 5, "label": "exact label" }
  ],
  "questions": [
    {
      "order": 1,
      "id": "M-C01",
      "quadrant": "mind",
      "dimension": "structure",
      "text": "exact rendered text",
      "reverseScored": false
    }
  ]
}
```

规范化规则：

- UTF-8、Unicode NFC、LF 换行。
- JSON 对象键按 RFC 8785 JSON Canonicalization Scheme 排序。
- `questions` 数组保留真实展示顺序。
- 不自动删除题干内部空格或标点；用户看到的文本变化必须改变 hash。
- SHA-256 保存为 `sha256:<64 lowercase hex>`。
- 至少两次独立计算得到相同值后写入 manifest 和研究记录。

冻结记录同时保存：`assessmentVersion`、`candidateRevision`、`questionSetHash`、冻结时间、32 题快照路径、评分规则版本、结果版本和产品/内容/模型审阅状态。

### 3.3 必须新建 candidate revision

以下变化必须新建 revision、重新生成 hash：

- 增删、替换或重排题目。
- 修改题号、象限、维度或 `reverseScored`。
- 修改任何用户可见题干，包括标点或被认为不影响语义的润色。
- 修改近 4 周说明、作答提示或 1-5 选项标签。
- 启用 M12/M06、S03/S08、V05/V08、V07/V10 备用交换位。
- 修改等值分、阶段阈值、并列规则或其他可能改变结果的评分逻辑。此类变化还应升级对应评分/评估版本身份。

不要求新建 question set revision：

- 不改变题目、说明、选项、顺序或分数的研究文档排版。
- 只修复日志、监控或测试实现，且冻结 fixture 和结果逐字节一致。
- 只修改非判断性视觉样式。结果解释变化应更新 `resultVersion`，但不一定改变 questionSetHash。

配对收集开始后不得修改冻结快照。若开放反馈显示必须改题，当前 revision 进入 `failed-revise`，新 revision 默认重新累计至少 40 个有效配对；不同 hash 的数据不能直接合并计算晋级率。

## 4. 48/32 配对研究设计

### 4.1 样本规模

- 最低：40 名完成两版且符合主分析规则的有效参与者。
- 建议：60-80 名有效配对参与者。
- 复测：25-30 名完成 48 和 32 题各两次的有效参与者。
- 招募数可以高于目标以应对退出，但报告必须区分招募、开始、完成和有效配对。

有效配对不足 40 时结论为 `inconclusive-insufficient-sample`，不能晋级。

### 4.2 顺序随机平衡

参与者先按宽角色层分层，再在层内随机分配：

- `48-first`：T1=48，T2=32。
- `32-first`：T1=32，T2=48。

每个角色层中两种顺序人数尽量相差不超过 1。最终任一顺序组不得低于有效样本的 40%；否则补样本，不能把顺序效应混入版本差异。

### 4.3 时间间隔

- T1/T2 间隔 3-7 个完整自然日。
- 少于 3 天增加记忆效应，超过 7 天增加真实状态变化。
- 超出窗口的数据保留并标记 `interval-out-of-window`，不进入主分析，只能用于敏感性分析。
- 两版都使用相同的近 4 周作答说明。

### 4.4 施测控制

- 不允许参与者自行选择版本顺序。
- 两版都按冻结题序作答，不临时随机化题目或选项。
- 第二版完成前不展示详细阶段、主导/限制象限和行动建议，避免结果反馈影响下一次答案。
- 每版结束后收集简短开放反馈：难理解题号、不适用题号、原因和其他备注；反馈不改变当次答案。
- 全同选项、极短时长或反向题不一致只标记风险，不自动删除。
- 缺失答案不插补。部分作答保留在 item-level 数据中，用于缺答分析，但不进入结果一致率主分析。

### 4.5 复测

25-30 名参与者按原顺序完成第二轮：

- `48-first`：T1=48、T2=32、T3=48、T4=32。
- `32-first`：T1=32、T2=48、T3=32、T4=48。
- 相邻会话间隔均为 3-7 天。
- 同一版本的 test-retest 间隔约为 6-14 天，记录实际天数。
- 同一版本的两次施测必须使用相同 revision/hash。

若 25-30 人没有让两版都完成复测，不能用于“32 稳定性不低于 48”的判定。

## 5. 匿名数据

### 5.1 禁止收集

- 姓名、手机号、邮箱、账号、精确地址、单位或学校名称。
- 身份证件、收入、资产、医学/心理诊断和治疗记录。
- 可识别个人的职位、项目名、关系人姓名或开放反馈细节。

联系表如确有需要，必须与模型分析数据分开保存。分析文件只使用随机 `participant_id`。

### 5.2 角色字段

```text
student_or_early_career
organization_individual_contributor
manager_or_team_lead
independent_or_freelance
career_transition
care_or_unpaid_work
not_currently_employed
other_or_prefer_not_to_say
```

主分析合并为：

1. `learning-entry`
2. `organization`
3. `independent`
4. `transition-care`

最低 40 人时尽量每层至少 10 个有效配对；60-80 人目标下建议每层 15-20 个。某层少于 10 时只做描述，不能宣称该角色无偏差。

### 5.3 数据文件

- `participants.csv`：匿名角色和顺序分配。
- `sessions.csv`：每次施测、版本/hash、完成情况和派生结果。
- `item-responses.csv`：逐题原始/归一化答案及响应质量字段。
- `item-feedback.csv`：原计划记录难理解、不适用、敏感或模糊反馈；研究取消后未继续创建。
- `paired-comparisons.csv`：48/32 配对指标。
- `retest-comparisons.csv`：每版本复测指标。

多值象限集合按 `mind|body|spirit|vocation` 顺序以 `|` 分隔。布尔值用 `true/false`，缺失留空。

## 6. 分析公式

### 6.1 象限等值分

```text
normalizedAnswer = reverseScored ? 6 - answer : answer
S(v,q) = sum(normalizedAnswer)
n(v,q) = expected items in quadrant q
E(v,q) = 12 * S(v,q) / n(v,q)
```

- 48 题：`n=12`，所以 `E48=S48`。
- 32 题：`n=8`，所以 `E32=1.5*S32`。
- 全部比较使用未取整的 `E_q`。

### 6.2 象限三层级

```text
quadrantLevel(stage) = first digit of stage
levelAgree(i,q) = 1 if level32(i,q) == level48(i,q), else 0
levelAgreement(q) = sum_i levelAgree(i,q) / N_valid_pairs
overallQuadrantLevelAgreement = sum_i,q levelAgree(i,q) / (4*N_valid_pairs)
```

同时报告总体和四象限各自值。

### 6.3 九段相邻一致

索引：`1.1=1, 1.2=2, 1.3=3, 2.1=4, 2.2=5, 2.3=6, 3.1=7, 3.2=8, 3.3=9`。

```text
quadrantStageDistance(i,q) = abs(index(stage32(i,q)) - index(stage48(i,q)))
quadrantAdjacent(i,q) = 1 if distance <= 1, else 0
quadrantAdjacentRate = sum_i,q quadrantAdjacent(i,q) / (4*N_valid_pairs)
```

报告距离 0、1、2、3+ 的分布。

### 6.4 整体阶段

```text
overallExact(i) = 1 if overallStage32(i) == overallStage48(i), else 0
overallExactRate = sum_i overallExact(i) / N_valid_pairs

overallDistance(i) = abs(index(overallStage32(i)) - index(overallStage48(i)))
overallAdjacent(i) = 1 if overallDistance(i) <= 1, else 0
overallAdjacentRate = sum_i overallAdjacent(i) / N_valid_pairs

premature3x(i) = 1 if level32(i) == 3 and level48(i) < 3, else 0
premature3xRate = sum_i premature3x(i) / N_valid_pairs
```

### 6.5 主导/限制与并列

```text
D_v = all quadrants with E(v,q) == max_q E(v,q)
W_v = all quadrants with E(v,q) == min_q E(v,q)
```

- `exact`：集合完全相等。
- `reasonable-tie`：一侧为单一象限，另一侧为包含该象限的真实同分集合。
- `mismatch`：其他情况，包括不同的部分重叠并列集合。

```text
inclusiveMatch = 1 if class in {exact, reasonable-tie}, else 0
dominantInclusiveRate = sum_i inclusiveMatch(D32,D48) / N_valid_pairs
weakInclusiveRate = sum_i inclusiveMatch(W32,W48) / N_valid_pairs
```

必须分别报告 exact、reasonable-tie 和 mismatch。

### 6.6 E_q 差异

```text
diffE(i,q) = E32(i,q) - E48(i,q)
biasE(q) = mean_i diffE(i,q)
MAE(q) = mean_i abs(diffE(i,q))
medianAE(q) = median_i abs(diffE(i,q))
```

相关系数不能代替阶段一致率。

### 6.7 复测稳定性

对同一参与者同一版本：

- `E_q`：平均差、MAE、ICC(A,1) 绝对一致和参与者 bootstrap 95% CI。
- L1/L2/L3：精确一致率和 Cohen's kappa。
- 九段/整体阶段：精确、相邻一致率和线性加权 kappa。
- 主导/限制：exact、reasonable-tie 和 inclusive rate。

```text
deltaStability(metric) = stability32(metric) - stability48(metric)
```

每个核心稳定性点估计必须 `deltaStability >= -0.05`。在同一批复测参与者上比较，并以参与者层 bootstrap 2,000 次给出 95% CI。不能仅凭“不显著”宣称不劣。

## 7. 单题质量检查

取消访谈后，以下分析成为必做项。

### 7.1 缺答率

```text
itemMissingRate(j) = missing_or_abandoned_exposures(j) / all_exposures(j)
```

正式结果仍要求完整答案；该指标使用中断和提交前记录。缺答率超过 5% 的题进入强制审查。

### 7.2 中立率

```text
neutralRate(j) = count(answer_raw == 3) / valid_answers(j)
```

中立率超过 50% 标记为低区分风险，必须结合开放反馈、item-rest correlation 和角色分层判断，不能单独据此删题。

### 7.3 极端分布

```text
lowExtremeRate(j) = count(answer_raw == 1) / valid_answers(j)
highExtremeRate(j) = count(answer_raw == 5) / valid_answers(j)
eitherExtremeRate(j) = count(answer_raw in {1,5}) / valid_answers(j)
```

单一端点超过 60% 标记地板/天花板风险。反向题报告原始答案和归一化答案两种分布，避免方向误读。

### 7.4 难理解/不适用反馈

每版结束后让用户可选填：

```text
item_id
feedback_type = difficult | ambiguous | not-applicable | sensitive | other
reason_redacted
```

```text
notApplicableRate(j) = participants_reporting_not_applicable(j) / participants_exposed(j)
difficultRate(j) = participants_reporting_difficult_or_ambiguous(j) / participants_exposed(j)
```

任一题总体 `notApplicableRate >=20%`，或任一 n>=10 角色层达到 30%，自动进入 `failed-revise`。Spirit 关系连接和 Vocation 资源系统新题的 `difficultRate + notApplicableRate` 去重后达到 20%，也自动修订，不允许靠结果文案补救。

### 7.5 项目诊断

- corrected item-rest correlation，只作诊断，不单独作为晋级证明。
- leave-one-item-out：移除单题后计算象限 `E_q`、阶段和 48/32 一致率变化。
- 检查单题是否造成限制象限或 Human 3.x 的集中改变。
- 四道新题单独报告，不用象限总体掩盖。

## 8. Accuracy-first 门槛

### 8.1 不可补偿门槛

| 门槛 | 要求 |
| --- | --- |
| 关键构念覆盖 | 产品、内容、模型共同通过；不依赖 cognitive_pass。 |
| 象限 L1/L2/L3 | 总体 >=85%，并报告每象限。 |
| 象限九段相邻 | 总体 >=90%，并报告每象限。 |
| 整体阶段精确 | >=75%。 |
| 整体阶段相邻 | >=95%。 |
| 主导 inclusive | >=75%。 |
| 限制 inclusive | >=75%。 |
| 复测稳定性 | 核心指标相对 48 题下降均不超过 5 个百分点。 |

完成时长、完成率、用户偏好和贴合度不能补偿准确性失败。

### 8.2 自动失败

任一情况触发 `failed-revise`：

- 任一不可补偿门槛低于要求。
- 产品、内容或模型任一方不通过关键构念覆盖。
- Spirit/Vocation 新题必须扩大到单题不能支持的含义，结果才看似完整。
- 32 题 Human 3.x 相对 48 题提前判定率超过 5%，或至少出现 3 个方向一致的提前判定案例。
- 任一核心复测稳定性点估计比 48 题低超过 5 个百分点。
- 任一 n>=10 宽角色层的象限三层级总体一致率低于 75%、整体阶段相邻一致率低于 85%、主导或限制 inclusive 低于 60%。
- 达到本计划定义的单题“不适用/难理解”自动修订线。
- 混入不同 revision/hash 且无法分离为独立完整样本。
- 配对开始后静默修改题干、方向、顺序、说明或阈值。

### 8.3 不能判定通过

标记 `inconclusive`：

- 有效配对少于 40。
- 复测有效样本少于 25，或两版没有在同一批人中复测。
- 任一顺序组少于有效样本的 40%。
- 关键角色层不足以判断偏差。
- 主分析存在无法解释的版本/hash 数据质量问题。

`inconclusive` 时继续使用 48 题。

## 9. 角色分层与新题风险

每个角色层报告样本数、顺序、完成率、四象限 E_q 差异、层级/阶段一致、整体阶段、主导/限制以及四道新题分布和开放反馈。

### Spirit 关系连接

检查：

- 是否被反馈为社交数量、人脉、婚恋或家庭支持题。
- transition-care 层的中立率、不适用率和 Spirit 差异是否集中。
- item-rest、leave-one-item-out 和限制象限转向率。
- 当前环境缺少支持是否被误当作个人成熟度低。

### Vocation 资源系统

检查：

- 不同角色是否把“资源到位”理解为收入、预算、职位权力或团队规模。
- organization、independent、transition-care 的分布和 Vocation 差异是否方向相反。
- item-rest、leave-one-item-out 和主导/限制变化。
- 组织权限和现实资源限制是否被误当作个人能力。

取消访谈后，角色分层覆盖不足本身会使结论保持 `inconclusive`；不能只用总体一致率宣称可上线。

## 10. 排除规则

主分析纳入：

- 两版完整有效。
- revision/hash 完全一致。
- T1/T2 间隔 3-7 天。
- participant/session ID 唯一。
- 版本、题号集合和结果版本匹配。

不自动排除：全同选项、极短/极长时长、反向题不一致、贴合度低。它们进入敏感性分析。

所有排除保留原因和计数。不得在看到一致率后新增排除规则。

## 11. 报告

最终使用 `docs/calibration/ASSESSMENT_32_CALIBRATION_REPORT_TEMPLATE.md`，至少报告：

1. revision/hash 和研究偏离。
2. 招募、有效配对、顺序、间隔和排除。
3. 单题缺答、中立、极端、难理解和不适用反馈。
4. 全部 Accuracy-first 门槛。
5. 四象限和整体阶段差异。
6. 主导/限制 exact 与 reasonable-tie。
7. Human 3.x 提前判定。
8. 角色分层、Spirit 与 Vocation 新题。
9. 两版复测稳定性和差值。
10. 次级体验指标，只在准确性全部通过后解释。
11. `qualified / failed-revise / inconclusive` 结论。

报告不得预填通过率、置信区间或晋级结论。当前保持 `archived-cancelled / no-data`；没有新授权时不执行本方案。
