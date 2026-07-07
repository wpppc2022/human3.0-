import {
  findPageTemplateDefinition,
  findSectionTemplateDefinition,
} from "@/templates/definitions";
import {
  TEMPLATE_SCHEMA_VERSION,
  ICON_REFS,
  type ActionDestination,
  type PageConfig,
  type SectionInstanceConfig,
  type SectionTemplateId,
  type ValidationIssue,
  type ValidationResult,
} from "@/templates/schema";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function field(value: object, key: string): unknown {
  return Reflect.get(value, key);
}

function addIssue(
  issues: ValidationIssue[],
  path: string,
  code: ValidationIssue["code"],
  message: string,
) {
  issues.push({ path, code, message });
}

function checkKeys(
  value: object,
  allowed: readonly string[],
  path: string,
  issues: ValidationIssue[],
) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      addIssue(issues, `${path}.${key}`, "unknown_field", `未知字段：${key}`);
    }
  }
}

function requireString(
  value: object,
  key: string,
  path: string,
  issues: ValidationIssue[],
) {
  const result = field(value, key);
  if (typeof result !== "string" || result.trim().length === 0) {
    addIssue(issues, `${path}.${key}`, "missing_field", `${key} 必须是非空字符串`);
    return undefined;
  }
  return result;
}

function optionalString(
  value: object,
  key: string,
  path: string,
  issues: ValidationIssue[],
) {
  const result = field(value, key);
  if (result === undefined) return undefined;
  if (typeof result !== "string") {
    addIssue(issues, `${path}.${key}`, "invalid_type", `${key} 必须是字符串`);
    return undefined;
  }
  return result;
}

function validateDestination(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): value is ActionDestination {
  if (!isObject(value)) {
    addIssue(issues, path, "invalid_type", "destination 必须是对象");
    return false;
  }
  const kind = field(value, "kind");
  if (kind === "route") {
    checkKeys(value, ["kind", "path"], path, issues);
    const route = requireString(value, "path", path, issues);
    if (route && (!route.startsWith("/") || route.startsWith("//"))) {
      addIssue(issues, `${path}.path`, "invalid_url", "route 必须是站内绝对路径");
    }
    return true;
  }
  if (kind === "anchor") {
    checkKeys(value, ["kind", "id"], path, issues);
    const id = requireString(value, "id", path, issues);
    if (id && !/^[A-Za-z][\w-]*$/.test(id)) {
      addIssue(issues, `${path}.id`, "invalid_value", "anchor id 格式无效");
    }
    return true;
  }
  if (kind === "url") {
    checkKeys(value, ["kind", "url"], path, issues);
    const url = requireString(value, "url", path, issues);
    if (url) {
      try {
        const parsed = new URL(url);
        if (!(["http:", "https:"] as const).includes(parsed.protocol as "http:" | "https:")) {
          throw new Error("unsupported protocol");
        }
      } catch {
        addIssue(issues, `${path}.url`, "invalid_url", "只允许 http 或 https URL");
      }
    }
    return true;
  }
  addIssue(issues, `${path}.kind`, "invalid_value", "未知 destination kind");
  return false;
}

function validateAction(value: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObject(value)) {
    addIssue(issues, path, "invalid_type", "action 必须是对象");
    return;
  }
  checkKeys(value, ["id", "label", "destination", "variant"], path, issues);
  requireString(value, "id", path, issues);
  requireString(value, "label", path, issues);
  validateDestination(field(value, "destination"), `${path}.destination`, issues);
  if (!(field(value, "variant") === "primary" || field(value, "variant") === "secondary")) {
    addIssue(issues, `${path}.variant`, "invalid_value", "variant 必须是 primary 或 secondary");
  }
}

function validateImage(value: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObject(value)) {
    addIssue(issues, path, "invalid_type", "image 必须是对象");
    return;
  }
  checkKeys(value, ["src", "alt", "aspect", "focalPoint"], path, issues);
  const src = requireString(value, "src", path, issues);
  requireString(value, "alt", path, issues);
  if (src && !(src.startsWith("/") || /^https?:\/\//.test(src))) {
    addIssue(issues, `${path}.src`, "invalid_url", "图片必须是本地路径或 http(s) URL");
  }
  if (!(field(value, "aspect") === "square" || field(value, "aspect") === "portrait" || field(value, "aspect") === "wide")) {
    addIssue(issues, `${path}.aspect`, "invalid_value", "未知图片比例");
  }
  const focal = field(value, "focalPoint");
  if (focal !== undefined) {
    if (!isObject(focal)) {
      addIssue(issues, `${path}.focalPoint`, "invalid_type", "focalPoint 必须是对象");
    } else {
      checkKeys(focal, ["x", "y"], `${path}.focalPoint`, issues);
      for (const axis of ["x", "y"] as const) {
        const coordinate = field(focal, axis);
        if (typeof coordinate !== "number" || coordinate < 0 || coordinate > 1) {
          addIssue(issues, `${path}.focalPoint.${axis}`, "invalid_value", "焦点坐标必须在 0 到 1 之间");
        }
      }
    }
  }
}

