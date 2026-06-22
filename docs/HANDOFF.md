# Handoff

## 项目目标

`human-3-assessment` 是 Human 3.0 自我发展评估网站的静态 MVP。产品目标是帮助用户看见当前人生系统状态：认知、身体、意义与事业如何协同运转，并得到阶段判断、卡点分析和下一步行动建议。

它不是 MBTI、Myers-Briggs 或 16 型人格测试，也不是医学、心理、法律或职业诊断工具。

产品事实来源：后续产品定位、功能状态、需求池和同步规则以 `docs/PRD.md` 为准。本文件只作为 AI 或开发者快速接手摘要。

## 当前完成状态

已完成可用 MVP：

- Living PRD：`docs/PRD.md` 已建立为单一产品事实来源，用于同步新需求、已完成功能、免费版和付费版规划。
- 首页：产品介绍、四象限简介、结果示例和免责声明。
- 答题页：48 道题、5 级选项、上一题、下一题、进度条。
- 本地保存：答题进度刷新后可恢复，最近一次结果保存在 localStorage。
- 结果页：Human 阶段、中文结果名、主导象限、限制象限、四象限状态、核心判断、主要限制因素、7 天/30 天/90 天建议、分享卡片。
- 免费结果系统：已加入 Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics 和 24 小时 Immediate Next Action。
- 分享卡片下载：已支持在浏览器生成 PNG 并下载。
- 静态分享链接：已支持复制 `/result/share?a=...`，通过 URL 中的答案码重建同一份结果。
- API 预留：`/api/submit` 可接收答案并生成结果，未来可接 Supabase。
- 测试和校验：已有核心计分测试、结果生成测试、分享链接测试、Playwright 端到端测试和严格数据校验命令。
- CI：已新增 GitHub Actions，在 push、pull request 和手动触发时运行 `pnpm check`。

最近一次交接审计结果：

- `pnpm install` 通过。
- `pnpm validate:data` 通过。
- `pnpm test` 通过，14 个测试通过。
- `pnpm test:e2e` 通过，4 个端到端测试通过。
- `pnpm lint` 通过。
- `pnpm build` 通过。
- `pnpm check` 通过，已串联数据校验、单元测试、代码检查、生产构建和端到端测试。
- GitHub Actions CI 已配置，等待推送到远程仓库后观察首次运行。
- 浏览器流程验证通过：首页进入测评、答题、上一题/下一题、刷新恢复、完成后进入结果页。
- 浏览器结果页检查通过：Metatype、Lifestyle Archetype、Core Problem、Cross-Quadrant Dynamics、Immediate Next Action 和分享卡片可见，且不展示原始分数。
- 移动端 390px 宽度检查通过：首页、答题页、结果页无横向溢出。

## 如何运行

```bash
pnpm install
pnpm exec playwright install chromium
pnpm dev
```

默认地址：

```text
http://localhost:3000
```

验证命令：

```bash
pnpm validate:data
pnpm lint
pnpm test
pnpm build
```

完整本地验收命令：

```bash
pnpm check
```

环境注意：在当前 Codex 桌面环境里，系统默认路径可能没有 Node。可使用工作区内置 Node/pnpm，或在本机正常安装 Node.js 和 pnpm 后运行以上命令。

## 页面入口

- `/`：首页。
- `/assessment`：答题页。
- `/result`：读取当前浏览器最近一次结果。
- `/result/[id]`：预留分享结果路由，第一版仍读取本地结果。
- `/api/submit`：预留服务端提交接口。

## 关键业务规则

- 题目共 48 道，Mind、Body、Spirit、Vocation 各 12 道。
- 每题答案为 1 到 5。
- `reverseScored = true` 时使用 `6 - answer` 反向计分。
- 每个象限总分范围为 12 到 60。
- 结果页不展示原始分数，只展示状态：尚未稳定、正在形成、已有基础、相对成熟。
- 主导象限是得分最高象限，限制象限是得分最低象限。
- Human 阶段范围为 Human 1.1 到 Human 3.3。
- 阶段和建议不是诊断结论，只用于自我理解和个人发展参考。

