# Debug and API Architecture

## 目标

后续需要把题库、结果文案、分享和结果页排版调试拆成可单独查看、校验和预览的能力。第一阶段目标不是做公开后台，也不是重写产品，而是在现有 JSON 数据、评分函数和结果生成函数外面加一层只读接口与本地 Debug 入口，让修改某一块内容时可以局部验证。

本方案遵守当前 1.0 边界：

- 不直接改题库题干。
- 不直接改评分逻辑。
- 不把 Debug 页面暴露成公开后台。
- 不引入数据库、登录、付费或 AI 报告生成。
- 不破坏现有 UI v2 收口。

## 现状判断

当前项目已经具备适合 API 化的基础：

- `data/questions.json`、`data/result-templates.json`、`data/recommendations.json`、`data/site-content.json` 是独立 JSON 内容源。
- `scripts/validate-data.mjs` 已经能校验题库、阶段、象限、推荐、结果模板、站点文案和禁用术语。
- `lib/result-builder.ts` 是结果生成入口，可用于 Debug 预览。
- `lib/share-link.ts` 已经封装分享链接编码和解码。
- `app/api/submit/route.ts` 已经证明服务端路由可以复用 `buildResult`。
- `/result/share?a=...` 已经可以不依赖 localStorage 重建分享结果。

同时也有需要保持稳定的核心：

- `lib/scoring.ts` 是评分核心规则，不应在 Debug 页面里变成可编辑配置。
- `lib/storage.ts` 是浏览器 localStorage 存取，只服务用户流程，不适合作为内容管理层。
- UI v2 当前正在收口，Debug 入口应独立于主导航和正式用户路径。

## 适合 API 化的能力

### 题库读取

只读返回 `data/questions.json`，用于 Debug 页面查看题目、象限、维度、反向题和题量统计。

建议路由：

```text
GET /api/content/questions
```

### 题库校验

复用 `scripts/validate-data.mjs` 中的规则，返回结构化错误，而不是只在终端里失败。第一版可以只校验仓库内当前 JSON；后续再支持上传或粘贴草稿 JSON。

建议路由：

```text
POST /api/debug/validate-content
```

### 结果模板读取

只读返回 `data/result-templates.json`，用于检查 Human 1.1 到 3.3 的标题、Metatype、中文名、核心问题、象限互动和朋友视角文案。

建议路由：

```text
GET /api/content/result-templates
```

### 推荐行动读取

只读返回 `data/recommendations.json`，用于按限制象限检查 24 小时、7 天、30 天、90 天建议。

建议路由：

```text
GET /api/content/recommendations
```

### 站点文案读取

只读返回 `data/site-content.json`，用于检查首页 badge、intro、结果示例、outcomes 和免责声明。

建议路由：

```text
GET /api/content/site-content
```

### 分享链接编码和解码

复用 `lib/share-link.ts`，帮助检查某组答案会生成什么分享码，或者某个分享码会还原成什么答案。

建议路由：

```text
POST /api/share/encode
POST /api/share/decode
```

### 结果预览

复用 `buildResult`，用假答案生成完整报告，帮助调结果页排版、文案密度、卡片字段和分享卡片信息。它可以接受完整答案，也可以接受 preset，例如 all-3、all-4、mind-high-body-low。

建议路由：

```text
POST /api/debug/preview-result
```

### 内容版本信息

第一版先返回本地 JSON 内容源、schema 版本、题量、模板数量、推荐数量和分享链接版本。后续如果引入内容版本，可再加入文件 hash、发布时间、内容作者和草稿状态。

建议路由：

```text
GET /api/content/version
```

## 现在不适合 API 化的能力

- 评分核心规则：`lib/scoring.ts` 里的阈值、阶段判定和四象限规则应继续由代码和测试保护，不能先变成后台可调参数。
- 用户系统：当前产品无需登录，Debug 第一版也只面向本地开发。
- 数据库写入：`/api/submit` 仍是未来持久化预留，不应为了 Debug 先接 Supabase。
- 付费：当前没有产品闭环和权限模型，不进入本阶段。
- AI 报告生成：会引入成本、审核、稳定性和隐私问题，应等基础内容管理稳定后再讨论。

## 页面到接口映射

这张表用于 UI 返工和 API 边界对齐。短期内页面仍可直接读取本地 JSON；接口先作为边界定义和 Debug 能力存在。等 UI 首页直接套原文件完成后，再逐步把页面数据源切到这些接口，避免返工期间同时改布局和数据流。

