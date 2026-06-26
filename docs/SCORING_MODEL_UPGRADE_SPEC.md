# Scoring Model Upgrade Spec

## 目标

本文是给实现窗口使用的模型规则规格。目标是在不改题库题干、不大重构现有计分流程的前提下，让 1.0 候选版评分模型更稳：

- 每个象限都能基于 12-60 分得到独立发展层级。
- 每个象限也能解释其所处阶段：Dissonance、Uncertainty、Discovery。
- 整体 Human 阶段不再过早进入 Human 3.3。
- 整体判断同时参考最低象限、均衡度、成熟象限数量和平均分。

本规格只定义规则，不修改 `lib/scoring.ts`、题库或阈值实现。

## 兼容原则

现有评分流程可以保留：

1. 每题仍使用 1-5 分。
2. `reverseScored = true` 仍使用 `6 - answer`。
3. 每个象限仍是 12 题，总分范围 12-60。
4. `averageScore` 仍是四个象限总分的平均值。
5. `imbalanceScore` 仍是最高象限分减最低象限分。
6. 结果页仍不展示原始分数。

新增内容应作为现有 `QuadrantScore` 和 `ScoringResult` 的增强字段，而不是替换整套模型。

## 一、象限发展层级

每个象限单独计算 `quadrantDevelopment`。建议使用 9 段规则，对应 `1.1` 到 `3.3`。

| 象限分数 | 象限阶段 | 层级 | 阶段 | 内部说明 |
| --- | --- | --- | --- | --- |
| 12-18 | 1.1 | L1 / Human 1.x | Dissonance | 该象限基础支撑明显不足。 |
| 19-24 | 1.2 | L1 / Human 1.x | Uncertainty | 已开始意识到不稳，但还缺稳定支撑。 |
| 25-28 | 1.3 | L1 / Human 1.x | Discovery | 有初步意识或局部动作，但仍偏依赖外部或偶发状态。 |
| 29-32 | 2.1 | L2 / Human 2.x | Dissonance | 开始主动建立能力，但旧模式仍频繁失效。 |
| 33-36 | 2.2 | L2 / Human 2.x | Uncertainty | 有一些自我驱动和方法，但稳定性不足。 |
| 37-44 | 2.3 | L2 / Human 2.x | Discovery | 该象限已有基础，正在形成可复用方法。 |
| 45-48 | 3.1 | L3 / Human 3.x | Dissonance | 该象限开始具备系统支撑力，但仍有波动或压力测试不足。 |
| 49-54 | 3.2 | L3 / Human 3.x | Uncertainty | 该象限已相对成熟，正在和其他象限协同。 |
| 55-60 | 3.3 | L3 / Human 3.x | Discovery | 该象限高度稳定，能持续支撑整体系统。 |

命名建议：

- `quadrantLevel`: `"1.0" | "2.0" | "3.0"`
- `quadrantPhase`: `"1" | "2" | "3"`
- `quadrantStage`: `"1.1"` 到 `"3.3"`
- `quadrantDevelopmentLabel`: 面向 UI 的短标签，例如“基础支撑不足”“正在形成方法”“稳定系统支撑”

### 与当前象限状态的关系

现有 `state` 字段可以保留，用于低成本 UI 展示：

| 现有状态 | 分数 | 新象限阶段 |
| --- | --- | --- |
| unstable | 12-24 | 1.1-1.2 |
| forming | 25-36 | 1.3-2.2 |
| grounded | 37-48 | 2.3-3.1 |
| mature | 49-60 | 3.2-3.3 |

注意：`grounded` 不等于整体 Human 3.0。一个象限有基础，只说明该象限可用；整体 Human 3.x 必须看四象限协同。

## 二、象限是否需要 1/2/3 阶段

建议需要，但 1.0 里先作为解释性字段，不必在结果首屏高调展示。

原因：

- 用户要求每个象限能单独判断发展层级，只给 `unstable/forming/grounded/mature` 不够细。
- 1/2/3 阶段能解释“同样是 Body 短板，一个人是完全失调，另一个人是正在重组”。
- 它能支持未来付费版月度复测，判断某象限是从 2.1 到 2.2，还是只是在同一状态内波动。

象限阶段阈值使用上一节 9 段规则即可，不需要额外题库数据。

## 三、整体阶段判断优化

当前风险：平均分 42 且四象限均衡时会进入 Human 3.3；三个象限较高、一个象限刚到 forming 时也可能显得过高。

建议整体判断使用以下派生指标：

