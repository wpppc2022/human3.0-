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

const questions = readJson("data/questions.json");
const stages = readJson("data/stages.json");
const quadrants = readJson("data/quadrants.json");
const recommendations = readJson("data/recommendations.json");
readJson("data/result-templates.json");
const siteContent = readJson("data/site-content.json");

assert(Array.isArray(questions), "questions.json must be an array.");
assert(questions.length === 48, "questions.json must contain exactly 48 questions.");

for (const question of questions) {
  const fields = Object.keys(question).sort();
  assert(
    sameSet(fields, questionFields),
    `Question ${question.id ?? "(missing id)"} has invalid fields: ${fields.join(", ")}`,
  );
  assert(expectedQuadrants.includes(question.quadrant), `Invalid quadrant: ${question.quadrant}`);
  assert(typeof question.id === "string" && question.id.length > 0, "Question id is required.");
  assert(typeof question.dimension === "string" && question.dimension.length > 0, `Question ${question.id} needs dimension.`);
  assert(typeof question.text === "string" && question.text.length > 0, `Question ${question.id} needs text.`);
  assert(typeof question.reverseScored === "boolean", `Question ${question.id} reverseScored must be boolean.`);
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

const stageIds = stages.map((stage) => stage.id).sort();
assert(sameSet(stageIds, expectedStages), "stages.json must cover Human 1.1 through Human 3.3.");

const quadrantIds = quadrants.map((quadrant) => quadrant.id).sort();
assert(
  sameSet(quadrantIds, [...expectedQuadrants].sort()),
  "quadrants.json must cover mind, body, spirit, and vocation.",
);

const recommendationQuadrants = recommendations
  .map((recommendation) => recommendation.quadrant)
  .sort();
assert(
  sameSet(recommendationQuadrants, [...expectedQuadrants].sort()),
  "recommendations.json must include one set per quadrant.",
);

for (const recommendation of recommendations) {
  for (const key of ["sevenDays", "thirtyDays", "ninetyDays"]) {
    assert(
      Array.isArray(recommendation[key]) && recommendation[key].length > 0,
      `${recommendation.quadrant}.${key} must contain at least one recommendation.`,
    );
  }
}

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

console.log("Data validation passed.");