完整规则见 `docs/SCORING_RULES.md`。

## 关键技术文件

- `lib/types.ts`：核心类型。
- `lib/scoring.ts`：计分逻辑入口，包含反向计分、象限状态、Human 层级、阶段、主导/限制象限。
- `lib/result-builder.ts`：结果生成入口，把评分结果和 JSON 文案组合成用户报告。
- `lib/storage.ts`：localStorage 保存、恢复、清理。
- `lib/constants.ts`：站点名称、答案选项、象限顺序、状态文案。
- `lib/supabase.ts`：未来 Supabase 懒初始化入口，目前故意不接入。
- `components/AssessmentFlow.tsx`：答题流程。
- `components/ResultClient.tsx`：结果页本地读取。
- `components/ShareCard.tsx`：分享卡片展示和下载入口。
- `lib/share-card-image.ts`：Canvas 生成 PNG 分享卡片。
- `lib/share-link.ts`：静态分享链接编码和解码。
- `components/SharedResultClient.tsx`：读取分享链接并重建结果。
- `app/api/submit/route.ts`：未来提交接口。
- `scripts/validate-data.mjs`：严格检查数据文件结构、覆盖范围、重复项、模板占位符和禁止使用的受保护人格测试名称。
- `playwright.config.ts`：端到端测试配置，会在 `127.0.0.1:3100` 启动独立测试服务。
- `tests/e2e/`：端到端测试，覆盖完整测评流程、刷新恢复、分享链接和移动端核心控件。
- `.github/workflows/ci.yml`：CI 工作流，使用 Node.js 22、pnpm 11.5.3、Playwright Chromium 和 `pnpm check`。

## 数据文件说明

- `data/questions.json`：题库。产品人员改题优先改这里。
- `data/stages.json`：Human 1.1 到 Human 3.3 阶段定义。
- `data/quadrants.json`：四象限定义。
- `data/recommendations.json`：按限制象限给出的 24 小时、7 天、30 天、90 天行动建议。
- `data/result-templates.json`：结果标题模板、Metatype、生活方式原型、核心问题、象限互动、摘要和分享关键词。
- `data/site-content.json`：首页产品文案。

改动数据后运行：

```bash
pnpm validate:data
pnpm test
```

交接或发布前运行：

```bash
pnpm check
```

## 已知问题

- `/result/[id]` 还不是真实分享链接，因为第一版没有数据库。
- `/result/share?a=...` 是当前静态分享链接方案，链接包含 48 个答案码；适合 MVP 验证，不适合作为长期隐私方案。
- localStorage 清除后，答题进度和最近一次结果不可恢复。
- 分享卡片下载依赖浏览器下载行为，移动端不同浏览器可能表现不同，需要真机验收。
- 端到端测试目前覆盖核心 happy path，尚未覆盖异常链接、下载 PNG 和 API 路由。
- CI 已配置但尚未在远程仓库实际跑过，首次 push 后需要检查 Actions 日志。
- Human 层级和阶段阈值是 MVP 默认规则，需要真实样例校准。
- 题目尚未经过正式心理测量或大样本验证，不能宣传为科学诊断。

## 下一步建议

1. 先阅读 `docs/PRD.md`，确认当前产品方向和需求状态。
2. 审校题目和结果文案，确认语气克制、自然、无诊断化表达。
3. 用 10 到 20 个样例答案校准 `lib/scoring.ts` 的层级和阶段阈值。
4. 审校分享卡片 PNG 的视觉层级、文案长度和移动端下载体验。
5. 推送远程后观察首次 CI 运行，并继续扩展异常路径端到端测试。
6. 接入 Supabase，落地 `assessment_submissions` 和 `assessment_versions`。
7. 让 `/result/[id]` 读取数据库结果，并替代当前 URL 答案码分享方案。
8. 实现复测记录。
