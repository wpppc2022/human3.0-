# Question Bank Scoring Table

## 文档用途

这份文档把 1.0 候选版的 48 道题整理成可审阅表格，并说明每道题的计分方式。

适合以下场景：

- 产品、内容或非技术成员快速审阅题库和公式口径。
- 真实用户测试前，确认题目是否覆盖 Mind、Body、Spirit、Vocation 四个象限。
- 解释正向题、反向题、象限分数、Human 阶段和主导/限制象限之间的关系。

本文件只解释当前 1.0 候选版的计分规则，不替代 `lib/scoring.ts`。如果文档与代码不一致，以代码实现和 `docs/SCORING_RULES.md` 为准，并应同步修正文档。

## 评审指引

审阅本表时，建议重点看四件事：

1. 题干是否自然、清楚、适合真实用户理解。
2. 反向题是否能被用户稳定理解，而不是因为双重否定或语气过重造成误答。
3. 四个象限是否都被充分覆盖，没有明显偏向某一类用户或职业形态。
4. 结果解释是否仍是“当前状态快照”，而不是人格标签、医学判断、心理诊断或职业诊断。

不要把本表中的分数理解为用户能力、健康、人格或职业价值的绝对排名。分数只用于在本产品内部生成相对状态、阶段和行动建议。

本评估使用 5 级选项：

| 用户选择 | 含义 |
| --- | --- |
| 1 | 非常不符合 |
| 2 | 比较不符合 |
| 3 | 不确定 |
| 4 | 比较符合 |
| 5 | 非常符合 |

## 单题计分规则

每道题都有一个 `reverseScored` 字段。

如果 `reverseScored = false`，题目为正向计分：

| 用户选择 | 计入分数 |
| --- | --- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |
| 5 | 5 |

如果 `reverseScored = true`，题目为反向计分：

| 用户选择 | 计入分数 |
| --- | --- |
| 1 | 5 |
| 2 | 4 |
| 3 | 3 |
| 4 | 2 |
| 5 | 1 |

单题标准化公式：

```text
normalizedScore(question, answer) =
  question.reverseScored ? 6 - answer : answer
```

## 题库表格

