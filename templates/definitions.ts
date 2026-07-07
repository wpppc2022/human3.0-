import {
  TEMPLATE_SCHEMA_VERSION,
  type PageTemplateDefinition,
  type SectionInstanceConfig,
  type SectionPolicy,
  type SectionTemplateDefinition,
} from "@/templates/schema";

const allSections = [
  "hero",
  "feature-grid",
  "pricing",
  "faq",
  "testimonial",
  "cta",
  "rich-text",
] as const;

const defaultHero = {
  eyebrow: "HUMAN 3.0 TEMPLATE",
  title: "用配置替换内容，而不是复制页面代码。",
  description: "该默认内容仅用于模板预览，可由 JSON 或未来 CMS 配置完整替换。",
  align: "left",
  actions: [
    {
      id: "hero-primary",
      label: "查看模板",
      destination: { kind: "anchor", id: "template-content" },
      variant: "primary",
    },
  ],
} as const;

const defaultHeroSection = {
  id: "default-hero",
  templateId: "hero",
  props: defaultHero,
} as const satisfies SectionInstanceConfig;

const defaultFeatureGrid = {
  heading: {
    eyebrow: "FEATURE GRID",
    title: "可组合的内容模块",
    description: "标题、说明、图标与动作全部来自配置。",
  },
  density: "comfortable",
  items: [
    {
      id: "default-feature-1",
      icon: "layers",
      eyebrow: "01",
      title: "稳定结构",
      description: "模板控制结构，配置控制内容。",
    },
    {
      id: "default-feature-2",
      icon: "waypoints",
      eyebrow: "02",
      title: "受控组合",
      description: "Section 顺序由页面配置显式声明。",
    },
    {
      id: "default-feature-3",
      icon: "target",
      eyebrow: "03",
      title: "清晰边界",
      description: "未知字段和非法配置不会被静默接受。",
    },
  ],
} as const;

const defaultPricing = {
  heading: { title: "方案示例", description: "价格和功能仅为模板默认配置。" },
  plans: [
    {
      id: "default-plan",
      name: "基础方案",
      price: "¥0",
      description: "用于本地模板预览。",
      features: ["配置驱动", "响应式布局"],
      featured: false,
      action: {
        id: "default-plan-action",
        label: "了解方案",
        destination: { kind: "anchor", id: "template-content" },
        variant: "primary",
      },
    },
  ],
} as const;

const defaultFAQ = {
  heading: { title: "常见问题" },
  items: [
    {
      id: "default-faq",
      question: "模板内容可以替换吗？",
      answer: "可以。正式内容全部从 JSON 可序列化配置注入。",
    },
  ],
} as const;

const defaultTestimonial = {
  heading: { title: "使用反馈" },
  items: [
    {
      id: "default-testimonial",
      quote: "同一模板可以稳定承载不同内容配置。",
      author: "内部模板验收",
      context: "Development preview",
    },
  ],
} as const;

const defaultCTA = {
  eyebrow: "NEXT STEP",
  title: "从一个受控配置开始。",
  description: "先验证结构，再接入未来 CMS 或只读 API。",
  actions: [
    {
      id: "default-cta",
      label: "返回模板库",
      destination: { kind: "route", path: "/debug/template-gallery" },
      variant: "primary",
    },
  ],
} as const;

const defaultRichText = {
  heading: { title: "受控富文本" },
  blocks: [
    {
      id: "default-rich-paragraph",
      type: "paragraph",
      text: "v1 只支持显式的标题、段落、引用与列表，不接受任意 HTML 或 MDX。",
    },
  ],
} as const;

const policies = {
  landing: {
    allowed: ["hero", "feature-grid", "testimonial", "faq", "cta"],
    minSections: 1,
    maxSections: 10,
  },
  marketing: {
    allowed: ["hero", "feature-grid", "pricing", "testimonial", "faq", "cta", "rich-text"],
    minSections: 1,
    maxSections: 14,
  },
  blogList: {
    allowed: ["hero", "feature-grid", "cta"],
    minSections: 1,
    maxSections: 8,
  },
  blogDetail: {
    allowed: ["hero", "rich-text", "cta"],
    minSections: 1,
    maxSections: 12,
  },
  product: {
    allowed: ["hero", "feature-grid", "pricing", "testimonial", "faq", "cta"],
    minSections: 1,
    maxSections: 12,
  },
} as const satisfies { readonly [key: string]: SectionPolicy };

