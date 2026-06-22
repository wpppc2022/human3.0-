# Data Schema

## `data/questions.json`

每道题字段：

- `id`：题目编号，如 `M01`。
- `quadrant`：所属象限，`mind`、`body`、`spirit`、`vocation`。
- `dimension`：题目测量维度，用于内部管理。
- `text`：中文题干。
- `reverseScored`：是否反向计分。

产品人员可增删改题，但需要保持每个象限题量一致，且同步更新测试和计分假设。

当前数据校验要求：

- 总题数必须为 48。
- 四个象限必须各有 12 题。
- 每个象限至少有 1 道反向计分题。
- `id` 必须唯一，并使用象限前缀加两位数字，例如 `M01`、`B01`、`S01`、`V01`。
- 字段集合必须与本节一致，不能新增未说明字段。

## `data/quadrants.json`

- `id`：象限 ID。
- `name`：中文名。
- `englishName`：英文名。
- `description`：象限解释。
- `measures`：测量内容列表。

## `data/stages.json`

- `id`：阶段编号，范围 `1.1` 到 `3.3`。
- `level`：Human 层级。
- `phase`：阶段编号 `1`、`2`、`3`。
- `code`：展示名，如 `Human 2.2`。
- `name`：中文阶段名。
- `phaseName`：阶段英文和中文名。
- `levelName`：层级中文名。
- `coreState`：核心状态。
- `description`：详细解释。

当前数据校验要求：必须完整覆盖 `1.1` 到 `3.3`，`code` 必须等于 `Human {id}`，`level` 和 `phase` 必须与阶段编号一致。

## `data/recommendations.json`

- `quadrant`：建议对应的限制象限。
- `immediateAction`：24 小时内可完成的即时行动，用于免费结果页和分享卡片。
- `sevenDays`：未来 7 天行动建议。
- `thirtyDays`：未来 30 天行动建议。
- `ninetyDays`：未来 90 天行动建议。

当前数据校验要求：必须覆盖四个象限；`sevenDays`、`thirtyDays`、`ninetyDays` 当前各固定为 3 条建议，方便结果页和未来分享卡片稳定排版。

## `data/result-templates.json`

- `stage`：对应阶段。
- `titlePattern`：结果标题模板，支持 `{dominant}` 和 `{weak}`。
- `metatype`：有传播性的整体状态名，当前使用英文短名。
- `chineseName`：分享和结果页使用的中文短名。
- `lifestyleArchetype`：当前生活方式原型。
- `summary`：阶段摘要。
- `coreProblem`：当前最值得解决的根问题。
- `crossQuadrantDynamics`：象限之间如何互相增强或拖累，支持 `{dominant}` 和 `{weak}`。
- `shareInsight`：分享卡片使用的一句话洞察，不等同于行动建议。
- `friendPerspective`：朋友视角模块文案，包含常给人的感觉、协作方式、容易被误解的地方和可讨论问题。
- `keywords`：分享卡片关键词。

当前数据校验要求：必须覆盖 `1.1` 到 `3.3`；`titlePattern` 必须包含 `{dominant}`；`crossQuadrantDynamics` 必须包含 `{dominant}` 和 `{weak}`；`keywords` 当前固定为 3 个；`friendPerspective` 必须包含四个固定子字段。

## `data/site-content.json`

- `badge`：首页顶部标签文案。
- `intro`：首页产品说明。
- `resultPreview`：首页结果示例区。
- `outcomes`：首页“评估后你会看到”模块。
- `disclaimer`：首页免责声明。

所有 `data/` 文件会通过 `scripts/validate-data.mjs` 检查字段、覆盖范围、重复项和禁止使用的受保护人格测试名称。改完 JSON 后先运行：

```bash
pnpm validate:data
```

## 未来 Supabase 表结构

`assessment_submissions`：

- `id`
- `answers`
- `quadrant_scores`
- `quadrant_states`
- `level`
- `phase`
- `stage`
- `dominant_quadrant`
- `weak_quadrant`
- `imbalance_score`
- `result_summary`
- `created_at`

`assessment_versions`：

- `id`
- `version`
- `questions`
- `scoring_rules`
- `result_templates`
- `created_at`