| 题号 | 象限 | 维度 | 题干 | 计分方向 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M01 | Mind / 认知 | structure | 我遇到复杂问题时，会先试着拆解结构，而不是马上找答案。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M02 | Mind / 认知 | verification | 看到新信息时，我会下意识确认来源和证据，而不是只看它是否合我心意。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M03 | Mind / 认知 | learning | 我能把一次失败或卡住，整理成下次可调整的方法。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M04 | Mind / 认知 | attention | 我经常被零碎信息带着走，事后才发现自己没想清楚重点。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| M05 | Mind / 认知 | judgment | 做重要选择前，我会区分事实、判断和情绪。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M06 | Mind / 认知 | reflection | 当别人指出我的盲点时，我能先理解对方在说什么，再决定是否采纳。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M07 | Mind / 认知 | decision | 我常常因为想得太多而迟迟不开始。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| M08 | Mind / 认知 | modeling | 我会给自己的工作和生活建立一些可复用的原则或清单。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M09 | Mind / 认知 | self-correction | 如果发现原来的判断错了，我愿意修正，而不是硬撑面子。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M10 | Mind / 认知 | clarity | 我经常觉得脑子里很多事搅在一起，很难分出先后。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| M11 | Mind / 认知 | transfer | 我能把一个领域学到的方法迁移到另一个问题上。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| M12 | Mind / 认知 | focus | 我能在一段时间内专注处理一个关键问题，而不是同时抓很多线头。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B01 | Body / 身体 | sleep | 我大多数时候能保持相对稳定的睡眠和起床时间。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B02 | Body / 身体 | energy | 我能察觉自己精力下降的信号，并及时调整节奏。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B03 | Body / 身体 | movement | 我的一周里有固定的身体活动或训练安排。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B04 | Body / 身体 | recovery | 我常常靠硬扛完成事情，直到身体明显抗议才停下来。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| B05 | Body / 身体 | nutrition | 我会用饮食、喝水和休息来支持自己，而不是只靠意志力。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B06 | Body / 身体 | rhythm | 我知道自己一天中比较适合深度工作的时间段。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B07 | Body / 身体 | stress | 压力一大，我的作息、饮食和运动就很容易全部失控。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| B08 | Body / 身体 | environment | 我会主动整理环境，让身体更容易进入工作、休息或恢复状态。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B09 | Body / 身体 | sustainability | 我安排目标时，会考虑自己的体力和恢复能力。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B10 | Body / 身体 | awareness | 我常常忽略身体感受，直到效率明显下降。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| B11 | Body / 身体 | maintenance | 即使忙，我也会保留一些基础生活维护，比如散步、拉伸或规律吃饭。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| B12 | Body / 身体 | baseline | 我清楚哪些习惯会让自己的状态明显变好或变差。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S01 | Spirit / 意义 | values | 我能说出自己现在最看重的几件事，而不是只说别人期待我看重什么。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S02 | Spirit / 意义 | direction | 做选择时，我会问这件事是否接近我想过的生活。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S03 | Spirit / 意义 | desire | 我能分辨自己真正想要的东西，和只是想证明给别人看的东西。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S04 | Spirit / 意义 | external-validation | 如果没有外界认可，我很难判断一件事对自己是否有意义。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| S05 | Spirit / 意义 | meaning | 我能从日常工作或生活里找到一些让我愿意继续投入的理由。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S06 | Spirit / 意义 | long-term | 我愿意为了长期重要的事，放弃一些短期看起来很热闹的机会。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S07 | Spirit / 意义 | identity | 我经常根据别人怎么看我，临时改变自己的方向。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| S08 | Spirit / 意义 | inner-compass | 当身边人选择不同路线时，我仍能听见自己的判断。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S09 | Spirit / 意义 | coherence | 我希望自己的时间、关系和工作能逐渐靠近同一个核心方向。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S10 | Spirit / 意义 | avoidance | 我常常用忙碌回避真正重要但不好回答的问题。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| S11 | Spirit / 意义 | choice | 我能接受一些选择暂时不被理解，只要它和我的长期方向一致。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| S12 | Spirit / 意义 | presence | 我会给自己留出时间，整理感受、欲望和真正想靠近的东西。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V01 | Vocation / 事业 | skill | 我清楚自己目前最值得打磨的核心技能是什么。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V02 | Vocation / 事业 | output | 我能把想法做成可被别人看见、使用或评价的产出。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V03 | Vocation / 事业 | practice | 我有持续练习某项能力的具体安排，而不是只等灵感。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V04 | Vocation / 事业 | execution | 我经常想了很多职业或项目方向，但很少真正交付出来。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| V05 | Vocation / 事业 | market | 我会观察自己的能力如何为别人解决具体问题。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V06 | Vocation / 事业 | craft | 我能接受作品从粗糙开始，再通过反馈逐步变好。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V07 | Vocation / 事业 | focus | 我很容易被新的机会吸引，导致原本重要的项目不断中断。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| V08 | Vocation / 事业 | value | 我能描述自己的工作或作品为谁创造了什么价值。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V09 | Vocation / 事业 | feedback | 我会主动寻找反馈，而不是只在心里判断自己做得好不好。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V10 | Vocation / 事业 | agency | 面对职业不确定时，我通常只是等待外部安排。 | 反向 | 5 | 4 | 3 | 2 | 1 |
| V11 | Vocation / 事业 | portfolio | 我正在积累能代表自己能力和审美的作品、案例或经历。 | 正向 | 1 | 2 | 3 | 4 | 5 |
| V12 | Vocation / 事业 | system | 我会定期复盘自己的事业方向、能力增长和现实产出是否一致。 | 正向 | 1 | 2 | 3 | 4 | 5 |

## 反向题汇总

| 象限 | 反向题 |
| --- | --- |
| Mind / 认知 | M04, M07, M10 |
| Body / 身体 | B04, B07, B10 |
| Spirit / 意义 | S04, S07, S10 |
| Vocation / 事业 | V04, V07, V10 |

每个象限 12 题，其中 3 题反向计分。每个象限题目分数范围为 12 到 60。

## 计算公式

### 1. 单题标准化分数

设用户对第 `i` 题的选择为 `answer_i`，取值为 1 到 5。

```text
score_i = reverseScored_i ? 6 - answer_i : answer_i
```

### 2. 象限总分

四个象限分别为：

- Mind / 认知
- Body / 身体
- Spirit / 意义
- Vocation / 事业

设 `Q` 为某个象限，`questions(Q)` 为该象限下的 12 道题。

```text
quadrantScore_Q = sum(score_i for i in questions(Q))
```

每个象限：

```text
minQuadrantScore = 12
maxQuadrantScore = 60
```

### 3. 四象限总分

```text
totalScore =
  quadrantScore_mind
  + quadrantScore_body
  + quadrantScore_spirit
  + quadrantScore_vocation
```

总分范围：

```text
48 <= totalScore <= 240
```

### 4. 四象限平均分

当前实现使用四个象限总分的平均值，不是 48 道题的单题平均值。

```text
averageScore = totalScore / 4
```

平均分范围：