function pageDefinition(
  definition: PageTemplateDefinition,
): PageTemplateDefinition {
  return definition;
}

export const pageTemplateDefinitions = [
  pageDefinition({
    id: "landing-page",
    metadataId: "landing-page",
    name: "Landing Page",
    description: "单一目标的落地页结构。",
    type: "page",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultSections: [defaultHeroSection],
    sectionPolicy: policies.landing,
    defaultProps: {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "default-landing",
      title: "Default Landing",
      locale: "zh-CN",
      templateId: "landing-page",
      pageKind: "landing",
      sections: [defaultHeroSection],
    },
  }),
  pageDefinition({
    id: "marketing-page",
    metadataId: "marketing-page",
    name: "Marketing Page",
    description: "多模块内容叙事结构。",
    type: "page",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultSections: [defaultHeroSection],
    sectionPolicy: policies.marketing,
    defaultProps: {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "default-marketing",
      title: "Default Marketing",
      locale: "zh-CN",
      templateId: "marketing-page",
      pageKind: "marketing",
      sections: [defaultHeroSection],
    },
  }),
  pageDefinition({
    id: "blog-list-page",
    metadataId: "blog-list-page",
    name: "Blog List",
    description: "文章索引页面结构。",
    type: "page",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultSections: [defaultHeroSection],
    sectionPolicy: policies.blogList,
    defaultProps: {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "default-blog-list",
      title: "Default Blog List",
      locale: "zh-CN",
      templateId: "blog-list-page",
      pageKind: "blog-list",
      sections: [defaultHeroSection],
    },
  }),
  pageDefinition({
    id: "blog-detail-page",
    metadataId: "blog-detail-page",
    name: "Blog Detail",
    description: "长文阅读页面结构。",
    type: "page",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultSections: [defaultHeroSection],
    sectionPolicy: policies.blogDetail,
    defaultProps: {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "default-blog-detail",
      title: "Default Blog Detail",
      locale: "zh-CN",
      templateId: "blog-detail-page",
      pageKind: "blog-detail",
      sections: [defaultHeroSection],
    },
  }),
  pageDefinition({
    id: "product-page",
    metadataId: "product-page",
    name: "Product Page",
    description: "产品能力与方案页面结构。",
    type: "page",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultSections: [defaultHeroSection],
    sectionPolicy: policies.product,
    defaultProps: {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "default-product",
      title: "Default Product",
      locale: "zh-CN",
      templateId: "product-page",
      pageKind: "product",
      sections: [defaultHeroSection],
    },
  }),
] as const;

function sectionDefinition(
  definition: SectionTemplateDefinition,
): SectionTemplateDefinition {
  return definition;
}

export const sectionTemplateDefinitions = [
  sectionDefinition({
    id: "hero",
    metadataId: "hero",
    name: "Hero Section",
    description: "标题、说明、动作与可选视觉。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultHero,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "feature-grid",
    metadataId: "feature-grid",
    name: "Feature Grid",
    description: "重复内容卡片与能力说明。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultFeatureGrid,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "pricing",
    metadataId: "pricing",
    name: "Pricing",
    description: "方案比较与行动入口。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultPricing,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "faq",
    metadataId: "faq",
    name: "FAQ",
    description: "可展开的常见问题。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultFAQ,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "testimonial",
    metadataId: "testimonial",
    name: "Testimonial",
    description: "引用与场景证明。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultTestimonial,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "cta",
    metadataId: "cta",
    name: "CTA",
    description: "单一目标的页面收束。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultCTA,
    sectionPolicy: null,
  }),
  sectionDefinition({
    id: "rich-text",
    metadataId: "rich-text",
    name: "Rich Text",
    description: "受控的文章内容块。",
    type: "section",
    schemaVersion: TEMPLATE_SCHEMA_VERSION,
    templateVersion: "1.0.0",
    defaultProps: defaultRichText,
    sectionPolicy: null,
  }),
] as const;

export const allSectionTemplateIds = allSections;

export function findPageTemplateDefinition(id: string) {
  return pageTemplateDefinitions.find((definition) => definition.id === id);
}

export function findSectionTemplateDefinition(id: string) {
  return sectionTemplateDefinitions.find((definition) => definition.id === id);
}
