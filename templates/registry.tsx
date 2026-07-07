import type { ComponentType } from "react";

import { getTemplateMetadata } from "@/templates/catalog";
import {
  pageTemplateDefinitions,
  sectionTemplateDefinitions,
} from "@/templates/definitions";
import { BlogDetailTemplate } from "@/templates/pages/BlogDetailTemplate";
import { BlogListTemplate } from "@/templates/pages/BlogListTemplate";
import { LandingPageTemplate } from "@/templates/pages/LandingPageTemplate";
import { MarketingPageTemplate } from "@/templates/pages/MarketingPageTemplate";
import { ProductPageTemplate } from "@/templates/pages/ProductPageTemplate";
import { renderSectionInstance } from "@/templates/render-section";
import type {
  PageConfig,
  PageTemplateDefinition,
  PageTemplateId,
  SectionInstanceConfig,
  SectionTemplateDefinition,
  SectionTemplateId,
  TemplateMetadata,
} from "@/templates/schema";

type PageRuntimeComponent = ComponentType<{ config: PageConfig }>;
type SectionRuntimeComponent = ComponentType<{ section: SectionInstanceConfig }>;

export interface PageTemplateRegistration {
  id: PageTemplateId;
  name: string;
  description: string;
  type: "page";
  component: PageRuntimeComponent;
  defaultProps: PageConfig;
  definition: PageTemplateDefinition;
  metadata: TemplateMetadata;
}

export interface SectionTemplateRegistration {
  id: SectionTemplateId;
  name: string;
  description: string;
  type: "section";
  component: SectionRuntimeComponent;
  defaultProps: SectionTemplateDefinition["defaultProps"];
  definition: SectionTemplateDefinition;
  metadata: TemplateMetadata;
}

export type TemplateRegistration =
  | PageTemplateRegistration
  | SectionTemplateRegistration;

export class UnknownTemplateError extends Error {
  constructor(type: "page" | "section", id: string) {
    super(`Unknown ${type} template: ${id}`);
    this.name = "UnknownTemplateError";
  }
}

function PageRuntime({ config }: { config: PageConfig }) {
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
  }
}

function SectionRuntime({ section }: { section: SectionInstanceConfig }) {
  return renderSectionInstance(section);
}

const pageRegistrations = pageTemplateDefinitions.map((definition) => ({
  id: definition.id,
  name: definition.name,
  description: definition.description,
  type: "page" as const,
  component: PageRuntime,
  defaultProps: definition.defaultProps,
  definition,
  metadata: getTemplateMetadata(definition.metadataId),
})) satisfies readonly PageTemplateRegistration[];

const sectionRegistrations = sectionTemplateDefinitions.map((definition) => ({
  id: definition.id,
  name: definition.name,
  description: definition.description,
  type: "section" as const,
  component: SectionRuntime,
  defaultProps: definition.defaultProps,
  definition,
  metadata: getTemplateMetadata(definition.metadataId),
})) satisfies readonly SectionTemplateRegistration[];

export function assertUniqueTemplateRegistrations(
  registrations: readonly TemplateRegistration[],
) {
  const seen = new Set<string>();
  for (const registration of registrations) {
    const key = `${registration.type}:${registration.id}`;
    if (seen.has(key)) throw new Error(`Duplicate template registration: ${key}`);
    if (registration.definition.id !== registration.id) {
      throw new Error(`Template definition mismatch: ${registration.id}`);
    }
    if (registration.metadata.id !== registration.id) {
      throw new Error(`Template metadata mismatch: ${registration.id}`);
    }
    seen.add(key);
  }
}

assertUniqueTemplateRegistrations([
  ...pageRegistrations,
  ...sectionRegistrations,
]);

export function listPageTemplates() {
  return [...pageRegistrations];
}

export function listSectionTemplates() {
  return [...sectionRegistrations];
}

export function findPageTemplate(id: string) {
  return pageRegistrations.find((registration) => registration.id === id);
}

export function findSectionTemplate(id: string) {
  return sectionRegistrations.find((registration) => registration.id === id);
}

export function getPageTemplate(id: string) {
  const registration = findPageTemplate(id);
  if (!registration) throw new UnknownTemplateError("page", id);
  return registration;
}

export function getSectionTemplate(id: string) {
  const registration = findSectionTemplate(id);
  if (!registration) throw new UnknownTemplateError("section", id);
  return registration;
}
