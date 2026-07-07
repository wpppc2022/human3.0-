# HUMAN 3.0 页面模板开发指南

## 目标

模板系统用于通过“模板 + JSON 可序列化配置”生成页面，类似选择幻灯片模板后填入内容。它不替换当前正式首页、测评页、结果页或 PDF 报告。

内部入口：

- `/debug/ui-templates`：Human3 primitives 和状态预览。
- `/debug/template-gallery`：模板目录、筛选和 Preview Detail。
- `/debug/template-examples/marketing-levels`：Marketing 模板配置 A。
- `/debug/template-examples/marketing-transformation`：同一 Marketing 模板配置 B。
- `/debug/template-examples/product-report`：Product 模板示例。

这些路由均为 `noindex`，不进入正式导航。生产发布前是否关闭 Debug 路由仍是 TODO。

## 四层目录

```text
styles/
  human3-system.css          Design tokens 和 primitives class 契约
  human3-templates.css       Section、Page、Gallery 布局
components/human3/           React primitives 和小型 client 控制器
templates/
  schema.ts                  JSON-safe 类型；不得 import React
  catalog.ts                 metadata-only 目录；Gallery 默认只读这里
  definitions.ts             JSON-safe defaults、policy、版本
  guards.ts                  unknown 输入严格校验
  registry.tsx               runtime-only registration 和 React component
  render-section.tsx         Section discriminated union renderer
  render-template.tsx        Page renderer 和明确错误/空态
  icon-map.tsx               IconRef 到 Lucide 的受控映射
  sections/                  七个 Section Templates
  pages/                     五个 Page Templates
  configs/examples.ts        typed example configs
app/debug/                   Gallery、示例和 primitives 预览路由
```

## 三层 Registry

1. `TemplateMetadata` 完全 JSON-safe，只用于 list、filter、search、Gallery 和 Picker。不得 import React、renderer 或完整 default config。
2. `TemplateDefinition` 完全 JSON-safe，包含版本、`defaultProps` / `defaultSections` 和 `sectionPolicy`。
3. `TemplateRegistration` 只在运行时使用，关联 definition、metadata 与 React component。`component` 只允许出现在这一层。

`catalog.ts` 不能 import `registry.tsx`。Gallery 也不能 import runtime registry，以免把所有 renderer 打进 client bundle。

## 配置规则

业务配置只能包含 JSON 数据：字符串、数字、布尔、数组、对象和 `null`。以下内容禁止进入配置：

- ReactNode、JSX、function、ComponentType。
- Date、Map、class instance。
- `className`、`style`、任意 component name。
- 任意 HTML、MDX、脚本或 `javascript:` / `data:` URL。

链接使用 `ActionDestination`：

```ts
{ kind: "route", path: "/assessment" }
{ kind: "anchor", id: "template-content" }
{ kind: "url", url: "https://example.com" }
```

图标使用受控 `IconRef`，渲染层再映射到 Lucide。图片通过 `ImageConfig` 注入，必须提供 `src`、`alt`、`aspect`，可选 `focalPoint` 的 `x/y` 范围是 `0-1`。

代码内配置使用：

```ts
const page = {
  schemaVersion: "1.0",
  id: "example",
  title: "Example",
  locale: "zh-CN",
  templateId: "marketing-page",
  pageKind: "marketing",
  sections: [],
} as const satisfies PageConfig;
```

外部 JSON 必须先作为 `unknown` 传入 `validatePageConfig`。v1 拒绝未知字段，避免 CMS 拼写错误被静默吞掉。

## 新增 Section Template

1. 在 `templates/schema.ts` 扩展 `SectionTemplateId`、Props 类型和 `SectionInstanceConfig` discriminated union。
2. 在 `templates/catalog.ts` 添加 metadata。
3. 在 `templates/definitions.ts` 添加 JSON-safe default props。
4. 在 `templates/guards.ts` 添加严格字段、嵌套 ID、URL 和边界校验。
5. 在 `templates/sections/` 新建 Server Component；只有交互状态下沉到小型 client component。
6. 在 `templates/render-section.tsx` 增加显式 `case`。不得使用任意 props 逃生口。
7. 在 `templates/registry.tsx` 注册 runtime component。
8. 增加 unit、E2E、Gallery metadata 和文档。

