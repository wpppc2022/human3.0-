import { readFileSync } from "node:fs";

const expectedQuadrants = ["mind", "body", "spirit", "vocation"];
const expectedStages = [
  "1.1",
  "1.2",
  "1.3",
  "2.1",
  "2.2",
  "2.3",
  "3.1",
  "3.2",
  "3.3",
];
const questionFields = [
  "dimension",
  "id",
  "quadrant",
  "reverseScored",
  "text",
];
const stageFields = [
  "code",
  "coreState",
  "description",
  "id",
  "level",
  "levelName",
  "name",
  "phase",
  "phaseName",
];
const quadrantFields = [
  "description",
  "englishName",
  "id",
  "measures",
  "name",
];
const recommendationFields = [
  "immediateAction",
  "ninetyDays",
  "quadrant",
  "sevenDays",
  "thirtyDays",
];
const templateFields = [
  "coreProblem",
  "crossQuadrantDynamics",
  "keywords",
  "lifestyleArchetype",
  "metatype",
  "stage",
  "summary",
  "titlePattern",
];
const siteContentFields = [
  "badge",
  "disclaimer",
  "intro",
  "outcomes",
  "resultPreview",
];
const levelByStagePrefix = {
  1: "1.0",
  2: "2.0",
  3: "3.0",
};
const questionPrefixByQuadrant = {
  mind: "M",
  body: "B",
  spirit: "S",
  vocation: "V",
};
const bannedTerms = ["MBTI", "Myers-Briggs", "16 型人格", "16型人格"];