| 页面 | 页面内容 | 推荐接口 | 当前接入策略 | 说明 |
| --- | --- | --- | --- | --- |
| `/` 首页 | 首页静态内容、产品 intro、结果预览、outcomes、免责声明 | `GET /api/content/site-content` | UI v2 收口前可继续直接读 `data/site-content.json` | 页面稳定后切到接口，方便后续改首页文案不进组件 |
| `/` 首页 | 四象限说明 | `GET /api/content/quadrants` | 可现在实现接口，页面稍后接入 | 当前四象限来自 `data/quadrants.json`，适合独立维护 |
| `/` 首页 | Human 1.1 到 3.3 层级/阶段说明 | `GET /api/content/stages` | 可现在实现接口，页面稍后接入 | 首页若展示模型说明或阶段列表，应从 `stages` 读取 |
| `/` 首页 | 内容版本、题库版本提示 | `GET /api/content/version` | 可作为 Debug 和页脚元信息预留 | 不建议在正式 UI 里过度展示技术版本 |
| `/assessment` 问卷页 | 48 道题、象限、维度、反向题信息 | `GET /api/content/questions` | UI v2 收口前可继续直接读 JSON，之后再接 | 题库读取和题库版本应从页面组件中抽离 |
| `/assessment` 问卷页 | 题库版本、内容 schema、分享码版本 | `GET /api/content/version` | 可现在作为开发态检查 | 用于确认用户作答时使用的是哪一版内容 |
| `/assessment` 问卷页 | 本地进度保存 | 暂不走 API，继续用 `lib/storage.ts` 和 localStorage | 现在不 API 化 | 进度是本机体验能力，不应为了 Debug 引入服务端状态 |
| `/assessment` 问卷页 | 提交/生成结果 | `POST /api/assessment/score` 或保留 `POST /api/submit` | 当前已有 `/api/submit`，建议后续命名收敛 | 如果只生成结果不写库，建议用 `/api/assessment/score`；若未来写库，`/api/submit` 可继续承担提交语义 |
| `/result` 结果页 | 读取最近一次答案/结果 | 暂不走 API，继续 localStorage | 现在不改主流程 | 页面先从本地答案重建结果，避免数据库依赖 |
| `/result` 结果页 | 用当前模板重建报告 | `POST /api/assessment/score` 或 `POST /api/debug/preview-result` | 正式页未来用 `score`，Debug 用 `preview-result` | 两者都应复用 `buildResult`，不能复制评分逻辑 |
| `/result` 结果页 | 结果模板 | `GET /api/content/result-templates` | 页面稳定后接入 | 用于标题、Metatype、Core Problem、Cross-Quadrant Dynamics、朋友视角 |
| `/result` 结果页 | 推荐行动 | `GET /api/content/recommendations` | 页面稳定后接入 | 由限制象限选择对应建议 |
| `/result` 结果页 | 分享卡片内容 | 由 `buildResult` 返回 `shareCard`，必要时读取 `GET /api/content/version` | 当前保留组件内生成 PNG | 卡片绘制本身不需要 API，卡片数据应来自结果对象 |
| `/result/share` 分享页 | 分享码解码 | `POST /api/share/decode` | 可先做 Debug 接口，正式页稍后接 | 当前页面直接调用 `decodeAnswersFromShare`，后续可改为接口边界 |
| `/result/share` 分享页 | 公开结果构建 | `POST /api/assessment/score` | 应等分享 decode 接口稳定后接 | 不写库时仍可用答案码重建结果 |
| `/result/share` 分享页 | 分享卡片 | 由公开结果返回 `shareCard` | 页面稳定后接 | 与 `/result` 共用展示组件 |
| `/debug/content` | 内容源总览、版本、计数、校验状态 | `GET /api/content/version`、各 `GET /api/content/*`、`POST /api/debug/validate-content` | 下一阶段优先做 | 只读，不保存 |
| `/debug/questions` | 题库查看、筛选、反向题检查 | `GET /api/content/questions`、`GET /api/content/quadrants` | 下一阶段优先做 | 不直接编辑题干 |
| `/debug/result-preview` | 假答案生成报告、排版调试 | `POST /api/debug/preview-result`、`GET /api/content/questions` | UI v2 结果页收口后做 | 用真实结果组件做预览，但不改评分 |
| `/debug/share` | 分享码生成、解码和预览 | `POST /api/share/encode`、`POST /api/share/decode`、`POST /api/debug/preview-result` | 可在结果预览后做 | 只调试，不写库 |

