import { assertNever, validatePageConfig } from "@/templates/guards";
import { BlogDetailTemplate } from "@/templates/pages/BlogDetailTemplate";
import { BlogListTemplate } from "@/templates/pages/BlogListTemplate";
import { LandingPageTemplate } from "@/templates/pages/LandingPageTemplate";
import { MarketingPageTemplate } from "@/templates/pages/MarketingPageTemplate";
import { ProductPageTemplate } from "@/templates/pages/ProductPageTemplate";
import type { PageConfig } from "@/templates/schema";

export class TemplateConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemplateConfigError";
  }
}

export function TemplatePageRenderer({ config }: { config: PageConfig }) {
  if (config.sections.length === 0) {
    return (
      <main className="h3-page-template h3-template-render-state">
        <p>当前页面配置没有 Section。</p>
      </main>
    );
  }

  const validation = validatePageConfig(config);
  if (!validation.valid) {
    throw new TemplateConfigError(
      validation.issues
        .map((issue) => `${issue.path} [${issue.code}] ${issue.message}`)
        .join("\n"),
    );
  }

  switch (config.templateId) {
    case "landing-page":
      return <LandingPageTemplate config={config} />;
    case "marketing-page":
      return <MarketingPageTemplate config={config} />;
    case "blog-list-page":
      return <BlogListTemplate config={config} />;
    case "blog-detail-page":
      return <BlogDetailTemplate config={config} />;
    case "product-page":
      return <ProductPageTemplate config={config} />;
    default:
      return assertNever(config);
  }
}
