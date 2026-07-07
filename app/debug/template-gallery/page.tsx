import { ImageOff, Monitor, Smartphone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { GalleryFilters } from "@/components/human3/GalleryFilters";
import { GalleryPreviewShell } from "@/components/human3/GalleryPreviewShell";
import { Human3Button } from "@/components/human3/Human3Button";
import { Human3MediaCard } from "@/components/human3/Human3MediaCard";
import {
  filterTemplateMetadata,
  findTemplateMetadata,
  listTemplateMetadata,
} from "@/templates/catalog";
import type {
  TemplateCategory,
  TemplateMetadata,
  TemplateType,
} from "@/templates/schema";

export const metadata = {
  title: "Template Gallery · Human 3.0",
  robots: { index: false, follow: false },
};

type GallerySearchParams = Promise<{
  type?: string;
  category?: string;
  query?: string;
  preview?: string;
  viewport?: string;
  context?: string;
}>;

const templateTypes: readonly TemplateType[] = ["page", "section"];
const categories: readonly TemplateCategory[] = [
  "narrative",
  "marketing",
  "content",
  "commerce",
  "conversion",
];

function templateCardMedia(item: TemplateMetadata, priority = false) {
  if (item.thumbnail) {
    return (
      <Image
        alt={`${item.name} 内部模板缩略图`}
        fill
        priority={priority}
        sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
        src={item.thumbnail}
      />
    );
  }
  return (
    <div className="h3-gallery-media-fallback">
      <ImageOff aria-hidden="true" />
      <span>Preview unavailable</span>
    </div>
  );
}

function TemplateCard({
  item,
  priority,
  query,
}: {
  item: TemplateMetadata;
  priority: boolean;
  query: string;
}) {
  const detailHref = `${query ? `?${query}&` : "?"}preview=${item.id}`;
  return (
    <li data-template-id={item.id}>
      <Human3MediaCard
        aspect="wide"
        className="h3-gallery-card"
        description={
          <>
            <p className="h3-gallery-card__description">{item.description}</p>
            <dl className="h3-gallery-card__meta">
              <div><dt>Type</dt><dd>{item.type}</dd></div>
              <div><dt>ID</dt><dd><code>{item.id}</code></dd></div>
              <div><dt>Variants</dt><dd>{item.variantCount}</dd></div>
              <div><dt>Compatibility</dt><dd>{item.designSystemVersion} · {item.templateVersion}</dd></div>
              <div><dt>Status</dt><dd>{item.status}</dd></div>
            </dl>
            <Link aria-label={`Preview ${item.name}`} className="h3-gallery-preview-link" href={detailHref}>
              Preview
            </Link>
          </>
        }
        media={templateCardMedia(item, priority)}
        title={item.name}
      />
    </li>
  );
}

function PreviewDetail({
  closeHref,
  item,
  requestedId,
  viewport,
  context,
}: {
  closeHref: string;
  item?: TemplateMetadata;
  requestedId: string;
  viewport: "desktop" | "mobile";
  context: "isolated" | "context";
}) {
  const insertReasonId = "insert-template-reason";
  return (
    <GalleryPreviewShell closeHref={closeHref}>
      <header className="h3-gallery-detail__header">
        <div>
          <p>PREVIEW DETAIL</p>
          <h2>{item?.name ?? "Unknown template"}</h2>
        </div>
        <Link aria-label="关闭模板预览" href={closeHref}><X aria-hidden="true" /></Link>
      </header>
      {item ? (
        <>
          <div className="h3-gallery-preview-modes" aria-label="预览尺寸">
            <Link aria-current={viewport === "desktop"} href={`?preview=${item.id}&viewport=desktop`}><Monitor aria-hidden="true" /> Desktop</Link>
            <Link aria-current={viewport === "mobile"} href={`?preview=${item.id}&viewport=mobile`}><Smartphone aria-hidden="true" /> Mobile</Link>
          </div>
          {item.type === "section" ? (
            <div className="h3-gallery-preview-modes" aria-label="Section 预览上下文">
              <Link aria-current={context === "isolated"} href={`?preview=${item.id}&context=isolated`}>Isolated</Link>
              <Link aria-current={context === "context"} href={`?preview=${item.id}&context=context`}>In context</Link>
            </div>
          ) : null}
          <div className="h3-gallery-detail__media" data-viewport={viewport}>
            {templateCardMedia(item, true)}
          </div>
          <p>{item.description}</p>
          <dl className="h3-gallery-detail__meta">
            <div><dt>Template ID</dt><dd><code>{item.id}</code></dd></div>
            <div><dt>Category</dt><dd>{item.category}</dd></div>
            <div><dt>Version</dt><dd>{item.templateVersion}</dd></div>
            <div><dt>Sections</dt><dd>{item.sectionTypes.join(", ")}</dd></div>
          </dl>
          {item.previewPath ? (
            <Human3Button asChild variant="secondary"><Link href={item.previewPath}>Open live preview</Link></Human3Button>
          ) : (
            <p className="h3-gallery-no-preview">No live preview is registered for this template.</p>
          )}
        </>
      ) : (
        <p className="h3-gallery-no-preview">Unknown ID: <code>{requestedId}</code>. The Gallery will not guess a renderer.</p>
      )}
      <div className="h3-gallery-insert">
        <Human3Button aria-describedby={insertReasonId} disabled>Insert template</Human3Button>
        <p id={insertReasonId}>插入动作已预留接口，本轮未连接编辑器或数据库。</p>
      </div>
    </GalleryPreviewShell>
  );
}

export default async function TemplateGalleryPage({
  searchParams,
}: {
  searchParams: GallerySearchParams;
}) {
  const params = await searchParams;
  const type = templateTypes.includes(params.type as TemplateType)
    ? (params.type as TemplateType)
    : "all";
  const category = categories.includes(params.category as TemplateCategory)
    ? (params.category as TemplateCategory)
    : "all";
  const query = params.query?.trim() ?? "";
  const filtered = filterTemplateMetadata({
    type: type === "all" ? undefined : type,
    category: category === "all" ? undefined : category,
    query: query || undefined,
  });
  const selected = params.preview ? findTemplateMetadata(params.preview) : undefined;
  const preserved = new URLSearchParams();
  if (type !== "all") preserved.set("type", type);
  if (category !== "all") preserved.set("category", category);
  if (query) preserved.set("query", query);
  const closeHref = preserved.size
    ? `/debug/template-gallery?${preserved.toString()}`
    : "/debug/template-gallery";
  const total = listTemplateMetadata().length;

  return (
    <main className="h3-gallery-page">
      <div className="h3-gallery-shell">
        <header className="h3-gallery-header">
          <div>
            <p>DEVELOPMENT TOOL · NOINDEX</p>
            <h1>Template Gallery</h1>
            <span>选择结构并查看配置示例，不进入正式产品导航。</span>
          </div>
          <strong>{total} templates</strong>
        </header>
        <GalleryFilters category={category} query={query} type={type} />
        <div className="h3-gallery-summary">
          <span>{filtered.length} results</span>
          <span>sort: order / name</span>
        </div>
        <div className="h3-gallery-layout" data-detail-open={Boolean(params.preview)}>
          <section aria-label="Template collection" className="h3-gallery-results">
            {total === 0 ? (
              <div className="h3-gallery-empty"><h2>Template library is empty.</h2><p>先注册 metadata，再添加运行时 renderer。</p></div>
            ) : filtered.length === 0 ? (
              <div className="h3-gallery-empty"><h2>No matching templates.</h2><p>筛选条件保留在 URL 中，可清除后继续浏览。</p><Link href="/debug/template-gallery">Clear filters</Link></div>
            ) : (
              <ul className="h3-gallery-grid">
                {filtered.map((item, index) => (
                  <TemplateCard
                    item={item}
                    key={item.id}
                    priority={index < 2}
                    query={preserved.toString()}
                  />
                ))}
              </ul>
            )}
          </section>
          {params.preview ? (
            <PreviewDetail
              closeHref={closeHref}
              item={selected}
              requestedId={params.preview}
              viewport={params.viewport === "mobile" ? "mobile" : "desktop"}
              context={params.context === "context" ? "context" : "isolated"}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
