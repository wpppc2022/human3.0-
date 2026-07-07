import { renderSectionInstance } from "@/templates/render-section";
import type { PageConfig } from "@/templates/schema";

type LandingConfig = Extract<PageConfig, { templateId: "landing-page" }>;

export function LandingPageTemplate({ config }: { config: LandingConfig }) {
  return (
    <main className="h3-page-template h3-page-template--landing" data-page-template="landing-page">
      {config.sections.map(renderSectionInstance)}
    </main>
  );
}
