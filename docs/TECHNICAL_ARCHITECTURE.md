# Technical Architecture

## 前端架构

项目使用 Next.js App Router。页面位于 `app/`，展示组件位于 `components/`，核心业务逻辑位于 `lib/`，可维护数据位于 `data/`。

交互页面采用客户端组件：

- `components/AssessmentFlow.tsx`：答题流程、进度恢复、结果生成。
- `components/ResultClient.tsx`：读取 localStorage 中最近一次结果并渲染。

展示组件只接收数据并渲染，不包含计分规则。

## 组件职责

- `AssessmentIntro`：首页内容和四象限简介。
- `QuestionCard`：单题展示和 5 级选项。
- `ProgressBar`：答题进度。
- `ResultSummary`：顶部结果和核心判断。
- `QuadrantMap`：四象限状态。
- `RecommendationBlock`：7 天、30 天、90 天建议。
- `ShareCard`：静态分享卡片。

## 核心函数

- `normalizeScore`：处理反向计分。
- `calculateQuadrantScores`：计算四象限分数和状态。
- `determineLevel`：判断 Human 1.0、2.0、3.0。
- `determinePhase`：判断 X.1、X.2、X.3。
- `scoreAssessment`：输出完整评分结果。
- `buildResult`：把评分结果、阶段、象限、建议和模板组合为用户报告。

## 数据流

1. 页面加载 `data/questions.json`。
2. 用户在 `/assessment` 作答。
3. `AssessmentFlow` 将答案保存到 localStorage。
4. 完成 48 题后调用 `buildResult`。
5. 结果保存到 localStorage。
6. `/result` 读取最近一次结果并展示。

## 状态管理

第一版只使用 React state 和 localStorage。没有全局状态库。

localStorage key：

- `human-3-assessment-progress`
- `human-3-assessment-result`

## API 路由

`app/api/submit/route.ts` 已预留提交接口。第一版客户端不依赖它，未来接入持久化时可复用同一套 `buildResult` 逻辑。

## Supabase 接入方式

`lib/supabase.ts` 当前只保留占位函数。未来接入时应使用懒初始化，避免构建阶段读取环境变量导致失败。

建议流程：

1. 新增 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
2. 在 `lib/supabase.ts` 创建懒初始化客户端。
3. 在 `/api/submit` 中写入 `assessment_submissions`。
4. 为结果链接 `/result/[id]` 增加服务端读取逻辑。
5. 用 `assessment_versions` 管理题库和报告版本。

## 测试

当前使用 Vitest，测试位于 `tests/scoring.test.ts`。

未来建议补充：

- result-builder 快照测试。
- JSON schema 校验。
- Playwright 端到端测试：完成答题、刷新恢复、查看结果。
- API 路由测试。
