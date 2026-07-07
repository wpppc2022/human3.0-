import { renderToStaticMarkup } from "react-dom/server";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
  filterTemplateMetadata,
  listTemplateMetadata,
  templateMetadataCatalog,
} from "../templates/catalog";
import {
  marketingLevelsConfig,
  marketingTransformationConfig,
  productReportConfig,
} from "../templates/configs/examples";
import {
  pageTemplateDefinitions,
  sectionTemplateDefinitions,
} from "../templates/definitions";
import { assertNever, validatePageConfig } from "../templates/guards";
import {
  assertUniqueTemplateRegistrations,
  findPageTemplate,
  getPageTemplate,
  listPageTemplates,
  UnknownTemplateError,
} from "../templates/registry";
import { TemplatePageRenderer } from "../templates/render-template";
import {
  TEMPLATE_SCHEMA_VERSION,
  type PageConfig,
} from "../templates/schema";

function containsFunction(value: unknown): boolean {
  if (typeof value === "function") return true;
  if (Array.isArray(value)) return value.some(containsFunction);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(containsFunction);
  }
  return false;
}

describe("template schema and metadata", () => {
  it("round-trips page configs through JSON without changing data", () => {
    for (const config of [
      marketingLevelsConfig,
      marketingTransformationConfig,
      productReportConfig,
    ]) {
      expect(JSON.parse(JSON.stringify(config))).toEqual(config);
      expect(validatePageConfig(config).valid).toBe(true);
    }
  });

  it("keeps metadata JSON-safe and free of components or full defaults", () => {
    expect(containsFunction(templateMetadataCatalog)).toBe(false);
    const serialized = JSON.stringify(templateMetadataCatalog);
    expect(serialized).not.toContain("component");
    expect(serialized).not.toContain("defaultProps");
    expect(JSON.parse(serialized)).toEqual(templateMetadataCatalog);
  });

  it("keeps definitions JSON-safe and gallery isolated from the runtime registry", async () => {
    const definitions = [...pageTemplateDefinitions, ...sectionTemplateDefinitions];
    expect(containsFunction(definitions)).toBe(false);
    expect(JSON.parse(JSON.stringify(definitions))).toEqual(definitions);
    const gallerySource = await readFile(
      new URL("../app/debug/template-gallery/page.tsx", import.meta.url),
      "utf8",
    );
    expect(gallerySource).not.toContain('from "@/templates/registry"');
  });

  it("filters metadata and keeps stable sort order", () => {
    const pages = filterTemplateMetadata({ type: "page" });
    expect(pages).toHaveLength(5);
    expect(pages.map((item) => item.sortOrder)).toEqual(
      [...pages].map((item) => item.sortOrder).sort((left, right) => left - right),
    );
    expect(filterTemplateMetadata({ query: "成长层级" }).map((item) => item.id)).toContain(
      "marketing-page",
    );
    expect(listTemplateMetadata()).toHaveLength(12);
  });
});

describe("template runtime guards", () => {
  it("reports missing fields and wrong discriminants", () => {
    const missingTitle = {
      ...marketingLevelsConfig,
      title: undefined,
    };
    const wrongTemplate = {
      ...marketingLevelsConfig,
      templateId: "unknown-page",
    };
    expect(validatePageConfig(missingTitle)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ path: "page.title", code: "missing_field" }),
      ]),
    });
    expect(validatePageConfig(wrongTemplate)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ path: "page.templateId", code: "unknown_template" }),
      ]),
    });
  });

  it("rejects unknown fields, unsafe URLs, and duplicate IDs", () => {
    const unknownField = {
      ...marketingLevelsConfig,
      customCss: "color:red",
    };
    const unsafeUrl = {
      ...marketingLevelsConfig,
      sections: [
        {
          ...marketingLevelsConfig.sections[0],
          props: {
            ...marketingLevelsConfig.sections[0].props,
            actions: [
              {
                id: "unsafe",
                label: "Unsafe",
                variant: "primary",
                destination: { kind: "url", url: "javascript:alert(1)" },
              },
            ],
          },
        },
      ],
    };
    const duplicateSections = {
      ...marketingLevelsConfig,
      sections: [
        marketingLevelsConfig.sections[0],
        { ...marketingLevelsConfig.sections[1], id: marketingLevelsConfig.sections[0].id },
      ],
    };

    expect(validatePageConfig(unknownField)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ path: "page.customCss", code: "unknown_field" }),
      ]),
    });
    expect(validatePageConfig(unsafeUrl)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: "invalid_url" }),
      ]),
    });
    expect(validatePageConfig(duplicateSections)).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: "duplicate_id" }),
      ]),
    });
  });
});

describe("template registry and renderer", () => {
  it("supports find/get semantics and detects duplicate registrations", () => {
    expect(findPageTemplate("missing-template")).toBeUndefined();
    expect(() => getPageTemplate("missing-template")).toThrow(UnknownTemplateError);
    const first = listPageTemplates()[0];
    expect(() => assertUniqueTemplateRegistrations([first, first])).toThrow(
      "Duplicate template registration",
    );
  });

  it("renders different content from two configs using one page template", () => {
    const levels = renderToStaticMarkup(
      <TemplatePageRenderer config={marketingLevelsConfig} />,
    );
    const transformation = renderToStaticMarkup(
      <TemplatePageRenderer config={marketingTransformationConfig} />,
    );

    expect(levels).toContain('data-page-template="marketing-page"');
    expect(transformation).toContain('data-page-template="marketing-page"');
    expect(levels).toContain("成长不是更忙");
    expect(transformation).toContain("不要把理解误认为改变");
    expect(levels).not.toBe(transformation);
  });

  it("renders an explicit empty state and keeps assertNever defensive", () => {
    const emptyConfig = {
      schemaVersion: TEMPLATE_SCHEMA_VERSION,
      id: "empty",
      title: "Empty",
      locale: "zh-CN",
      templateId: "marketing-page",
      pageKind: "marketing",
      sections: [],
    } as const satisfies PageConfig;
    expect(
      renderToStaticMarkup(<TemplatePageRenderer config={emptyConfig} />),
    ).toContain("当前页面配置没有 Section");
    expect(() => assertNever("future-section" as never)).toThrow(
      "Unhandled template discriminant",
    );
  });
});
