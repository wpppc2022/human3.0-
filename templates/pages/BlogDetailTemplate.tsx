import { renderSectionInstance } from "@/templates/render-section";
import type { PageConfig } from "@/templates/schema";

type BlogDetailConfig = Extract<PageConfig, { templateId: "blog-detail-page" }>;

export function BlogDetailTemplate({ config }: { config: BlogDetailConfig }) {
  return (
    <main className="h3-page-template h3-page-template--blog-detail" data-page-template="blog-detail-page">
      <article>{config.sections.map(renderSectionInstance)}</article>
    </main>
  );
}
