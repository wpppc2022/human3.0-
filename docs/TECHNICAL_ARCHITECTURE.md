# Technical Architecture

## 前端架构

项目使用 Next.js App Router。页面位于 `app/`，展示组件位于 `components/`，核心业务逻辑位于 `lib/`，可维护数据位于 `data/`。

交互页面采用客户端组件：

- `components/AssessmentFlow.tsx`：答题流程、进度恢复、结果生成。
- `components/ResultClient.tsx`：读取 localStorage 中最近一次结果的答案，用当前数据模板重建结果并渲染。

展示组件只接收数据并渲染，不包含计分规则。

## 组件职责

- `AssessmentIntro`：首页内容和四象限简介。
- `QuestionCard`：单题展示和 5 级选项。
- `ProgressBar`：答题进度。
- `ResultSummary`：顶部结果和核心判断。
- `QuadrantMap`：四象限状态。
- `RecommendationBlock`：7 天、30 天、90 天建议。
- `ShareCard`：分享卡片展示和 PNG 下载入口。

## 核心函数

- `normalizeScore`：处理反向计分。
- `calculateQuadrantScores`：计算四象限分数和状态。
- `determineLevel`：判断 Human 1.0、2.0、3.0。
- `determinePhase`：判断 X.1、X.2、X.3。
- `scoreAssessment`：输出完整评分结果。
- `buildResult`：把评分结果、阶段、象限、建议和模板组合为用户报告，包括 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics 和 Immediate Next Action。
- `buildShareCardImage`：用 Canvas 生成 1080x1440 的 PNG 分享卡片。
- `encodeAnswersForShare` / `decodeAnswersFromShare`：把 48 个答案编码进 URL，或从静态分享链接恢复答案。

## 数据流

1. 页面加载 `data/questions.json`。
2. 用户在 `/assessment` 作答。
3. `AssessmentFlow` 将答案保存到 localStorage。
4. 完成 48 题后调用 `buildResult`。
5. 结果保存到 localStorage。
6. `/result` 读取最近一次结果的答案，并用当前数据模板重建结果后展示。这样模板升级后，旧浏览器结果也能迁移到新结构。
7. 用户复制分享链接时，`lib/share-link.ts` 将答案按题目顺序编码为 `v1.<48 digits>`，路由 `/result/share?a=...` 再解码并重建结果。

## 状态管理

第一版只使用 React state 和 localStorage。没有全局状态库。

localStorage key：

- `human-3-assessment-progress`
- `human-3-assessment-result`

## API 路由

`app/api/submit/route.ts` 已预留提交接口。第一版客户端不依赖它，未来接入持久化时可复用同一套 `buildResult` 逻辑。

`app/result/share/page.tsx` 是当前静态分享路由，不依赖数据库。它适合 MVP 验证，但 URL 中包含答案码；接入 Supabase 后应优先使用 `/result/[id]` 短链接。

## Supabase 接入方式

`lib/supabase.ts` 当前只保留占位函数。未来接入时应使用懒初始化，避免构建阶段读取环境变量导致失败。

建议流程：

1. 新增 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
2. 在 `lib/supabase.ts` 创建懒初始化客户端。
3. 在 `/api/submit` 中写入 `assessment_submissions`。
4. 为结果链接 `/result/[id]` 增加服务端读取逻辑。
5. 用 `assessment_versions` 管理题库和报告版本。

## 测试

当前使用 Vitest。`tests/scoring.test.ts` 覆盖核心计分，`tests/result-builder.test.ts` 覆盖免费结果字段、限制象限建议、分享卡片和缺失模板错误，`tests/share-link.test.ts` 覆盖静态分享链接编码和解码。

数据校验使用 `scripts/validate-data.mjs`。它会检查 `data/` 目录的字段集合、题量、象限覆盖、阶段覆盖、重复项、推荐项数量、模板占位符和禁止使用的受保护人格测试名称。`pnpm check` 会串联运行数据校验、单元测试、代码检查、生产构建和端到端测试。

端到端测试使用 Playwright：

- `playwright.config.ts`：在 `127.0.0.1:3100` 启动独立 Next.js 开发服务，避免影响用户当前打开的 `localhost:3000`。
- `tests/e2e/assessment-flow.spec.ts`：覆盖首页进入测评、刷新恢复、完成 48 题、结果页和静态分享链接。
- `tests/e2e/mobile.spec.ts`：用移动端视口检查答题页核心控件和横向溢出。

首次运行端到端测试前需要执行：

```bash
pnpm exec playwright install chromium
```

未来建议补充：

- result-builder 快照测试。
- 将 `pnpm check` 接入 CI。
- API 路由测试。
