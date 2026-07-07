export const TEMPLATE_SCHEMA_VERSION = "1.0" as const;
export const DESIGN_SYSTEM_VERSION = "human3-v1" as const;

export type TemplateType = "page" | "section";
export type TemplateStatus = "ready" | "draft" | "unknown";
export type TemplateCategory =
  | "narrative"
  | "marketing"
  | "content"
  | "commerce"
  | "conversion";
export type PageKind =
  | "landing"
  | "marketing"
  | "blog-list"
  | "blog-detail"
  | "product";
export type PageTemplateId =
  | "landing-page"
  | "marketing-page"
  | "blog-list-page"
  | "blog-detail-page"
  | "product-page";
export type SectionTemplateId =
  | "hero"
  | "feature-grid"
  | "pricing"
  | "faq"
  | "testimonial"
  | "cta"
  | "rich-text";
export type TemplateId = PageTemplateId | SectionTemplateId;
export type IconRef =
  | "circle-dot"
  | "git-branch"
  | "network"
  | "waypoints"
  | "book-open"
  | "route"
  | "repeat"
  | "layers"
  | "sparkles"
  | "target";

export const ICON_REFS = [
  "circle-dot",
  "git-branch",
  "network",
  "waypoints",
  "book-open",
  "route",
  "repeat",
  "layers",
  "sparkles",
  "target",
] as const satisfies readonly IconRef[];

export type ActionDestination =
  | { kind: "route"; path: string }
  | { kind: "anchor"; id: string }
  | { kind: "url"; url: string };

export interface ActionConfig {
  id: string;
  label: string;
  destination: ActionDestination;
  variant: "primary" | "secondary";
}

export interface ImageConfig {
  src: string;
  alt: string;
  aspect: "square" | "portrait" | "wide";
  focalPoint?: { x: number; y: number };
}

export interface SectionHeadingConfig {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface HeroSectionProps extends SectionHeadingConfig {
  align: "left" | "center";
  actions: readonly ActionConfig[];
  image?: ImageConfig;
}

export interface FeatureItemConfig {
  id: string;
  icon?: IconRef;
  eyebrow?: string;
  title: string;
  description: string;
  action?: ActionConfig;
}

export interface FeatureGridSectionProps {
  heading: SectionHeadingConfig;
  items: readonly FeatureItemConfig[];
  density: "compact" | "comfortable";
}

export interface PricingPlanConfig {
  id: string;
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: readonly string[];
  featured: boolean;
  action: ActionConfig;
}

export interface PricingSectionProps {
  heading: SectionHeadingConfig;
  plans: readonly PricingPlanConfig[];
}

export interface FAQItemConfig {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  heading: SectionHeadingConfig;
  items: readonly FAQItemConfig[];
}

export interface TestimonialItemConfig {
  id: string;
  quote: string;
  author: string;
  context?: string;
}

export interface TestimonialSectionProps {
  heading: SectionHeadingConfig;
  items: readonly TestimonialItemConfig[];
}

export interface CTASectionProps extends SectionHeadingConfig {
  actions: readonly ActionConfig[];
}

export type RichTextBlock =
  | { id: string; type: "heading"; text: string; level: 2 | 3 }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "quote"; text: string; attribution?: string }
  | { id: string; type: "list"; items: readonly string[] };

export interface RichTextSectionProps {
  heading?: SectionHeadingConfig;
  blocks: readonly RichTextBlock[];
}

export type SectionInstanceConfig =
  | { id: string; templateId: "hero"; props: HeroSectionProps }
  | { id: string; templateId: "feature-grid"; props: FeatureGridSectionProps }
  | { id: string; templateId: "pricing"; props: PricingSectionProps }
  | { id: string; templateId: "faq"; props: FAQSectionProps }
  | { id: string; templateId: "testimonial"; props: TestimonialSectionProps }
  | { id: string; templateId: "cta"; props: CTASectionProps }
  | { id: string; templateId: "rich-text"; props: RichTextSectionProps };

interface PageConfigBase {
  schemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  id: string;
  title: string;
  locale: "zh-CN";
  sections: readonly SectionInstanceConfig[];
}

export type PageConfig =
  | (PageConfigBase & { templateId: "landing-page"; pageKind: "landing" })
  | (PageConfigBase & { templateId: "marketing-page"; pageKind: "marketing" })
  | (PageConfigBase & { templateId: "blog-list-page"; pageKind: "blog-list" })
  | (PageConfigBase & { templateId: "blog-detail-page"; pageKind: "blog-detail" })
  | (PageConfigBase & { templateId: "product-page"; pageKind: "product" });

export interface SectionPolicy {
  allowed: readonly SectionTemplateId[];
  minSections: number;
  maxSections: number;
}

export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  type: TemplateType;
  category: TemplateCategory;
  status: TemplateStatus;
  pageKinds: readonly PageKind[];
  tags: readonly string[];
  searchKeywords: readonly string[];
  recommendedFor: readonly string[];
  thumbnail?: string;
  previewPath?: string;
  templateVersion: string;
  configSchemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  designSystemVersion: typeof DESIGN_SYSTEM_VERSION;
  supportedLocales: readonly ["zh-CN"];
  sectionTypes: readonly SectionTemplateId[];
  capabilities: readonly string[];
  featured: boolean;
  sortOrder: number;
  updatedAt: string;
  variantCount: number;
}

interface TemplateDefinitionBase {
  id: TemplateId;
  name: string;
  description: string;
  type: TemplateType;
  metadataId: TemplateId;
  schemaVersion: typeof TEMPLATE_SCHEMA_VERSION;
  templateVersion: string;
}

export interface PageTemplateDefinition extends TemplateDefinitionBase {
  id: PageTemplateId;
  type: "page";
  metadataId: PageTemplateId;
  defaultProps: PageConfig;
  defaultSections: readonly SectionInstanceConfig[];
  sectionPolicy: SectionPolicy;
}

export type SectionDefaultProps =
  | HeroSectionProps
  | FeatureGridSectionProps
  | PricingSectionProps
  | FAQSectionProps
  | TestimonialSectionProps
  | CTASectionProps
  | RichTextSectionProps;

export interface SectionTemplateDefinition extends TemplateDefinitionBase {
  id: SectionTemplateId;
  type: "section";
  metadataId: SectionTemplateId;
  defaultProps: SectionDefaultProps;
  sectionPolicy: null;
}

export type TemplateDefinition =
  | PageTemplateDefinition
  | SectionTemplateDefinition;

export interface TemplateMetadataFilter {
  type?: TemplateType;
  category?: TemplateCategory;
  query?: string;
}

export interface TemplateInsertRequest {
  templateId: TemplateId;
  targetPageId?: string;
  afterSectionId?: string;
}

export type TemplateInsertHandler = (
  request: TemplateInsertRequest,
) => Promise<void>;

export interface ValidationIssue {
  path: string;
  code:
    | "invalid_type"
    | "missing_field"
    | "unknown_field"
    | "invalid_value"
    | "invalid_url"
    | "duplicate_id"
    | "policy_violation"
    | "unknown_template";
  message: string;
}

export type ValidationResult<T> =
  | { valid: true; value: T; issues: readonly [] }
  | { valid: false; issues: readonly ValidationIssue[] };
