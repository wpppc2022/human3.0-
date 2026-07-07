import { renderSectionInstance } from "@/templates/render-section";
import type { PageConfig } from "@/templates/schema";

type BlogListConfig = Extract<PageConfig, { templateId: "blog-list-page" }>;

export function BlogListTemplate({ config }: { config: BlogListConfig }) {
  return (
    <main className="h3-page-template h3-page-template--blog-list" data-page-template="blog-list-page">
      {config.sections.map(renderSectionInstance)}
    </main>
  );
}