function validateHeading(value: unknown, path: string, issues: ValidationIssue[]) {
  if (!isObject(value)) {
    addIssue(issues, path, "invalid_type", "heading 必须是对象");
    return;
  }
  checkKeys(value, ["eyebrow", "title", "description"], path, issues);
  optionalString(value, "eyebrow", path, issues);
  requireString(value, "title", path, issues);
  optionalString(value, "description", path, issues);
}

function validateUniqueIds(values: unknown, path: string, issues: ValidationIssue[]) {
  if (!Array.isArray(values)) {
    addIssue(issues, path, "invalid_type", `${path} 必须是数组`);
    return [];
  }
  const seen = new Set<string>();
  values.forEach((item, index) => {
    if (!isObject(item)) return;
    const id = field(item, "id");
    if (typeof id !== "string" || id.length === 0) return;
    if (seen.has(id)) addIssue(issues, `${path}[${index}].id`, "duplicate_id", `重复 id：${id}`);
    seen.add(id);
  });
  return values;
}

function validateActions(values: unknown, path: string, issues: ValidationIssue[]) {
  const items = validateUniqueIds(values, path, issues);
  items.forEach((item, index) => validateAction(item, `${path}[${index}]`, issues));
}

function validateHero(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["eyebrow", "title", "description", "align", "actions", "image"], path, issues);
  optionalString(value, "eyebrow", path, issues);
  requireString(value, "title", path, issues);
  optionalString(value, "description", path, issues);
  if (!(field(value, "align") === "left" || field(value, "align") === "center")) {
    addIssue(issues, `${path}.align`, "invalid_value", "align 必须是 left 或 center");
  }
  validateActions(field(value, "actions"), `${path}.actions`, issues);
  const image = field(value, "image");
  if (image !== undefined) validateImage(image, `${path}.image`, issues);
}

function validateFeatureGrid(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["heading", "items", "density"], path, issues);
  validateHeading(field(value, "heading"), `${path}.heading`, issues);
  if (!(field(value, "density") === "compact" || field(value, "density") === "comfortable")) {
    addIssue(issues, `${path}.density`, "invalid_value", "未知 density");
  }
  const items = validateUniqueIds(field(value, "items"), `${path}.items`, issues);
  items.forEach((item, index) => {
    const itemPath = `${path}.items[${index}]`;
    if (!isObject(item)) {
      addIssue(issues, itemPath, "invalid_type", "feature item 必须是对象");
      return;
    }
    checkKeys(item, ["id", "icon", "eyebrow", "title", "description", "action"], itemPath, issues);
    requireString(item, "id", itemPath, issues);
    requireString(item, "title", itemPath, issues);
    requireString(item, "description", itemPath, issues);
    optionalString(item, "eyebrow", itemPath, issues);
    const icon = field(item, "icon");
    if (icon !== undefined && !ICON_REFS.includes(icon as (typeof ICON_REFS)[number])) {
      addIssue(issues, `${itemPath}.icon`, "invalid_value", "未知 IconRef");
    }
    const action = field(item, "action");
    if (action !== undefined) validateAction(action, `${itemPath}.action`, issues);
  });
}

function validatePricing(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["heading", "plans"], path, issues);
  validateHeading(field(value, "heading"), `${path}.heading`, issues);
  const plans = validateUniqueIds(field(value, "plans"), `${path}.plans`, issues);
  plans.forEach((plan, index) => {
    const itemPath = `${path}.plans[${index}]`;
    if (!isObject(plan)) return addIssue(issues, itemPath, "invalid_type", "plan 必须是对象");
    checkKeys(plan, ["id", "name", "price", "cadence", "description", "features", "featured", "action"], itemPath, issues);
    ["id", "name", "price", "description"].forEach((key) => requireString(plan, key, itemPath, issues));
    optionalString(plan, "cadence", itemPath, issues);
    if (typeof field(plan, "featured") !== "boolean") addIssue(issues, `${itemPath}.featured`, "invalid_type", "featured 必须是 boolean");
    const features = field(plan, "features");
    if (!Array.isArray(features) || features.some((item) => typeof item !== "string")) addIssue(issues, `${itemPath}.features`, "invalid_type", "features 必须是字符串数组");
    validateAction(field(plan, "action"), `${itemPath}.action`, issues);
  });
}