```text
12 <= averageScore <= 60
```

### 5. 失衡程度

```text
imbalanceScore =
  max(quadrantScore_mind, quadrantScore_body, quadrantScore_spirit, quadrantScore_vocation)
  - min(quadrantScore_mind, quadrantScore_body, quadrantScore_spirit, quadrantScore_vocation)
```

### 6. 象限状态

```text
if quadrantScore <= 24:
  state = "尚未稳定"
else if quadrantScore <= 36:
  state = "正在形成"
else if quadrantScore <= 48:
  state = "已有基础"
else:
  state = "相对成熟"
```

状态区间：

| 象限分数 | 状态 | 含义 |
| --- | --- | --- |
| 12-24 | 尚未稳定 | 这个象限还没有形成可靠支撑。 |
| 25-36 | 正在形成 | 这个象限有意识和局部行动，但还不稳定。 |
| 37-48 | 已有基础 | 这个象限已经能在多数情况下发挥作用。 |
| 49-60 | 相对成熟 | 这个象限已经成为人生系统中的稳定能力。 |

### 7. Human 层级判断

先计算：

```text
unstableCount = count(quadrantState == "尚未稳定")
solidCount = count(quadrantState == "已有基础" or quadrantState == "相对成熟")
```

层级判断公式：

```text
if unstableCount >= 2 or averageScore < 29:
  level = "Human 1.0"
else if solidCount >= 3 and imbalanceScore <= 14 and averageScore >= 41:
  level = "Human 3.0"
else:
  level = "Human 2.0"
```

### 8. 阶段判断

阶段判断公式：

```text
if averageScore < 30 or unstableCount >= 2:
  phase = "1"
else if imbalanceScore >= 14 or averageScore < 42:
  phase = "2"
else:
  phase = "3"
```

阶段含义：

| phase | 英文 | 中文 | 含义 |
| --- | --- | --- | --- |
| 1 | Dissonance | 失调期 | 感到不对劲，但还说不清问题在哪。 |
| 2 | Uncertainty | 不确定期 | 已经意识到旧模式不适合，但新模式还没稳定。 |
| 3 | Discovery | 发现期 | 开始找到新的方向、方法和秩序。 |

### 9. 最终 Human 阶段

`HumanStage` 由 `level` 和 `phase` 组合而成：

```text
level = "Human 1.0" -> levelPrefix = "1"
level = "Human 2.0" -> levelPrefix = "2"
level = "Human 3.0" -> levelPrefix = "3"

stage = levelPrefix + "." + phase
```

示例：

```text
level = Human 2.0
phase = 2
stage = Human 2.2
```

### 10. 主导象限和限制象限

主导象限：

```text
dominantQuadrant = quadrant with max(quadrantScore)
```

限制象限：

```text
weakQuadrant = quadrant with min(quadrantScore)
```

平分时使用固定顺序保证结果稳定：

```text
Mind -> Body -> Spirit -> Vocation
```

如果最高分平分，较靠前的象限会成为主导象限。

如果最低分平分，由于实现会先按高分排序再取最后一个，较靠后的象限会成为限制象限。

示例：

- 四象限完全同分时，主导象限为 Mind / 认知。
- 四象限完全同分时，限制象限为 Vocation / 事业。

## 当前 1.0 候选版边界说明

- 必须完成全部 48 题才会生成结果。
- 答案必须是 1 到 5 的整数。
- 结果页展示象限状态和解释，不直接展示原始分数。
- 当前公式是 1.0 候选版使用的启发式规则，已经用模拟画像做过校准，但仍需要真实用户反馈继续复核。
- 每个象限 12 题，是为了让四个象限在总分上权重一致；这不代表四个象限在每个人的人生中同等重要。
- 每个象限 3 道反向题，用于降低机械同意倾向，并帮助识别某些常见卡点；反向题不是“负面题”，也不用于评价用户好坏。
- 不展示原始分数，是为了减少用户把结果误读成诊断、排名或固定标签。1.0 候选版只展示状态、解释和下一步行动。
- 本评估是自我发展参考，不是医学、心理、法律或职业诊断，也不承诺科学测量效度。

## 真实用户反馈观察点

真实用户测试时，建议记录以下模型侧反馈：

- 用户是否理解 1 到 5 的选项含义。
- 用户是否在某些反向题上明显停顿、误读或觉得被评判。
- 用户是否能理解主导象限和限制象限只是当前状态，而不是固定身份。
- 用户是否觉得 Human 阶段过高、过低或与自我理解明显不符。
- 用户是否把结果误解为诊断、人格类型或职业建议。
- 多位用户是否异常集中在同一个 Human 阶段或同一个限制象限。
