import type { CSSProperties } from "react";
import {
  CircleDot,
  Image as ImageIcon,
  Network,
  Waypoints,
} from "lucide-react";

import { Human3Button } from "@/components/human3/Human3Button";
import { Human3Card } from "@/components/human3/Human3Card";
import { Human3Carousel } from "@/components/human3/Human3Carousel";
import { Human3ExpandableCard } from "@/components/human3/Human3ExpandableCard";
import { Human3IconButton } from "@/components/human3/Human3IconButton";
import { Human3MediaCard } from "@/components/human3/Human3MediaCard";

export const metadata = {
  title: "Human 3.0 UI 模板预览",
  robots: { index: false, follow: false },
};

const tokens = [
  ["Section", "--h3-section-bg"],
  ["Card", "--h3-card-bg"],
  ["Media", "--h3-media-bg"],
  ["Border", "--h3-border"],
  ["Text", "--h3-text"],
  ["Secondary", "--h3-text-secondary"],
] as const;

export default function Human3TemplatePreviewPage() {
  return (
    <main className="h3-template-section" data-template-page="human3-cards">
      <div className="h3-template-section__inner">
        <header className="h3-template-section__heading">
          <p>DEV TEMPLATE · 不进入正式导航</p>
          <h1>Human 3.0 卡片页面模板</h1>
          <p>
            静态首页和 React 页面共用同一组 token、class 与 data 属性契约。此页只用于开发、验收和新页面组装。
          </p>
        </header>

        <section aria-labelledby="tokens-title">
          <h2 className="sr-only" id="tokens-title">
            设计 token
          </h2>
          <div className="h3-template-token-grid">
            {tokens.map(([label, token]) => (
              <div className="h3-template-token" key={token}>
                <div
                  aria-hidden="true"
                  className="h3-template-token__swatch"
                  style={{ "--token-color": `var(${token})` } as CSSProperties}
                />
                <strong>{label}</strong>
                <br />
                <code>{token}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="h3-template-demo-block" aria-labelledby="content-title">
          <h2 id="content-title">ContentCard</h2>
          <p className="h3-template-demo-note">
            普通展示卡没有 hover；只有语义链接卡或明确的交互卡才提升边框。
          </p>
          <div className="h3-template-grid">
            <Human3Card
              eyebrow="01 / DEFAULT"
              icon={<CircleDot />}
              title="短标题内容卡"
              description="使用固定 8px 圆角、黑色表面与克制边界。"
            />
            <Human3Card
              data-demo-state="hover"
              eyebrow="02 / LINK STATE"
              href="#react-example"
              icon={<Waypoints />}
              title="较长标题会自然换行，不改变卡片系统"
              description="这一张用语义链接展示 hover 状态，不把 div 伪装成按钮。"
            />
            <Human3Card
              eyebrow="03 / FOOTER"
              title="无图标与底部操作"
              description="Footer 始终推到底部，适合需要单一明确动作的重复内容。"
              footer={<Human3Button compact>查看详情</Human3Button>}
            />
          </div>
        </section>

        <section className="h3-template-demo-block" aria-labelledby="media-title">
          <h2 id="media-title">MediaCard</h2>
          <p className="h3-template-demo-note">
            正式页面必须替换为真实素材；此处回退态只用于开发验收，不作为长期内容。
          </p>
          <div className="h3-template-grid">
            <Human3MediaCard
              aspect="square"
              media={
                <div className="h3-template-media-fallback">
                  <div>
                    <Network aria-hidden="true" />
                    1:1 素材槽
                  </div>
                </div>
              }
              title="方形媒体卡"
              description="适用于对象、作品或状态的清晰视觉证据。"
            />
            <Human3MediaCard
              media={
                <div className="h3-template-media-fallback">
                  <div>
                    <ImageIcon aria-hidden="true" />
                    4:5 明确回退态
                  </div>
                </div>
              }
              title="默认纵向媒体卡"
              description="无素材时显示明确回退，不留下无意义的永久占位块。"
            />
          </div>
        </section>

        <section className="h3-template-demo-block" aria-labelledby="expand-title">
          <h2 id="expand-title">ExpandableCard + Carousel</h2>
          <p className="h3-template-demo-note">
            外部尺寸固定，同一轨道最多展开一张；窄屏保留下一张真实可见的提示区域。
          </p>
          <Human3Carousel label="可展开内容卡模板">
            <Human3ExpandableCard
              defaultExpanded
              details="核心状态、常见局限和发展方向在卡片内部切换，不新增嵌套卡片、表单或第二层入口。"
              eyebrow="LEVEL 1.0"
              icon={<CircleDot />}
              summary="默认展开态用于检查详情、加号旋转和固定高度。"
              title="按照默认脚本生活"
            />
            <Human3ExpandableCard
              details="点击后会自动收起同轨道内已经展开的卡片，保证阅读焦点单一，并保持轨道高度稳定。"
              eyebrow="LEVEL 2.0"
              icon={<Waypoints />}
              summary="关闭态保留摘要，操作只由右下角圆形加号触发。"
              title="开始自己选择"
            />
            <Human3ExpandableCard
              details="所有动效在 prefers-reduced-motion 下关闭，键盘焦点、ARIA 状态和触控尺寸保持可用。"
              eyebrow="LEVEL 3.0"
              icon={<Network />}
              summary="末卡完整滚入后仍保留右侧 gutter。"
              title="有意识地设计生活系统"
            />
          </Human3Carousel>
        </section>

        <section className="h3-template-demo-block" aria-labelledby="controls-title">
          <h2 id="controls-title">Controls</h2>
          <div className="h3-template-actions">
            <Human3Button>Primary 48px</Human3Button>
            <Human3Button compact>Compact 44px</Human3Button>
            <Human3Button variant="secondary">Secondary</Human3Button>
            <Human3Button data-demo-focus="true" variant="secondary">
              Focus visible
            </Human3Button>
            <Human3Button disabled>Disabled</Human3Button>
            <Human3IconButton kind="plus" label="展开示例" />
            <Human3IconButton expanded kind="plus" label="收起示例" />
            <Human3IconButton kind="previous" label="上一张" />
            <Human3IconButton kind="next" label="下一张" />
            <Human3IconButton disabled kind="next" label="下一张不可用" />
          </div>
        </section>

        <section
          className="h3-template-demo-block"
          aria-labelledby="rules-title"
          id="react-example"
        >
          <h2 id="rules-title">验收与禁止项</h2>
          <ul className="h3-template-rules">
            <li>
              <strong>键盘与 ARIA：</strong>使用 Tab 检查按钮、轨道和展开状态；控件触控尺寸不低于 44px。
            </li>
            <li>
              <strong>200% 与 reduced motion：</strong>浏览器缩放后文字不截断；系统减少动态时关闭滚动、旋转、淡入与位移。
            </li>
            <li>
              <strong>禁止：</strong>嵌套卡片、渐变、光晕、大圆角、阴影、伪按钮、逐卡 reveal 和离屏透明卡片。
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