function validateFAQ(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["heading", "items"], path, issues);
  validateHeading(field(value, "heading"), `${path}.heading`, issues);
  const items = validateUniqueIds(field(value, "items"), `${path}.items`, issues);
  items.forEach((item, index) => {
    const itemPath = `${path}.items[${index}]`;
    if (!isObject(item)) return addIssue(issues, itemPath, "invalid_type", "FAQ item 必须是对象");
    checkKeys(item, ["id", "question", "answer"], itemPath, issues);
    ["id", "question", "answer"].forEach((key) => requireString(item, key, itemPath, issues));
  });
}

function validateTestimonial(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["heading", "items"], path, issues);
  validateHeading(field(value, "heading"), `${path}.heading`, issues);
  const items = validateUniqueIds(field(value, "items"), `${path}.items`, issues);
  items.forEach((item, index) => {
    const itemPath = `${path}.items[${index}]`;
    if (!isObject(item)) return addIssue(issues, itemPath, "invalid_type", "testimonial 必须是对象");
    checkKeys(item, ["id", "quote", "author", "context"], itemPath, issues);
    ["id", "quote", "author"].forEach((key) => requireString(item, key, itemPath, issues));
    optionalString(item, "context", itemPath, issues);
  });
}

function validateCTA(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["eyebrow", "title", "description", "actions"], path, issues);
  optionalString(value, "eyebrow", path, issues);
  requireString(value, "title", path, issues);
  optionalString(value, "description", path, issues);
  validateActions(field(value, "actions"), `${path}.actions`, issues);
}

function validateRichText(value: object, path: string, issues: ValidationIssue[]) {
  checkKeys(value, ["heading", "blocks"], path, issues);
  const heading = field(value, "heading");
  if (heading !== undefined) validateHeading(heading, `${path}.heading`, issues);
  const blocks = validateUniqueIds(field(value, "blocks"), `${path}.blocks`, issues);
  blocks.forEach((block, index) => {
    const blockPath = `${path}.blocks[${index}]`;
    if (!isObject(block)) return addIssue(issues, blockPath, "invalid_type", "rich text block 必须是对象");
    const type = field(block, "type");
    if (type === "heading") {
      checkKeys(block, ["id", "type", "text", "level"], blockPath, issues);
      if (!(field(block, "level") === 2 || field(block, "level") === 3)) addIssue(issues, `${blockPath}.level`, "invalid_value", "heading level 必须是 2 或 3");
    } else if (type === "paragraph") {
      checkKeys(block, ["id", "type", "text"], blockPath, issues);
    } else if (type === "quote") {
      checkKeys(block, ["id", "type", "text", "attribution"], blockPath, issues);
      optionalString(block, "attribution", blockPath, issues);
    } else if (type === "list") {
      checkKeys(block, ["id", "type", "items"], blockPath, issues);
      const listItems = field(block, "items");
      if (!Array.isArray(listItems) || listItems.some((item) => typeof item !== "string")) addIssue(issues, `${blockPath}.items`, "invalid_type", "list items 必须是字符串数组");
    } else {
      addIssue(issues, `${blockPath}.type`, "invalid_value", "未知 rich text block type");
    }
    requireString(block, "id", blockPath, issues);
    if (type !== "list") requireString(block, "text", blockPath, issues);
  });
}