function readJson(path) {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sameSet(actual, expected) {
  return (
    actual.length === expected.length &&
    actual.every((item, index) => item === expected[index])
  );
}

function assertFields(object, expectedFields, label) {
  const fields = Object.keys(object).sort();
  assert(
    sameSet(fields, expectedFields),
    `${label} has invalid fields: ${fields.join(", ")}`,
  );
}

function assertString(value, label) {
  assert(typeof value === "string" && value.trim().length > 0, `${label} must be a non-empty string.`);
}

function assertStringArray(value, label, minLength = 1) {
  assert(Array.isArray(value), `${label} must be an array.`);
  assert(value.length >= minLength, `${label} must contain at least ${minLength} item(s).`);
  for (const [index, item] of value.entries()) {
    assertString(item, `${label}[${index}]`);
  }
}

function assertUnique(values, label) {
  const seen = new Set();
  for (const value of values) {
    assert(!seen.has(value), `${label} contains duplicate value: ${value}`);
    seen.add(value);
  }
}

function assertNoBannedTerms(value, label) {
  if (typeof value === "string") {
    for (const term of bannedTerms) {
      assert(!value.includes(term), `${label} contains banned term: ${term}`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoBannedTerms(item, `${label}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      assertNoBannedTerms(item, `${label}.${key}`);
    }
  }
}

function assertTemplatePlaceholders(text, requiredPlaceholders, label) {
  for (const placeholder of requiredPlaceholders) {
    assert(text.includes(placeholder), `${label} must include ${placeholder}.`);
  }
}

const questions = readJson("data/questions.json");
const stages = readJson("data/stages.json");
const quadrants = readJson("data/quadrants.json");
const recommendations = readJson("data/recommendations.json");
const resultTemplates = readJson("data/result-templates.json");
const siteContent = readJson("data/site-content.json");

assert(Array.isArray(questions), "questions.json must be an array.");
assert(questions.length === 48, "questions.json must contain exactly 48 questions.");
assertUnique(questions.map((question) => question.id), "questions.json ids");

for (const question of questions) {
  assertFields(question, questionFields, `Question ${question.id ?? "(missing id)"}`);
  assert(expectedQuadrants.includes(question.quadrant), `Invalid quadrant: ${question.quadrant}`);
  assertString(question.id, "Question id");
  assertString(question.dimension, `Question ${question.id}.dimension`);
  assertString(question.text, `Question ${question.id}.text`);
  assert(typeof question.reverseScored === "boolean", `Question ${question.id} reverseScored must be boolean.`);
  assert(
    question.id.startsWith(questionPrefixByQuadrant[question.quadrant]),
    `Question ${question.id} id prefix must match ${question.quadrant}.`,
  );
  assert(
    /^[MBSV]\d{2}$/.test(question.id),
    `Question ${question.id} must use one letter plus two digits, like M01.`,
  );
}

const counts = Object.fromEntries(expectedQuadrants.map((quadrant) => [quadrant, 0]));
const reverseCounts = Object.fromEntries(expectedQuadrants.map((quadrant) => [quadrant, 0]));

for (const question of questions) {
  counts[question.quadrant] += 1;
  if (question.reverseScored) reverseCounts[question.quadrant] += 1;
}

for (const quadrant of expectedQuadrants) {
  assert(counts[quadrant] === 12, `${quadrant} must have exactly 12 questions.`);
  assert(reverseCounts[quadrant] > 0, `${quadrant} must have at least one reverse-scored question.`);
}

assert(Array.isArray(stages), "stages.json must be an array.");
const stageIds = stages.map((stage) => stage.id).sort();
assert(sameSet(stageIds, expectedStages), "stages.json must cover Human 1.1 through Human 3.3.");
assertUnique(stageIds, "stages.json ids");

for (const stage of stages) {
  assertFields(stage, stageFields, `Stage ${stage.id ?? "(missing id)"}`);
  assert(expectedStages.includes(stage.id), `Stage ${stage.id} is not a supported Human stage.`);
  assert(stage.code === `Human ${stage.id}`, `Stage ${stage.id}.code must be Human ${stage.id}.`);
  assert(stage.level === levelByStagePrefix[stage.id[0]], `Stage ${stage.id}.level does not match its id.`);
  assert(stage.phase === stage.id[2], `Stage ${stage.id}.phase does not match its id.`);
  for (const key of ["name", "phaseName", "levelName", "coreState", "description"]) {
    assertString(stage[key], `Stage ${stage.id}.${key}`);
  }
}

assert(Array.isArray(resultTemplates), "result-templates.json must be an array.");
const templateStages = resultTemplates.map((template) => template.stage).sort();
assert(
  sameSet(templateStages, expectedStages),
  "result-templates.json must cover Human 1.1 through Human 3.3.",
);
assertUnique(templateStages, "result-templates.json stages");

for (const template of resultTemplates) {
  assertFields(template, templateFields, `Template ${template.stage ?? "(missing stage)"}`);
  for (const key of [
    "titlePattern",
    "metatype",
    "lifestyleArchetype",
    "summary",
    "coreProblem",
    "crossQuadrantDynamics",
  ]) {
    assert(
      typeof template[key] === "string" && template[key].length > 0,
      `Template ${template.stage}.${key} is required.`,
    );
  }
  assertTemplatePlaceholders(template.titlePattern, ["{dominant}"], `Template ${template.stage}.titlePattern`);
  assertTemplatePlaceholders(
    template.crossQuadrantDynamics,
    ["{dominant}", "{weak}"],
    `Template ${template.stage}.crossQuadrantDynamics`,
  );
  assert(
    Array.isArray(template.keywords) && template.keywords.length === 3,
    `Template ${template.stage}.keywords must contain exactly 3 keywords for the share card.`,
  );
  assertStringArray(template.keywords, `Template ${template.stage}.keywords`, 3);
}

assert(Array.isArray(quadrants), "quadrants.json must be an array.");
const quadrantIds = quadrants.map((quadrant) => quadrant.id).sort();
assert(
  sameSet(quadrantIds, [...expectedQuadrants].sort()),
  "quadrants.json must cover mind, body, spirit, and vocation.",
);
assertUnique(quadrantIds, "quadrants.json ids");

for (const quadrant of quadrants) {
  assertFields(quadrant, quadrantFields, `Quadrant ${quadrant.id ?? "(missing id)"}`);
  assert(expectedQuadrants.includes(quadrant.id), `Quadrant ${quadrant.id} is not supported.`);
  assertString(quadrant.name, `Quadrant ${quadrant.id}.name`);
  assertString(quadrant.englishName, `Quadrant ${quadrant.id}.englishName`);
  assertString(quadrant.description, `Quadrant ${quadrant.id}.description`);
  assertStringArray(quadrant.measures, `Quadrant ${quadrant.id}.measures`, 4);
}

assert(Array.isArray(recommendations), "recommendations.json must be an array.");
const recommendationQuadrants = recommendations
  .map((recommendation) => recommendation.quadrant)
  .sort();
assert(
  sameSet(recommendationQuadrants, [...expectedQuadrants].sort()),
  "recommendations.json must include one set per quadrant.",
);
assertUnique(recommendationQuadrants, "recommendations.json quadrants");

for (const recommendation of recommendations) {
  assertFields(recommendation, recommendationFields, `Recommendation ${recommendation.quadrant ?? "(missing quadrant)"}`);
  assert(expectedQuadrants.includes(recommendation.quadrant), `Recommendation ${recommendation.quadrant} is not supported.`);
  assert(
    typeof recommendation.immediateAction === "string" &&
      recommendation.immediateAction.length > 0,
    `${recommendation.quadrant}.immediateAction is required.`,
  );
  for (const key of ["sevenDays", "thirtyDays", "ninetyDays"]) {
    assert(
      Array.isArray(recommendation[key]) && recommendation[key].length === 3,
      `${recommendation.quadrant}.${key} must contain exactly three recommendations.`,
    );
    assertStringArray(recommendation[key], `${recommendation.quadrant}.${key}`, 3);
  }
}

assertFields(siteContent, siteContentFields, "site-content");
assert(typeof siteContent.badge === "string" && siteContent.badge.length > 0, "site-content.badge is required.");
assert(typeof siteContent.intro === "string" && siteContent.intro.length > 0, "site-content.intro is required.");
assert(
  typeof siteContent.resultPreview?.title === "string" &&
    typeof siteContent.resultPreview?.example === "string" &&
    typeof siteContent.resultPreview?.description === "string",
  "site-content.resultPreview must include title, example, and description.",
);
assert(
  typeof siteContent.outcomes?.title === "string" &&
    Array.isArray(siteContent.outcomes?.items) &&
    siteContent.outcomes.items.length > 0,
  "site-content.outcomes must include title and items.",
);
assert(typeof siteContent.disclaimer === "string" && siteContent.disclaimer.length > 0, "site-content.disclaimer is required.");
assertNoBannedTerms({ questions, stages, quadrants, recommendations, resultTemplates, siteContent }, "data");

console.log("Data validation passed.");
