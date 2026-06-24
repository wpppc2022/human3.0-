# Human 3.0 UI Prototypes

## 文件

- `human-3-ui-v2.html`
- `human-3-assessment-v2.html`
- `human-3-result-v2.html`

## 如何打开

直接用浏览器打开：

```text
/Users/wpppc/Documents/human 3.0/human-3-assessment/ui-prototypes/human-3-ui-v2.html
```

这些文件是单文件静态原型，内联 CSS 和少量内联 JS，不依赖 Next.js、npm、构建或本地服务。

结果页原型可直接打开：

```text
/Users/wpppc/Documents/human 3.0/human-3-assessment/ui-prototypes/human-3-result-v2.html
```

## 设计方向

- 当前版本覆盖首页、问卷页和结果页，但仍只作为静态视觉交互原型。
- 使用黑色主题和克制报告式排版：大留白、细分割线、清晰层级、少量按钮。
- 当前阶段只使用黑、白、灰；在用户指定具体颜色前，不引入蓝、紫、青、绿等强调色。
- 当前首屏使用黑白灰粒子文字动画；后续图片或动效通过 `media-slot` 这类占位接口接入。
- 卡片外层不使用硬边框；只有四象限交互选项保留细边框，用于表达可点击/可展开。
- 首页从“介绍一个测评”改为“解释一个模型”：认知、身体、意义、事业如何构成一个人生系统。
- 问卷页参考 Endel 式黑底评估界面，移动端优先，选项触控舒适，菜单采用 Apple 式全屏层级进入。
- 结果页参考报告型黑底视觉：左侧状态叙事，右侧元信息，中段四象限图和说明，下段行动与分享卡片。

## 网格系统

- 依据 `universal-electronic-product-grid-system`：当前页面判断为桌面网页 / 展示型界面 / 鼠标和触摸输入 / 低信息密度。
- 结构网格：桌面使用 12 栏隐性网格，版心约 1200px，页面安全边距随视口在 16px 到 64px 之间变化。
- 模块网格：媒体卡使用横向滑动轨道，图片或动画占位固定为 1:1 正方形；卡片宽度由视口推导，不无限拉伸。
- 基线节奏：使用 4px / 8px 间距序列，section、模块、组件内部间距分别使用不同 token。
- 组件尺寸：主要按钮和滑动控制按钮保持 44px 以上触控目标。
- 响应式：桌面多列和横向滑动，中屏保留多列，小屏改为单列内容流和横向卡片轨道，不做等比缩放。

## 覆盖页面状态

- 首页第一屏
- 独立问卷页：`human-3-assessment-v2.html`，点击首页“开始评估”后进入
- 独立结果页：`human-3-result-v2.html`，包含报告头部、元信息、四象限状态、当前状态、状态模式、优势盲点、下一步行动和分享卡片
- 为什么需要 HUMAN 3.0
- 四象限模型说明
- 发展层级
- False Transformation 转折屏
- 评估流程
- 结果预览与完整结果页方向
- 最终 CTA
- Codex Debug Panel：右下角可折叠面板，用于查看视口、断点、当前章节、滚动进度、Canvas 尺寸和动效状态。

## 后续落地注意

- 不要改评分模型、题库、登录、数据库或付费能力，只把首页视觉和交互映射到现有页面。
- 建议先把首页拆成 Hero、ProblemSection、QuadrantStory、LevelPath、FalseTransformation、FlowSection、ResultPreview、FinalCTA。
- 滚动动画可继续使用 IntersectionObserver，不需要引入重型动画依赖。
- 问卷页落地时，保留独立路由体验，不把问卷嵌入首页。
- 结果页落地时，不展示原始分数；四象限图可显示象限发展阶段、状态和相对强弱，但避免让用户理解为绝对评分。
- 结果页的“下载完整报告”“保存卡片”“复制结果链接”目前是视觉占位，真实产品中需要接入现有分享卡片和链接逻辑。
