import { renderSectionInstance } from "@/templates/render-section";
import type { PageConfig } from "@/templates/schema";

type ProductConfig = Extract<PageConfig, { templateId: "product-page" }>;

export function ProductPageTemplate({ config }: { config: ProductConfig }) {
  return (
    <main className="h3-page-template h3-page-template--product" data-page-template="product-page">
      {config.sections.map(renderSectionInstance)}
    </main>
  );
}
