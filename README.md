# human-3-assessment

Human 3.0 自我发展评估是一个静态 MVP 网站，帮助用户评估当前人生系统状态：认知、身体、意义与事业如何协同运转。

本项目不是 MBTI、Myers-Briggs 或 16 型人格测试，也不使用相关受保护名称或表达。它只用于自我理解和个人发展参考，不构成医学、心理、法律或职业诊断建议。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm
- Vitest
- Playwright

第一版不接数据库、不做登录、不做支付。`lib/supabase.ts` 和文档中已预留未来 Supabase 接入位置。

## 安装和运行

安装依赖：

```bash
pnpm install
```

首次运行端到端测试前安装浏览器：

```bash
pnpm exec playwright install chromium
```

本地运行：

```bash
pnpm dev
```

默认开发地址：

```text
http://localhost:3000
```

构建生产版本：

```bash
pnpm build
```

运行生产构建：

```bash
pnpm start
```

检查命令：

```bash
pnpm check
pnpm lint
pnpm test
pnpm test:e2e
pnpm validate:data
```

`pnpm check` 会依次运行数据校验、单元测试、代码检查、生产构建和 Playwright 端到端测试，适合作为交接前的完整本地验收。

## 项目结构

```text
app/                    页面和 API 路由
components/             展示组件和客户端交互组件
data/                   题库、阶段、象限、建议、结果模板
lib/                    类型、计分、结果生成、存储和未来 Supabase 入口
docs/                   产品、模型、架构、交接和工程管理文档
tests/                  Vitest 单元测试和 Playwright 端到端测试
public/images/          预留图片资源目录
```

## 当前状态

已完成静态 MVP：用户可以从首页开始评估，完成 48 道题后看到 Human 阶段、Metatype、Lifestyle Archetype、主导象限、限制象限、四象限状态、核心问题、象限互动、24 小时行动、7/30/90 天建议，并下载 PNG 分享卡片或复制静态分享链接。答题进度与结果保存在当前浏览器的 localStorage。

## 重要文件

- `docs/PRD.md`：Living PRD，产品事实来源，记录产品定位、功能状态、需求池和同步规则。
- `data/questions.json`：48 道题，产品人员未来可优先维护这里。
- `data/stages.json`：Human 1.1 到 Human 3.3 的阶段定义。
- `data/quadrants.json`：Mind、Body、Spirit、Vocation 四象限定义。
- `data/recommendations.json`：按限制象限生成 24 小时、7 天、30 天、90 天建议。
- `data/result-templates.json`：结果标题、Metatype、生活方式原型、核心问题、象限互动、摘要和分享关键词模板。
- `data/site-content.json`：首页产品文案。
- `lib/scoring.ts`：计分逻辑。
- `lib/result-builder.ts`：把计分结果组合成中文报告。
- `lib/types.ts`：核心类型定义。
- `lib/storage.ts`：localStorage 保存和恢复。
- `lib/share-card-image.ts`：Canvas 生成 PNG 分享卡片。
- `lib/share-link.ts`：把 48 个答案编码为静态分享链接，并从链接重建答案。
- `components/AssessmentFlow.tsx`：答题流程和本地保存。
- `components/ResultClient.tsx`：结果页读取和展示。
- `docs/HANDOFF.md`：AI 或开发者快速接手摘要。
- `scripts/validate-data.mjs`：严格检查 `data/` 目录结构、题量、阶段覆盖、重复项、模板占位符和禁止使用的受保护人格测试名称。
- `playwright.config.ts`：端到端测试配置，会在 3100 端口启动独立测试服务。
- `tests/e2e/`：覆盖首页进入测评、刷新恢复、完整答题、结果页、分享链接和移动端核心控件。

## 下一步开发建议

1. 审校 48 道题和 Human 阶段阈值，确认结果分布符合产品直觉。
2. 审校 Metatype、Lifestyle Archetype、Core Problem 和 Immediate Next Action 文案。
3. 将 `pnpm check` 接入 CI。
4. 接入 Supabase，让 `/result/[id]` 支持短链接和服务端结果持久化。
5. 实现复测记录和真实分享链接。