## 推荐 API 路由

### 内容层

这些接口只读 JSON 内容，适合现在安全实现，不影响 UI 返工。

```text
GET /api/content/site-content
GET /api/content/questions
GET /api/content/quadrants
GET /api/content/stages
GET /api/content/recommendations
GET /api/content/result-templates
GET /api/content/version
```

### 评估和预览层

正式产品语义建议使用 `POST /api/assessment/score`；Debug 语义建议使用 `POST /api/debug/preview-result`。两者可以共用底层 `buildResult`，但对外语义不同：

- `POST /api/assessment/score`：正式评估结果生成，不写数据库时只返回结果。
- `POST /api/debug/preview-result`：本地开发调试，用 preset 或假答案预览结果。

```text
POST /api/assessment/score
POST /api/debug/validate-content
POST /api/debug/preview-result
```

当前已有的 `POST /api/submit` 可以短期保留。后续若重命名，不要直接删除，应先让调用方迁移。

### 分享层

```text
POST /api/share/encode
POST /api/share/decode
```

返回格式建议统一为：

```json
{
  "data": {},
  "meta": {
    "readOnly": true,
    "source": "data/questions.json"
  }
}
```

错误格式建议统一为：

```json
{
  "error": "Human readable message.",
  "details": []
}
```

## 当前 API 完成状态

已实现的只读内容 API：

```text
GET /api/content/site-content
GET /api/content/questions
GET /api/content/quadrants
GET /api/content/stages
GET /api/content/recommendations
GET /api/content/result-templates
GET /api/content/version
```

已实现的评估和分享 API：

```text
POST /api/submit
POST /api/assessment/score
POST /api/share/encode
POST /api/share/decode
```

尚未实现的 Debug API：

```text
POST /api/debug/validate-content
POST /api/debug/preview-result
```

## 动态 API 契约

动态接口只做结果生成、分享编码/解码和 Debug 预览，不写文件、不写数据库、不改评分规则。所有结果都应复用现有 `data/*.json`、`lib/result-builder.ts` 和 `lib/share-link.ts`。

### `POST /api/assessment/score`

用途：正式评估结果生成。它是当前 `POST /api/submit` 的更清晰命名版本，适合后续结果页和分享页统一调用。

请求：

```json
{
  "answers": {
    "M01": 4,
    "M02": 3
  },
  "id": "optional-client-result-id"
}
```

处理方式：

- 从 `data/questions.json`、`data/stages.json`、`data/quadrants.json`、`data/recommendations.json`、`data/result-templates.json` 读取内容。
- 调用 `buildResult({ id, questions, answers, stages, quadrants, recommendations, templates })`。
- 不写 localStorage；localStorage 仍由客户端 `lib/storage.ts` 管。
- 不写数据库；未来若接数据库应另开提交/保存语义。

成功响应：

```json
{
  "data": {
    "result": {}
  },
  "meta": {
    "contentSchemaVersion": "local-json-v1",
    "readOnly": true
  }
}
```

错误响应：

```json
{
  "error": "Assessment is incomplete. Missing answers: M01",
  "details": []
}
```

状态码建议：

- `200`：成功返回结果。
- `400`：缺少答案、非法答案、答案不完整。
- `500`：内容文件缺失或结果模板不完整。

迁移建议：先新增 `/api/assessment/score`，保留 `/api/submit`；实现稳定后可让 `/api/submit` 复用同一个 helper，避免两套结果生成逻辑。

### `POST /api/share/encode`

用途：把完整答案编码成静态分享码和分享路径。用于结果页复制链接，也用于 `/debug/share`。

请求：

```json
{
  "answers": {
    "M01": 4,
    "M02": 3
  }
}
```

处理方式：

- 从 `data/questions.json` 读取题目顺序。
- 调用 `encodeAnswersForShare(questions, answers)`。
- 调用或复用 `buildShareResultPath(questions, answers)` 返回路径。

成功响应：

```json
{
  "data": {
    "code": "v1.44443333...",
    "path": "/result/share?a=v1.44443333..."
  },
  "meta": {
    "shareLinkVersion": "v1",
    "readOnly": true
  }
}
```

错误响应：

```json
{
  "error": "Cannot create share link. Missing answer: M01",
  "details": []
}
```

### `POST /api/share/decode`

用途：把分享码还原成答案对象。用于 `/result/share` 公开结果构建，也用于 `/debug/share`。

请求：

```json
{
  "code": "v1.44443333..."
}
```

处理方式：