第一批官方 Section：`hero`、`feature-grid`、`pricing`、`faq`、`testimonial`、`cta`、`rich-text`。

## 新增 Page Template

1. 扩展 `PageTemplateId`、`PageKind` 和 `PageConfig` union。
2. 添加 metadata、definition、section policy 和合法 default sections。
3. 在 `templates/pages/` 新建只负责结构和 slot 顺序的 Server Component。
4. 在 `TemplatePageRenderer` 和 runtime registry 中增加显式分支。
5. 至少添加一份 typed example config，证明内容来自配置。

Page Template 不得硬编码业务文案或图片路径。第一批 Page：Landing、Marketing、Blog List、Blog Detail、Product。

## 修改和复制模板

- 只改内容：复制 `templates/configs/examples.ts` 中某个 config，保持 `templateId` 不变并替换 section props。
- 改结构：新增或调整 Page Template，明确更新 `sectionPolicy`。
- 改视觉：优先修改共享 token / class；不要在 config 中增加 `customCss`。
- 改 schema：提升 `configSchemaVersion`，同步 guard、迁移说明和测试。

`marketing-levels` 与 `marketing-transformation` 使用相同 `marketing-page`，是“同模板、不同配置”的基准用例。

## 渲染

```tsx
import { TemplatePageRenderer } from "@/templates/render-template";
import { marketingLevelsConfig } from "@/templates/configs/examples";

export default function Preview() {
  return <TemplatePageRenderer config={marketingLevelsConfig} />;
}
```

未知 template ID：runtime `get*` 抛 `UnknownTemplateError`，`find*` 返回 `undefined`。非法配置抛 `TemplateConfigError`；空 sections 显示明确空态。

## Gallery 与 Picker

Gallery 信息架构：紧凑页头、URL 可恢复工具栏、结果摘要、TemplateCard 集合、Preview Detail。卡片只显示 thumbnail、name、说明、type、ID、variant、兼容版本、状态和 Preview 命令。

Preview Detail 是唯一显示未来 Insert template 主按钮的位置。当前按钮禁用并通过 `aria-describedby` 显示原因，不产生副作用。预留接口是 `TemplateInsertHandler`，本轮不接数据库、拖拽或写 API。

状态模型：

- Empty library：无框文本。
- Filter no results：保留工具栏和 Clear filters。
- Unknown：不猜 renderer，不渲染 raw HTML。
- No preview：明确图标和文案，不使用永久 skeleton。
- Loading：局部 loading。
- Error：结果区错误和 Retry。

## 静态首页关系

正式 `/` 继续直接读取 `ui-prototypes/human-3-ui-v2.html`，不迁移到 Page Template。首页的 `#levels` 和 `#false-transformation` 只共享 `h3-*` token / class / data 契约与既有静态脚本，避免破坏 Canvas 和用户已确认的结构。

## 未来 CMS / API

本轮不创建模板写 API 或只读空壳 API。schema 稳定后可增加：

- `GET /api/templates`
- `GET /api/templates/:id`
- `GET /api/page-configs/:slug`
- `GET /api/template-schema/version`

未来仍需草稿/发布/回滚、鉴权、媒体上传、版本迁移和 CMS 编辑器设计。

## 常见错误

- Gallery import runtime registry：会扩大 client bundle，禁止。
- 配置加入 JSX、className 或 style：guard 应拒绝。
- 新增 section 但漏掉 renderer case：`assertNever` 和 TypeScript 应阻止构建。
- 使用任意 HTML/MDX：v1 不支持。
- 卡片内嵌卡片：违反 primitives 契约。
- 把 Debug 路由加入正式导航：禁止。

## 验收清单

- JSON stringify/parse 后配置等价。
- metadata 不含 function、component 或完整 defaults。
- unknown field、非法 URL、重复 ID、policy 错误有 path/code/message。
- 同一 Page Template 可渲染两套不同配置。
- 1440 / 1024 / 390 / 320 无页面横向溢出。
- 200% 文字缩放不截断；reduced-motion 关闭位移和 smooth scroll。
- Gallery filters 可通过 URL 恢复；Preview dialog 支持 Esc。
- `pnpm check` 通过。

