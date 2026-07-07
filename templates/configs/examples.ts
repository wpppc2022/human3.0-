import {
  TEMPLATE_SCHEMA_VERSION,
  type PageConfig,
} from "@/templates/schema";

export const marketingLevelsConfig = {
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
  id: "marketing-levels",
  title: "Growth Levels",
  locale: "zh-CN",
  templateId: "marketing-page",
  pageKind: "marketing",
  sections: [
    {
      id: "levels-hero",
      templateId: "hero",
      props: {
        eyebrow: "GROWTH LEVELS",
        title: "成长不是更忙，而是更有意识。",
        description: "同一个 Marketing Page Template，通过配置呈现 Human 3.0 三个成长层级。",
        align: "left",
        actions: [
          {
            id: "levels-action",
            label: "查看三个层级",
            destination: { kind: "anchor", id: "template-content" },
            variant: "primary",
          },
        ],
        image: {
          src: "/images/human3-template-demo-levels.png",
          alt: "HUMAN 3.0 成长层级内部模板示例",
          aspect: "wide",
          focalPoint: { x: 0.5, y: 0.5 },
        },
      },
    },
    {
      id: "levels-grid",
      templateId: "feature-grid",
      props: {
        heading: {
          eyebrow: "HUMAN 3.0",
          title: "三个成长层级",
          description: "层级不是排行榜，而是一个人如何组织判断、选择与行动。",
        },
        density: "comfortable",
        items: [
          {
            id: "level-1",
            icon: "circle-dot",
            eyebrow: "LEVEL 1.0",
            title: "按照默认脚本生活",
            description: "更多依赖外部规则、权威、惯性和他人的期待。",
          },
          {
            id: "level-2",
            icon: "git-branch",
            eyebrow: "LEVEL 2.0",
            title: "开始自己选择",
            description: "追求突破、成就和独立判断，并形成自己的路径。",
          },
          {
            id: "level-3",
            icon: "network",
            eyebrow: "LEVEL 3.0",
            title: "设计生活系统",
            description: "整合复杂现实、不同视角与长期行动。",
          },
        ],
      },
    },
    {
      id: "levels-cta",
      templateId: "cta",
      props: {
        eyebrow: "ASSESSMENT",
        title: "看见你当前的人生系统。",
        description: "完成评估，查看认知、身体、意义与事业如何协同运转。",
        actions: [
          {
            id: "levels-cta-action",
            label: "开始评估",
            destination: { kind: "route", path: "/assessment" },
            variant: "primary",
          },
        ],
      },
    },
  ],
} as const satisfies PageConfig;

export const marketingTransformationConfig = {
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
  id: "marketing-transformation",
  title: "Knowledge to Skill",
  locale: "zh-CN",
  templateId: "marketing-page",
  pageKind: "marketing",
  sections: [
    {
      id: "transformation-hero",
      templateId: "hero",
      props: {
        eyebrow: "KNOWLEDGE TO SKILL",
        title: "不要把理解误认为改变。",
        description: "仍使用 marketing-page，只替换密度、内容和视觉配置。",
        align: "left",
        actions: [
          {
            id: "transformation-action",
            label: "查看转化路径",
            destination: { kind: "anchor", id: "template-content" },
            variant: "primary",
          },
        ],
        image: {
          src: "/images/human3-template-demo-transformation.png",
          alt: "HUMAN 3.0 知识到技能内部模板示例",
          aspect: "wide",
        },
      },
    },
    {
      id: "transformation-grid",
      templateId: "feature-grid",
      props: {
        heading: {
          title: "从知道，到稳定做到",
          description: "真正的改变需要经过经验，并最终成为可以重复的技能。",
        },
        density: "compact",
        items: [
          {
            id: "knowledge",
            icon: "book-open",
            eyebrow: "01 / KNOWLEDGE",
            title: "你知道什么",
            description: "你读过、听过、理解过，但它还没有进入行为。",
          },
          {
            id: "experience",
            icon: "route",
            eyebrow: "02 / EXPERIENCE",
            title: "你做过什么",
            description: "你尝试过，也经历过，但还不一定能稳定复现。",
          },
          {
            id: "skill",
            icon: "repeat",
            eyebrow: "03 / SKILL",
            title: "你真正掌握什么",
            description: "你能在现实压力下，持续、稳定、反复做到。",
          },
        ],
      },
    },
  ],
} as const satisfies PageConfig;

export const productReportConfig = {
  schemaVersion: TEMPLATE_SCHEMA_VERSION,
  id: "product-report",
  title: "Human 3.0 Report",
  locale: "zh-CN",
  templateId: "product-page",
  pageKind: "product",
  sections: [
    {
      id: "product-hero",
      templateId: "hero",
      props: {
        eyebrow: "HUMAN 3.0 REPORT",
        title: "一份关于当前人生系统的行动报告。",
        description: "Product Page Template 示例：展示价值、报告组成、方案与常见问题。",
        align: "left",
        actions: [
          {
            id: "product-action",
            label: "开始评估",
            destination: { kind: "route", path: "/assessment" },
            variant: "primary",
          },
        ],
        image: {
          src: "/images/human3-template-demo-product.png",
          alt: "HUMAN 3.0 报告内部模板示例",
          aspect: "portrait",
        },
      },
    },
    {
      id: "product-features",
      templateId: "feature-grid",
      props: {
        heading: { title: "报告包含什么" },
        density: "comfortable",
        items: [
          { id: "stage", icon: "layers", title: "阶段判断", description: "看见当前整体阶段与发展方向。" },
          { id: "quadrants", icon: "network", title: "四象限状态", description: "理解认知、身体、意义与事业的协同关系。" },
          { id: "actions", icon: "target", title: "行动建议", description: "获得 7 天、30 天与 90 天行动路径。" },
        ],
      },
    },
    {
      id: "product-pricing",
      templateId: "pricing",
      props: {
        heading: { title: "当前版本" },
        plans: [
          {
            id: "free-report",
            name: "MVP 报告",
            price: "免费",
            description: "无需登录即可完成一次评估。",
            features: ["48 道题", "四象限状态", "7/30/90 天建议"],
            featured: true,
            action: {
              id: "free-report-action",
              label: "开始评估",
              destination: { kind: "route", path: "/assessment" },
              variant: "primary",
            },
          },
        ],
      },
    },
    {
      id: "product-faq",
      templateId: "faq",
      props: {
        heading: { title: "常见问题" },
        items: [
          { id: "diagnosis", question: "这是心理诊断吗？", answer: "不是。本评估仅用于自我理解和个人发展参考。" },
          { id: "score", question: "结果会显示原始分数吗？", answer: "不会。结果页只展示状态、阶段和行动建议。" },
        ],
      },
    },
  ],
} as const satisfies PageConfig;

export const examplePageConfigs = [
  marketingLevelsConfig,
  marketingTransformationConfig,
  productReportConfig,
] as const satisfies readonly PageConfig[];

export function findExamplePageConfig(id: string) {
  return examplePageConfigs.find((config) => config.id === id);
}