- 从 `data/questions.json` 读取题目顺序。
- 调用 `decodeAnswersFromShare(questions, code)`。
- 只返回答案和基础元信息，不直接写入 localStorage。

成功响应：

```json
{
  "data": {
    "answers": {
      "M01": 4,
      "M02": 3
    }
  },
  "meta": {
    "shareLinkVersion": "v1",
    "questionCount": 48,
    "readOnly": true
  }
}
```

错误响应：

```json
{
  "error": "Invalid share link answers.",
  "details": []
}
```

### `POST /api/debug/preview-result`

用途：本地 Debug 结果预览。它可以用完整答案或固定 preset 生成报告，帮助调结果页排版、分享卡片字段和文案长度。

请求：

```json
{
  "answers": {
    "M01": 4,
    "M02": 3
  },
  "preset": "optional-all-4"
}
```

处理方式：

- 如果提供 `answers`，直接复用 `buildResult`。
- 如果提供 `preset`，由 `lib/debug-presets.ts` 生成答案，再复用 `buildResult`。
- 不暴露评分规则编辑入口。
- 不写 localStorage、JSON 文件或数据库。

成功响应：

```json
{
  "data": {
    "result": {},
    "answers": {}
  },
  "meta": {
    "debugOnly": true,
    "readOnly": true
  }
}
```

错误响应：

```json
{
  "error": "Unsupported preview preset.",
  "details": []
}
```

### `POST /api/debug/validate-content`

用途：把现有 `pnpm validate:data` 能力暴露给本地 Debug 页面，用于内容总览页显示校验状态。

请求：

```json
{
  "mode": "current-files"
}
```

处理方式：

- 先把 `scripts/validate-data.mjs` 的规则迁移到可导入的 `lib/content-validation.ts`。
- `scripts/validate-data.mjs` 调用同一套 validator。
- API 第一版只校验当前仓库 JSON，不接收可写草稿。

成功响应：

```json
{
  "data": {
    "valid": true,
    "errors": []
  },
  "meta": {
    "checkedSources": [
      "data/questions.json",
      "data/result-templates.json"
    ],
    "readOnly": true
  }
}
```

错误响应：

```json
{
  "data": {
    "valid": false,
    "errors": [
      "questions.json must contain exactly 48 questions."
    ]
  },
  "meta": {
    "readOnly": true
  }
}
```

## 可立即安全实现的接口

这些接口不会影响 UI 返工，也不改变正式评分规则：

- `POST /api/debug/validate-content`：先把现有校验脚本抽成可导入模块，再由 API 调用。
- `POST /api/debug/preview-result`：只接受完整答案或固定 preset，复用 `buildResult`，不写 localStorage、不写数据库。

评分和分享接口已完成并接入真实流程；后续 Debug 接口可以在 UI 稳定后独立完成，因为它们不要求修改首页、问卷页或结果页主流程。

## 上线前实现顺序

真实结果生成已经恢复并通过本地 `pnpm check`。后续如果继续做 Debug 和内容管理，建议按这个顺序：

1. 保留 `/api/submit` 作为兼容入口，短期不要删除；如后续重构，可以内部转调同一个 scoring helper。
2. 做 `POST /api/debug/preview-result`，供本地使用 preset 或完整答案预览结果页。
3. 做 `POST /api/debug/validate-content`，把数据校验脚本拆成可导入模块。
4. 再做 `/debug/content`、`/debug/questions`、`/debug/result-preview`、`/debug/share` 页面。

已完成并接入真实流程：

- `POST /api/assessment/score`。
- `POST /api/share/encode`。
- `POST /api/share/decode`。

可以留到 Debug 阶段：

- `POST /api/debug/preview-result`。
- `POST /api/debug/validate-content`。
- `/debug/content`、`/debug/questions`、`/debug/result-preview`、`/debug/share` 页面。

## 等 UI 首页套原文件完成后再接入的接口

这些更适合等页面结构稳定后再接入，否则容易把 UI 调整和数据流迁移混在一起：

- `/` 首页接入 `GET /api/content/site-content`、`GET /api/content/quadrants`、`GET /api/content/stages`。
- `/assessment` 接入 `GET /api/content/questions` 和 `GET /api/content/version`。当前仍直接读取题库 JSON，但完成提交已优先调用 `POST /api/assessment/score`。
- `/result` 接入 `GET /api/content/result-templates`、`GET /api/content/recommendations`。当前正式结果页仍读取 localStorage 真实结果，不再默认假结果。
- `/result/share` 已接入 `POST /api/share/decode` 和 `POST /api/assessment/score`，并保留本地回退。

