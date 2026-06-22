# Data Schema

## `data/questions.json`

每道题字段：

- `id`：题目编号，如 `M01`。
- `quadrant`：所属象限，`mind`、`body`、`spirit`、`vocation`。
- `dimension`：题目测量维度，用于内部管理。
- `text`：中文题干。
- `reverseScored`：是否反向计分。

产品人员可增删改题，但需要保持每个象限题量一致，且同步更新测试和计分假设。

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

## `data/recommendations.json`

- `quadrant`：建议对应的限制象限。
- `sevenDays`：未来 7 天行动建议。
- `thirtyDays`：未来 30 天行动建议。
- `ninetyDays`：未来 90 天行动建议。

## `data/result-templates.json`

- `stage`：对应阶段。
- `titlePattern`：结果标题模板，支持 `{dominant}` 和 `{weak}`。
- `summary`：阶段摘要。
- `keywords`：分享卡片关键词。

## `data/site-content.json`

- `badge`：首页顶部标签文案。
- `intro`：首页产品说明。
- `resultPreview`：首页结果示例区。
- `outcomes`：首页“评估后你会看到”模块。
- `disclaimer`：首页免责声明。

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
