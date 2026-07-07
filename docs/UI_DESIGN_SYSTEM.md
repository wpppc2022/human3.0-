# HUMAN 3.0 UI Design System

## 范围

本设计系统服务于可复用内容卡片、Section Templates、Page Templates 和 Debug Gallery。它不强制重构 `/assessment`、`/result`、PDF/A4、分享 Canvas、导航、图表或免责声明。

## Token 单一来源

`styles/human3-system.css` 是 token 与 primitives class 契约的唯一来源。Next.js 通过 `app/globals.css` 引入；静态首页通过 `ui-prototypes/human-3-ui-v2.html` 的 `<link>` 引入。

核心 token：

```css
--h3-page-bg: #000;
--h3-section-bg: #111;
--h3-section-bg-alt: #141414;
--h3-card-bg: #000;
--h3-card-hover: #050505;
--h3-card-active: #0a0a0a;
--h3-media-bg: #1a1a1a;
--h3-border: rgba(255, 255, 255, 0.07);
--h3-border-hover: rgba(255, 255, 255, 0.15);
--h3-border-strong: rgba(255, 255, 255, 0.24);
--h3-text: #ededed;
--h3-text-secondary: #a0a0a0;
--h3-text-muted: #878787;
--h3-card-radius: 8px;
--h3-control-radius: 9999px;
```

不开放彩色、渐变、光晕、任意圆角或阴影 props。

## Class / Data 契约

- `.h3-card.h3-card--content`
- `.h3-media-card`
- `.h3-card.h3-card--expandable`
- `.h3-carousel-section`
- `.h3-button.h3-button--primary`
- `.h3-icon-button`
- `data-carousel`
- `data-card-toggle`
- `data-expanded`

React 和静态 HTML 必须输出相同契约，不创建 CSS Modules 视觉副本。

## React Primitives

```tsx
<Human3Card
  eyebrow="LEVEL 1.0"
  icon={<CircleDot />}
  title="按照默认脚本生活"
  description="更多依赖外部规则和惯性。"
/>

<Human3ExpandableCard
  title="开始自己选择"
  summary="关闭态摘要"
  details="展开态说明"
/>

<Human3Carousel label="成长层级">
  {/* cards */}
</Human3Carousel>
```

Primitives 位于 `components/human3/`。内容卡 Footer 使用 `margin-top:auto`；非交互卡没有 hover/cursor；整卡跳转必须输出语义链接。

## 静态 HTML 示例

```html
<section class="h3-card-section h3-carousel-section">
  <div class="h3-carousel" data-carousel>
    <div class="h3-carousel__track" role="region" aria-label="示例卡片">
      <article class="h3-card h3-card--expandable" data-expanded="false">
        <button
          class="h3-icon-button h3-icon-button--plus"
          data-card-toggle
          aria-expanded="false"
          aria-controls="detail-1"
        >
          <!-- Lucide Plus SVG -->
        </button>
      </article>
    </div>
  </div>
</section>
```

首页现有 `.insight-*` 保留页面专属尺寸和脚本，同时追加 `h3-*` 契约。

## 组件规则

- Card：灰色 section、黑色 card、8px 圆角、1px 7% 白色边界。
- MediaCard：只支持 `square`、`portrait (4/5)`、`wide (16/10)`；正式页面必须用真实素材。
- ExpandableCard：外部尺寸固定，summary/details 内部切换，同一 carousel 最多展开一张。
- Carousel：只横向滚动，scroll-snap，末卡保留 gutter；无溢出隐藏箭头；卡片不能逐卡 reveal。
- PrimaryButton：48px，compact 44px，白底黑字胶囊；每个视图最多一个高强调动作。
- IconButton：48px、最小 44px，Lucide Plus/ArrowLeft/ArrowRight；expanded Plus 旋转 45°。

## 状态与无障碍

- Hover 只提高边框或轻微背景，不浮起、不缩放、不加阴影。
- Focus-visible 使用内外双层焦点环。
- Disabled 同时改变颜色、背景和 cursor，不只依赖 opacity。
- 原生 button / link；触控尺寸不低于 44px。
- `aria-expanded`、`aria-controls` 和区域 label 必须完整。
- `prefers-reduced-motion` 关闭平滑滚动、旋转、淡入和位移。

## 响应式

基准断点：401 / 601 / 961 / 1200 / 1400。

- 1440：内容卡三列；Gallery 三列。
- 1024：卡片轨道约 2.5 卡；Gallery 两列。
- 390 / 320：单卡或单列；carousel 下一张真实可见，不透明、不位移。
- Card gap：桌面 20px、移动 12px。
- Card padding：桌面 32-40px、移动 24px。

## Gallery IA

Gallery 使用紧凑页头、URL 可恢复工具栏、结果摘要、TemplateCard collection 和 Preview Detail。1200 以上为右侧无框面板，1199 以下为 overlay，移动端全屏。Gallery 不使用营销 Hero、统计卡、badge 墙、嵌套卡或后台表格。

截图矩阵：

- `output/playwright/template-system/gallery-1440.png`
- `output/playwright/template-system/gallery-detail-1024.png`
- `output/playwright/template-system/gallery-390.png`
- `output/playwright/template-system/gallery-320.png`
- `output/playwright/template-system/marketing-levels-1440.png`
- `output/playwright/template-system/product-report-390.png`

## 预览入口

- `/debug/ui-templates`
- `/debug/template-gallery`
- `/debug/template-examples/marketing-levels`
- `/debug/template-examples/marketing-transformation`
- `/debug/template-examples/product-report`

这些页面用于开发验收，不进入正式导航；真实 iPhone Safari / Android Chrome 仍需人工复核触控和 200% 系统字体。

