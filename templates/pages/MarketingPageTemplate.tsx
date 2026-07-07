import { renderSectionInstance } from "@/templates/render-section";
import type { PageConfig } from "@/templates/schema";

type MarketingConfig = Extract<PageConfig, { templateId: "marketing-page" }>;

export function MarketingPageTemplate({ config }: { config: MarketingConfig }) {
  return (
    <main className="h3-page-template h3-page-template--marketing" data-page-template="marketing-page">
      {config.sections.map(renderSectionInstance)}
    </main>
  );
}