页面接入时应先保留现有 direct JSON import 的行为作为参考，逐页替换，逐页跑测试。

## 推荐 Debug 页面

### `/debug/content`

内容总览页。显示题库、结果模板、推荐行动、站点文案的计数、来源、校验状态和最近版本信息。第一版只读，不提供保存按钮。

### `/debug/questions`

题库检查页。按象限、维度、是否反向计分筛选题目，显示每个象限题量和反向题数量。用于发现题库结构问题，不直接编辑题干。

### `/debug/result-preview`

结果预览页。选择预设答案或粘贴答案 JSON，调用 `POST /api/debug/preview-result` 生成完整结果。页面重点展示结果页真实组件或接近真实的数据结构，方便调排版和文案长度。

### `/debug/share`

分享调试页。输入答案 JSON 生成分享码和 `/result/share?a=...`，或输入分享码还原答案并预览结果。

## 访问边界

Debug 页面第一版只面向本地开发，不进入正式用户导航，也不作为公开后台发布。

如果未来部署到公开站，需要至少加一个保护层：

- 环境开关：例如 `ENABLE_DEBUG_ROUTES=true` 时才允许访问。
- 简单鉴权：例如 Vercel 保护、内部密码或登录态。
- 构建策略：生产构建默认不展示 Debug 页面入口。

在加保护前，不应实现任何写文件、导入草稿、覆盖正式题库或远程保存功能。

## 最小落地顺序

### 第一步：只读 API + 内容校验 API

先实现只读内容 API，并把校验脚本整理成可复用函数，让 `pnpm validate:data` 和 `POST /api/debug/validate-content` 共用同一套规则。

当前已可先落只读 API；校验 API 建议下一步做，因为需要把 `scripts/validate-data.mjs` 从脚本拆成可导入模块。

### 第二步：本地 Debug 页面

新增 `/debug/content`、`/debug/questions`，只查看题库、文案和推荐，不写文件。入口不加入正式导航，可直接输入 URL 打开。

### 第三步：结果预览器

新增 `/debug/result-preview` 和 `POST /api/debug/preview-result`，使用假答案调用 `buildResult`，帮助调整结果页排版和文案长度。此阶段仍不改评分逻辑。

### 第四步：分享编码/解码调试页面

新增 `/debug/share` 页面，复用已经完成的 `POST /api/share/encode` 和 `POST /api/share/decode`。用于检查静态分享链接和异常输入。

### 第五步：可编辑 JSON 草稿和导出

只有在用户确认后再做。建议支持粘贴 JSON、校验、生成草稿和导出文件，不直接自动覆盖正式题库。正式题库仍通过人工 review 和 `pnpm check` 合入。

## 实现建议

- 新增 `lib/content-data.ts`：集中导入 JSON 并导出 typed content，避免多个 API 路由重复导入。
- 新增 `lib/content-validation.ts`：把 `scripts/validate-data.mjs` 的校验函数迁移为可复用模块，脚本和 API 共用。
- 新增 `lib/debug-presets.ts`：维护假答案 preset，不污染正式评分逻辑。
- Debug 页面复用现有组件和数据结构，不复制结果页逻辑。
- Debug 页面视觉沿用 Human 3.0 黑白灰风格，但密度更高，偏工具台，不做营销页。

## 当前轻量实现

当前已新增只读内容 API：

```text
GET /api/content/questions
GET /api/content/quadrants
GET /api/content/stages
GET /api/content/result-templates
GET /api/content/recommendations
GET /api/content/site-content
GET /api/content/version
```

这些接口只读取现有 JSON，不写文件、不改主流程、不进入公开导航。后续 Debug 页面可以先消费这些接口。

当前也已新增正式评分和分享 API：

```text
POST /api/assessment/score
POST /api/share/encode
POST /api/share/decode
```

页面接入状态：

- `/assessment` 完成 48 题后优先调用 `POST /api/assessment/score`，失败时回退到本地 `buildResult`。
- `/result` 移除视觉复核预设结果，正式页面只读取 localStorage 中的真实结果。
- `/result/share` 优先调用 `POST /api/share/decode` 和 `POST /api/assessment/score`，失败时回退到本地解码和 `buildResult`。
- 结果页复制分享链接优先调用 `POST /api/share/encode`，失败时回退到本地编码。

最近验证：`pnpm check` 已通过，包含数据校验、63 个单元测试、lint、生产构建和 9 个端到端测试。