```text
scores = [mind, body, spirit, vocation]
averageScore = sum(scores) / 4
minScore = min(scores)
maxScore = max(scores)
imbalanceScore = maxScore - minScore

unstableCount = count(score <= 24)
formingOrBetterCount = count(score >= 25)
groundedOrBetterCount = count(score >= 37)
matureCount = count(score >= 49)
```

### 1. 整体 Human Level

```text
if unstableCount >= 2 or averageScore < 30 or minScore <= 20:
  level = "1.0"
else if (
  averageScore >= 47
  and minScore >= 41
  and imbalanceScore <= 10
  and groundedOrBetterCount == 4
  and matureCount >= 2
):
  level = "3.0"
else:
  level = "2.0"
```

设计意图：

- `minScore >= 41` 防止一个明显短板被平均分掩盖。
- `matureCount >= 2` 防止“全都只是已有基础”直接变成 Human 3.0。
- `imbalanceScore <= 10` 要求整体协同足够稳定。
- `averageScore >= 47` 让 Human 3.0 表示更强的系统支撑，而不是普通高分。

### 2. 整体 Phase

先判断 `level`，再根据该层级内部规则判断 `phase`。

#### Human 1.0 内部阶段

```text
if unstableCount >= 3 or averageScore < 24 or minScore <= 18:
  phase = "1"
else if unstableCount >= 2 or averageScore < 28:
  phase = "2"
else:
  phase = "3"
```

#### Human 2.0 内部阶段

```text
if unstableCount >= 1 or averageScore < 36 or imbalanceScore >= 18:
  phase = "1"
else if averageScore < 43 or imbalanceScore >= 11 or groundedOrBetterCount < 2:
  phase = "2"
else:
  phase = "3"
```

#### Human 3.0 内部阶段

```text
if minScore < 45 or imbalanceScore >= 8 or matureCount < 3:
  phase = "1"
else if averageScore < 51 or minScore < 49 or imbalanceScore > 6 or matureCount < 4:
  phase = "2"
else:
  phase = "3"
```

Human 3.3 的实际门槛：

```text
level = "3.0"
phase = "3"
averageScore >= 51
minScore >= 49
imbalanceScore <= 6
matureCount == 4
```

这意味着四象限都必须进入 mature，且整体足够均衡，才会得到 Human 3.3。

## 四、边界案例

| 分数组合 Mind/Body/Spirit/Vocation | 旧模型可能结果 | 新建议结果 | 原因 |
| --- | --- | --- | --- |
| 42 / 42 / 42 / 42 | Human 3.3 | Human 2.2 | 全部已有基础，但没有成熟象限，不应过早整合。 |
| 48 / 48 / 48 / 36 | Human 3.3 | Human 2.2 | 三强一弱，最低象限仍在 forming，整体需重组。 |
| 49 / 49 / 49 / 41 | Human 3.x | Human 3.1 | 进入 3.0，但最低象限仍是早期支撑点。 |
| 52 / 51 / 50 / 49 | Human 3.3 | Human 3.2 | 四象限 mature，但平均分未到 51，可视为稳定重组中。 |
| 55 / 54 / 52 / 50 | Human 3.3 | Human 3.3 | 四象限 mature，均衡度足够，整体协同成立。 |
| 55 / 55 / 24 / 24 | Human 1.1 | Human 1.2 | 两个象限不稳定，仍是 1.x，但用户可能已有强优势。 |
| 30 / 30 / 30 / 30 | Human 2.2 | Human 2.1 | 全部正在形成早期，主动系统刚开始建立。 |
| 36 / 36 / 36 / 36 | Human 2.2 | Human 2.2 | 有意识和局部行动，但尚未进入已有基础。 |
| 44 / 44 / 37 / 37 | Human 2.3 | Human 2.2 | 四象限都有基础，但平均分尚未到发现期门槛。 |

## 五、最小实现范围

### 1. 类型结构

建议最小新增：

```ts
export type QuadrantDevelopmentStageId = HumanStageId;

export interface QuadrantDevelopment {
  level: HumanLevel;
  phase: PhaseId;
  stage: QuadrantDevelopmentStageId;
  label: string;
  description: string;
}

export interface QuadrantScore {
  quadrant: QuadrantId;
  rawScore: number;
  state: QuadrantStateId;
  development: QuadrantDevelopment;
}
```

`ScoringResult` 可以保持现有字段，再新增派生指标，方便测试和调试：

```ts
export interface ScoringResult {
  ...
  minScore: number;
  maxScore: number;
  unstableCount: number;
  groundedOrBetterCount: number;
  matureCount: number;
}
```

如果希望更小改动，也可以先不把派生指标暴露到 UI，只在内部函数里计算。

### 2. 评分函数

建议新增函数：