export function validateSectionInstance(
  input: unknown,
  path = "section",
): ValidationResult<SectionInstanceConfig> {
  const issues: ValidationIssue[] = [];
  if (!isObject(input)) {
    return { valid: false, issues: [{ path, code: "invalid_type", message: "section 必须是对象" }] };
  }
  checkKeys(input, ["id", "templateId", "props"], path, issues);
  requireString(input, "id", path, issues);
  const templateId = field(input, "templateId");
  if (typeof templateId !== "string" || !findSectionTemplateDefinition(templateId)) {
    addIssue(issues, `${path}.templateId`, "unknown_template", `未知 Section template：${String(templateId)}`);
    return { valid: false, issues };
  }
  const props = field(input, "props");
  if (!isObject(props)) {
    addIssue(issues, `${path}.props`, "invalid_type", "props 必须是对象");
    return { valid: false, issues };
  }
  switch (templateId as SectionTemplateId) {
    case "hero": validateHero(props, `${path}.props`, issues); break;
    case "feature-grid": validateFeatureGrid(props, `${path}.props`, issues); break;
    case "pricing": validatePricing(props, `${path}.props`, issues); break;
    case "faq": validateFAQ(props, `${path}.props`, issues); break;
    case "testimonial": validateTestimonial(props, `${path}.props`, issues); break;
    case "cta": validateCTA(props, `${path}.props`, issues); break;
    case "rich-text": validateRichText(props, `${path}.props`, issues); break;
  }
  return issues.length === 0
    ? { valid: true, value: input as SectionInstanceConfig, issues: [] }
    : { valid: false, issues };
}

export function validatePageConfig(input: unknown): ValidationResult<PageConfig> {
  const issues: ValidationIssue[] = [];
  if (!isObject(input)) {
    return { valid: false, issues: [{ path: "page", code: "invalid_type", message: "page config 必须是对象" }] };
  }
  checkKeys(input, ["schemaVersion", "id", "title", "locale", "templateId", "pageKind", "sections"], "page", issues);
  requireString(input, "id", "page", issues);
  requireString(input, "title", "page", issues);
  if (field(input, "schemaVersion") !== TEMPLATE_SCHEMA_VERSION) addIssue(issues, "page.schemaVersion", "invalid_value", `schemaVersion 必须是 ${TEMPLATE_SCHEMA_VERSION}`);
  if (field(input, "locale") !== "zh-CN") addIssue(issues, "page.locale", "invalid_value", "当前只支持 zh-CN");
  const templateId = field(input, "templateId");
  const definition = typeof templateId === "string" ? findPageTemplateDefinition(templateId) : undefined;
  if (!definition) addIssue(issues, "page.templateId", "unknown_template", `未知 Page template：${String(templateId)}`);
  const expectedKinds = {
    "landing-page": "landing",
    "marketing-page": "marketing",
    "blog-list-page": "blog-list",
    "blog-detail-page": "blog-detail",
    "product-page": "product",
  } as const;
  if (
    typeof templateId === "string" &&
    templateId in expectedKinds &&
    field(input, "pageKind") !== expectedKinds[templateId as keyof typeof expectedKinds]
  ) {
    addIssue(issues, "page.pageKind", "invalid_value", "pageKind 与 templateId 不匹配");
  }
  const sections = field(input, "sections");
  if (!Array.isArray(sections)) {
    addIssue(issues, "page.sections", "invalid_type", "sections 必须是数组");
  } else {
    const seen = new Set<string>();
    sections.forEach((section, index) => {
      const result = validateSectionInstance(section, `page.sections[${index}]`);
      if (!result.valid) issues.push(...result.issues);
      if (isObject(section)) {
        const id = field(section, "id");
        if (typeof id === "string") {
          if (seen.has(id)) addIssue(issues, `page.sections[${index}].id`, "duplicate_id", `重复 section id：${id}`);
          seen.add(id);
        }
      }
    });
    if (definition) {
      if (sections.length < definition.sectionPolicy.minSections || sections.length > definition.sectionPolicy.maxSections) addIssue(issues, "page.sections", "policy_violation", `section 数量必须在 ${definition.sectionPolicy.minSections}-${definition.sectionPolicy.maxSections} 之间`);
      sections.forEach((section, index) => {
        if (isObject(section)) {
          const id = field(section, "templateId");
          if (typeof id === "string" && !definition.sectionPolicy.allowed.includes(id as SectionTemplateId)) addIssue(issues, `page.sections[${index}].templateId`, "policy_violation", `${definition.id} 不允许 ${id}`);
        }
      });
    }
  }
  return issues.length === 0
    ? { valid: true, value: input as PageConfig, issues: [] }
    : { valid: false, issues };
}

export function assertValidPageConfig(input: unknown): PageConfig {
  const result = validatePageConfig(input);
  if (!result.valid) {
    throw new Error(result.issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n"));
  }
  return result.value;
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled template discriminant: ${JSON.stringify(value)}`);
}
