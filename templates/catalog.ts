import {
  DESIGN_SYSTEM_VERSION,
  TEMPLATE_SCHEMA_VERSION,
  type TemplateMetadata,
  type TemplateMetadataFilter,
} from "@/templates/schema";

const common = {
  configSchemaVersion: TEMPLATE_SCHEMA_VERSION,
  designSystemVersion: DESIGN_SYSTEM_VERSION,
  supportedLocales: ["zh-CN"],
  templateVersion: "1.0.0",
  updatedAt: "2026-07-04",
} as const;

export const templateMetadataCatalog = [
  {
    ...common,
    id: "landing-page",
    name: "Landing Page",
    description: "单一目标、清晰叙事与行动入口的页面结构。",
    type: "page",
    category: "conversion",
    status: "ready",
    pageKinds: ["landing"],
    tags: ["landing", "conversion"],
    searchKeywords: ["落地页", "转化", "行动"],
    recommendedFor: ["评估入口", "活动专题"],
    thumbnail: "/images/human3-template-demo-levels.png",
    sectionTypes: ["hero", "feature-grid", "testimonial", "faq", "cta"],
    capabilities: ["responsive", "config-driven"],
    featured: true,
    sortOrder: 10,
    variantCount: 1,
  },
  {
    ...common,
    id: "marketing-page",
    name: "Marketing Page",
    description: "适合完整内容叙事与多模块组合的通用页面结构。",
    type: "page",
    category: "marketing",
    status: "ready",
    pageKinds: ["marketing"],
    tags: ["marketing", "narrative"],
    searchKeywords: ["营销", "叙事", "卡片"],
    recommendedFor: ["成长层级", "知识到技能"],
    thumbnail: "/images/human3-template-demo-transformation.png",
    previewPath: "/debug/template-examples/marketing-levels",
    sectionTypes: ["hero", "feature-grid", "testimonial", "faq", "cta"],
    capabilities: ["responsive", "config-driven", "variants"],
    featured: true,
    sortOrder: 20,
    variantCount: 2,
  },
  {
    ...common,
    id: "blog-list-page",
    name: "Blog List",
    description: "面向文章索引与主题入口的内容列表结构。",
    type: "page",
    category: "content",
    status: "draft",
    pageKinds: ["blog-list"],
    tags: ["blog", "content"],
    searchKeywords: ["文章", "列表", "内容"],
    recommendedFor: ["内容中心"],
    sectionTypes: ["hero", "feature-grid", "cta"],
    capabilities: ["responsive", "config-driven"],
    featured: false,
    sortOrder: 30,
    variantCount: 1,
  },
  {
    ...common,
    id: "blog-detail-page",
    name: "Blog Detail",
    description: "长文阅读、引用与行动收束的文章详情结构。",
    type: "page",
    category: "content",
    status: "draft",
    pageKinds: ["blog-detail"],
    tags: ["blog", "article"],
    searchKeywords: ["长文", "详情", "阅读"],
    recommendedFor: ["模型说明", "方法文章"],
    sectionTypes: ["hero", "rich-text", "cta"],
    capabilities: ["responsive", "rich-text"],
    featured: false,
    sortOrder: 40,
    variantCount: 1,
  },
  {
    ...common,
    id: "product-page",
    name: "Product Page",
    description: "产品价值、能力清单、证明与行动入口的结构。",
    type: "page",
    category: "commerce",
    status: "ready",
    pageKinds: ["product"],
    tags: ["product", "offer"],
    searchKeywords: ["产品", "服务", "价格"],
    recommendedFor: ["报告产品", "服务介绍"],
    thumbnail: "/images/human3-template-demo-product.png",
    previewPath: "/debug/template-examples/product-report",
    sectionTypes: ["hero", "feature-grid", "pricing", "testimonial", "faq", "cta"],
    capabilities: ["responsive", "pricing"],
    featured: true,
    sortOrder: 50,
    variantCount: 1,
  },
  ...([
    ["hero", "Hero Section", "标题、说明、动作与可选视觉。", "narrative", 110],
    ["feature-grid", "Feature Grid", "重复内容卡片与能力说明。", "content", 120],
    ["pricing", "Pricing", "克制的方案比较与行动入口。", "commerce", 130],
    ["faq", "FAQ", "可展开的常见问题列表。", "content", 140],
    ["testimonial", "Testimonial", "引用、作者与场景证明。", "content", 150],
    ["cta", "CTA", "单一目标的页面收束模块。", "conversion", 160],
    ["rich-text", "Rich Text", "受控 heading、paragraph、quote 与 list。", "content", 170],
  ] as const).map(([id, name, description, category, sortOrder]) => ({
    ...common,
    id,
    name,
    description,
    type: "section" as const,
    category,
    status: "ready" as const,
    pageKinds: ["landing", "marketing", "blog-list", "blog-detail", "product"] as const,
    tags: [id, "section"],
    searchKeywords: [name, description],
    recommendedFor: ["页面组合"],
    sectionTypes: [id],
    capabilities: ["responsive", "config-driven"],
    featured: false,
    sortOrder,
    variantCount: 1,
  })),
] as const satisfies readonly TemplateMetadata[];

function stableSort(items: readonly TemplateMetadata[]) {
  return [...items].sort(
    (left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
  );
}

export function listTemplateMetadata() {
  return stableSort(templateMetadataCatalog);
}

export function findTemplateMetadata(id: string) {
  return templateMetadataCatalog.find((item) => item.id === id);
}

export function getTemplateMetadata(id: string) {
  const metadata = findTemplateMetadata(id);
  if (!metadata) throw new Error(`Unknown template metadata: ${id}`);
  return metadata;
}

export function filterTemplateMetadata(filter: TemplateMetadataFilter) {
  const query = filter.query?.trim().toLocaleLowerCase("zh-CN");
  return stableSort(
    templateMetadataCatalog.filter((item) => {
      if (filter.type && item.type !== filter.type) return false;
      if (filter.category && item.category !== filter.category) return false;
      if (!query) return true;
      return [
        item.name,
        item.description,
        item.id,
        ...item.tags,
        ...item.searchKeywords,
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN")
        .includes(query);
    }),
  );
}