```ts
getQuadrantDevelopment(score: number): QuadrantDevelopment
calculateScoreMetrics(quadrantScores): ScoreMetrics
determineLevelV2(metrics): HumanLevel
determinePhaseV2(metrics, level): PhaseId
```

保留旧函数名也可以，但测试要覆盖新阈值。

### 3. 结果构建

`lib/result-builder.ts` 需要把 `quadrantScores[quadrant].development` 传给 `QuadrantReport`。

结果页首版不必展示 `1.1-3.3` 的象限编号，可以展示更自然的中文：

- L1：基础支撑不足
- L2：能力正在形成
- L3：稳定系统支撑

详细页或调试信息再展示 `Mind 2.3`、`Body 1.2` 这类结构化标签。

### 4. 组件

需要检查：

- `components/QuadrantMap.tsx`
- `components/ResultSummary.tsx`
- `components/ResultClient.tsx`
- `components/ResultReport.tsx`

1.0 立刻改动建议：结果页四象限报告中增加一句象限发展解释。分享卡片不建议放象限阶段，避免信息过载。

### 5. 测试

需要新增或更新：

- `tests/scoring.test.ts`
  - 覆盖 `getQuadrantDevelopment` 的 9 个边界：18/19、24/25、28/29、32/33、36/37、44/45、48/49、54/55。
  - 覆盖 Human 3.3 新门槛：必须 `minScore >= 49`、`matureCount == 4`、`imbalanceScore <= 6`。
- `tests/scoring-calibration.test.ts`
  - 更新旧样例预期，尤其是全 4 不再 Human 3.3。
  - 增加“三强一弱”“四象限 mature 但不够高”“真正 3.3”样例。
- `tests/result-builder.test.ts`
  - 确认 `quadrantReports` 可读取象限发展字段。

### 6. 文档

需要更新：

- `docs/SCORING_RULES.md`
- `docs/SCORING_CALIBRATION.md`
- `docs/QUESTION_BANK_SCORING_TABLE.md`
- `docs/MODEL.md`
- `docs/USER_FEEDBACK_PLAN.md`

建议保留本文件作为实现规格或迁移记录。

## 六、1.0 立刻应改

建议 1.0 立刻改：

1. 增加每个象限的 `development` 判断。
2. 优化整体 Human 3.0 / 3.3 门槛，尤其加入 `minScore`、`matureCount` 和更严格 `imbalanceScore`。
3. 更新校准测试，让全 4、三强一弱不再过早进入 Human 3.3。
4. 在结果页给每个象限增加一条轻量解释，帮助用户理解单象限状态。
5. 更新评分规则文档和题库计分表。

## 七、等真实用户反馈再改

建议先不在 1.0 立刻改：

1. 不改 48 道题题干。
2. 不新增题目或改变每象限 12 题结构。
3. 不把象限阶段编号高调展示在分享卡片。
4. 不引入复杂权重或按题目维度加权。
5. 不根据用户职业、年龄或身份调整分数。
6. 不把真实用户小样本结果当作统计常模。

真实用户反馈后再判断：

- Spirit 是否需要补关系和连接维度。
- Vocation 是否需要降低创作者语境。
- Body 个别反向题是否语气过重。
- Mind 个别题是否社会期许感过强。

## 八、给实现窗口的任务清单

1. 在 `lib/types.ts` 增加象限发展字段类型。
2. 在 `lib/scoring.ts` 增加 `getQuadrantDevelopment` 和评分指标计算。
3. 用本规格替换 `determineLevel` / `determinePhase` 的阈值逻辑。
4. 保留现有 `state` 字段，避免组件大面积重构。
5. 在 `lib/result-builder.ts` 和 `QuadrantReport` 中接入象限发展解释。
6. 更新结果页四象限展示，加入轻量发展层级说明。
7. 更新 `tests/scoring.test.ts` 和 `tests/scoring-calibration.test.ts`。
8. 更新 `docs/SCORING_RULES.md`、`docs/SCORING_CALIBRATION.md` 和 `docs/QUESTION_BANK_SCORING_TABLE.md`。
9. 跑 `pnpm validate:data`、`pnpm test`、`pnpm lint`、`pnpm build`。

## 九、模型口径摘要

1. 单象限可以进入 3.x，但整体 Human 3.x 必须要求四象限协同。
2. Human 3.3 必须四象限都成熟，不能只靠平均分。
3. 最低象限是整体上限的重要约束。
4. 失衡程度决定用户是进入 Discovery，还是仍处于 Uncertainty。
5. 1.0 只做规则增强，不改题库、不做复杂权重、不宣称科学诊断。
