import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

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
  "chineseName",
  "coreProblem",
  "crossQuadrantDynamics",
  "friendPerspective",
  "keywords",
  "lifestyleArchetype",
  "metatype",
  "shareInsight",
  "stage",
  "summary",
  "titlePattern",
];
const friendPerspectiveFields = [
  "collaborationTip",
  "conversationStarter",
  "impression",
  "misunderstoodAs",
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
const bannedTerms = [
  "M" + "BTI",
  ["My", "ers"].join("") + "-" + ["Bri", "ggs"].join(""),
  `16 ${"型"}人格`,
  `16${"型"}人格`,
];
const contentFiles = [
  "README.md",
  "docs/CONTENT_REVIEW.md",
  "docs/DATA_SCHEMA.md",
  "docs/HANDOFF.md",
  "docs/MOBILE_QA_CHECKLIST.md",
  "docs/MOBILE_QA_REPORT.md",
  "docs/MODEL.md",
  "docs/PRD.md",
  "docs/PRODUCT.md",
  "docs/QUESTION_BANK_SCORING_TABLE.md",
  "docs/RELEASE_1_0.md",
  "docs/REMOTE_CI_STATUS.md",
  "docs/SCORING_CALIBRATION.md",
  "docs/SCORING_RULES.md",
  "docs/TECHNICAL_ARCHITECTURE.md",
  "docs/TODO.md",
  "docs/USER_FEEDBACK_PLAN.md",
];

function readJson(path) {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
}

function readText(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
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
const assessmentVersions = readJson("data/assessment-versions.json");
const candidateQuestionSet = readJson(
  "data/assessment-versions/h3-a32-v1.questions.draft.json",
);
const resultV1CompatibilityFixture = readJson(
  "tests/fixtures/h3-result-v1-core-snapshot.json",
);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function canonicalResourceHash(value) {
  return `sha256:${createHash("sha256")
    .update(JSON.stringify(canonicalize(value)))
    .digest("hex")}`;
}

function questionSetHash(questionSet) {
  const canonical = JSON.stringify(
    questionSet.map(({ id, quadrant, dimension, text, reverseScored }) => ({
      id,
      quadrant,
      dimension,
      text,
      reverseScored,
    })),
  );
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
}

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

assert(
  assessmentVersions.contentSchemaVersion === "h3-content-schema-v1",
  "assessment version manifest must use h3-content-schema-v1.",
);
assert(
  assessmentVersions.defaultAssessmentVersion === "h3-a48-v1",
  "h3-a48-v1 must remain the production default.",
);
assert(
  Array.isArray(assessmentVersions.assessments) &&
    assessmentVersions.assessments.length === 2,
  "assessment version manifest must contain the stable 48 and draft 32 versions.",
);
assertUnique(
  assessmentVersions.assessments.map((version) => version.id),
  "assessment version manifest ids",
);

const stableAssessment = assessmentVersions.assessments.find(
  (version) => version.id === "h3-a48-v1",
);
const candidateAssessment = assessmentVersions.assessments.find(
  (version) => version.id === "h3-a32-v1",
);
assert(stableAssessment, "h3-a48-v1 must exist in the assessment manifest.");
assert(candidateAssessment, "h3-a32-v1 must exist in the assessment manifest.");
assert(stableAssessment.status === "stable", "h3-a48-v1 must remain stable.");
assert(stableAssessment.questionCount === 48, "h3-a48-v1 must contain 48 questions.");
assert(stableAssessment.questionSource === "data/questions.json", "h3-a48-v1 must bind data/questions.json.");
assert(stableAssessment.resultVersion === "h3-result-v1", "h3-a48-v1 must bind h3-result-v1.");
assert(stableAssessment.allowNewSessions === true, "h3-a48-v1 must allow new sessions.");
assert(stableAssessment.allowPublicQuestions === true, "h3-a48-v1 questions must remain public.");
assert(stableAssessment.allowPublicScoring === true, "h3-a48-v1 scoring must remain public.");
assert(stableAssessment.allowPublicShare === true, "h3-a48-v1 sharing must remain public.");
assert(
  stableAssessment.questionSetHash === questionSetHash(questions),
  "h3-a48-v1 question content or order changed without a new version.",
);

assert(candidateAssessment.status === "draft", "h3-a32-v1 must remain draft.");
assert(candidateAssessment.calibrationStatus === "not-started", "h3-a32-v1 calibration must remain not-started.");
assert(candidateAssessment.questionCount === 32, "h3-a32-v1 must contain 32 questions.");
assert(candidateAssessment.questionSetHash === null, "h3-a32-v1 hash must remain unfrozen before interviews.");
assert(candidateAssessment.resultVersion === "h3-result-v2", "h3-a32-v1 must bind the draft h3-result-v2.");
assert(candidateAssessment.equivalentScoreMultiplier === 1.5, "h3-a32-v1 must use E_q = 1.5 * S_q.");
assert(candidateAssessment.allowNewSessions === false, "h3-a32-v1 cannot allow public new sessions.");
assert(candidateAssessment.allowPublicQuestions === false, "h3-a32-v1 questions cannot be public.");
assert(candidateAssessment.allowPublicScoring === false, "h3-a32-v1 scoring cannot be public.");
assert(candidateAssessment.allowPublicShare === false, "h3-a32-v1 sharing cannot be public.");

assert(candidateQuestionSet.assessmentVersion === "h3-a32-v1", "candidate resource version mismatch.");
assert(candidateQuestionSet.status === "draft", "candidate question resource must remain draft.");
assert(candidateQuestionSet.calibrationStatus === "not-started", "candidate question resource calibration must remain not-started.");
assert(candidateQuestionSet.questionSetHash === null, "candidate question resource hash must remain unfrozen.");
assertString(candidateQuestionSet.contentNotice, "candidate question contentNotice");
assert(Array.isArray(candidateQuestionSet.questions), "candidate questions must be an array.");
assert(candidateQuestionSet.questions.length === 32, "candidate question resource must contain exactly 32 questions.");
assertUnique(candidateQuestionSet.questions.map((question) => question.id), "candidate question ids");

const candidateCounts = Object.fromEntries(expectedQuadrants.map((quadrant) => [quadrant, 0]));
const candidateReverseCounts = Object.fromEntries(expectedQuadrants.map((quadrant) => [quadrant, 0]));
for (const question of candidateQuestionSet.questions) {
  assertFields(question, questionFields, `Candidate question ${question.id ?? "(missing id)"}`);
  assert(expectedQuadrants.includes(question.quadrant), `Invalid candidate quadrant: ${question.quadrant}`);
  assert(/^[MBSV]-C\d{2}$/.test(question.id), `Candidate question ${question.id} must use the working draft ID format M-C01.`);
  assert(question.id.startsWith(questionPrefixByQuadrant[question.quadrant]), `Candidate question ${question.id} id prefix mismatch.`);
  assertString(question.dimension, `Candidate question ${question.id}.dimension`);
  assertString(question.text, `Candidate question ${question.id}.text`);
  assert(typeof question.reverseScored === "boolean", `Candidate question ${question.id} reverseScored must be boolean.`);
  candidateCounts[question.quadrant] += 1;
  if (question.reverseScored) candidateReverseCounts[question.quadrant] += 1;
}
for (const quadrant of expectedQuadrants) {
  assert(candidateCounts[quadrant] === 8, `${quadrant} candidate must have exactly 8 questions.`);
  assert(candidateReverseCounts[quadrant] === 2, `${quadrant} candidate must have exactly 2 reverse-scored questions.`);
}
assert(
  sameSet(
    candidateQuestionSet.questions
      .filter((question) => question.reverseScored)
      .map((question) => question.id),
    ["M-C04", "M-C05", "B-C04", "B-C06", "S-C04", "S-C07", "V-C04", "V-C06"],
  ),
  "candidate reverse-scored question IDs must match the signed content specification.",
);
for (const [quadrant, dimension] of Object.entries({
  mind: "emotional-awareness",
  body: "body-awareness",
  spirit: "connection",
  vocation: "resources",
})) {
  assert(
    candidateQuestionSet.questions.some(
      (question) =>
        question.quadrant === quadrant &&
        question.dimension === dimension &&
        question.reverseScored === false,
    ),
    `${quadrant} candidate must include the signed positive new construct ${dimension}.`,
  );
}

assert(Array.isArray(assessmentVersions.results), "result version manifest must be an array.");
const resultV1 = assessmentVersions.results.find((version) => version.id === "h3-result-v1");
const resultV2 = assessmentVersions.results.find((version) => version.id === "h3-result-v2");
assert(resultV1?.status === "frozen" && resultV1.public === true, "h3-result-v1 must remain frozen and public.");
assert(resultV2?.status === "draft" && resultV2.public === false, "h3-result-v2 must remain a private draft.");
for (const [key, expected] of Object.entries({
  stages: { source: "data/stages.json", value: stages },
  quadrants: { source: "data/quadrants.json", value: quadrants },
  resultTemplates: {
    source: "data/result-templates.json",
    value: resultTemplates,
  },
  recommendations: {
    source: "data/recommendations.json",
    value: recommendations,
  },
})) {
  const frozen = resultV1.resourceHashes?.[key];
  assert(frozen?.source === expected.source, `h3-result-v1 ${key} source mismatch.`);
  assert(
    frozen?.hash === canonicalResourceHash(expected.value),
    `h3-result-v1 ${key} changed without a new result version.`,
  );
}
assert(
  resultV1.compatibilityFixture?.source ===
    "tests/fixtures/h3-result-v1-core-snapshot.json",
  "h3-result-v1 compatibility fixture source mismatch.",
);
assert(
  resultV1.compatibilityFixture?.hash ===
    canonicalResourceHash(resultV1CompatibilityFixture),
  "h3-result-v1 compatibility fixture changed without a manifest update.",
);
assert(
  resultV2.resourceHashes === null &&
    resultV2.compatibilityFixture === null,
  "h3-result-v2 must not claim frozen resources or a compatibility fixture.",
);

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
    "chineseName",
    "lifestyleArchetype",
    "summary",
    "coreProblem",
    "crossQuadrantDynamics",
    "shareInsight",
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
  assertFields(
    template.friendPerspective,
    friendPerspectiveFields,
    `Template ${template.stage}.friendPerspective`,
  );
  for (const key of friendPerspectiveFields) {
    assertString(
      template.friendPerspective[key],
      `Template ${template.stage}.friendPerspective.${key}`,
    );
  }
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

for (const file of contentFiles) {
  assertNoBannedTerms(readText(file), file);
}

console.log("Data validation passed.");
