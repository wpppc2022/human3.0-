export type QuadrantId = "mind" | "body" | "spirit" | "vocation";

export type HumanLevel = "1.0" | "2.0" | "3.0";
export type PhaseId = "1" | "2" | "3";

export type HumanStageId =
  | "1.1"
  | "1.2"
  | "1.3"
  | "2.1"
  | "2.2"
  | "2.3"
  | "3.1"
  | "3.2"
  | "3.3";

export type QuadrantStateId =
  | "unstable"
  | "forming"
  | "grounded"
  | "mature";

export type QuadrantDevelopmentStageId = HumanStageId;

export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export type Answers = Record<string, AnswerValue>;

export type AssessmentVersionId = "h3-a48-v1" | "h3-a32-v1";
export type ResultVersionId = "h3-result-v1" | "h3-result-v2";
export type ContentSchemaVersion = "h3-content-schema-v1";
export type AssessmentVersionStatus =
  | "draft"
  | "calibrating"
  | "stable"
  | "retired";
export type AssessmentCalibrationStatus =
  | "legacy-baseline"
  | "not-started"
  | "content-reviewed"
  | "paired-validation"
  | "qualified"
  | "failed-revise";
export type ResultVersionStatus = "draft" | "frozen";
export type AssessmentScoringModel =
  | "raw-12-per-quadrant"
  | "equivalent-12-per-quadrant";

export interface AssessmentVersionDefinition {
  id: AssessmentVersionId;
  status: AssessmentVersionStatus;
  calibrationStatus: AssessmentCalibrationStatus;
  questionCount: number;
  questionSetHash: string | null;
  questionSource: string;
  resultVersion: ResultVersionId;
  scoringModel: AssessmentScoringModel;
  equivalentScoreMultiplier: number;
  allowNewSessions: boolean;
  allowPublicQuestions: boolean;
  allowPublicScoring: boolean;
  allowPublicShare: boolean;
}

export interface ResultVersionDefinition {
  id: ResultVersionId;
  status: ResultVersionStatus;
  assessmentVersions: AssessmentVersionId[];
  public: boolean;
  resourceHashes: ResultResourceHashes | null;
  compatibilityFixture: FrozenResourceReference | null;
}

export interface FrozenResourceReference {
  source: string;
  hash: string;
}

export interface ResultResourceHashes {
  stages: FrozenResourceReference;
  quadrants: FrozenResourceReference;
  resultTemplates: FrozenResourceReference;
  recommendations: FrozenResourceReference;
}

export interface AssessmentVersionManifest {
  contentSchemaVersion: ContentSchemaVersion;
  defaultAssessmentVersion: AssessmentVersionId;
  assessments: AssessmentVersionDefinition[];
  results: ResultVersionDefinition[];
}

export interface Question {
  id: string;
  quadrant: QuadrantId;
  dimension: string;
  text: string;
  reverseScored: boolean;
}

export interface QuadrantDefinition {
  id: QuadrantId;
  name: string;
  englishName: string;
  description: string;
  measures: string[];
}

export interface StageDefinition {
  id: HumanStageId;
  level: HumanLevel;
  phase: PhaseId;
  code: string;
  name: string;
  phaseName: string;
  levelName: string;
  coreState: string;
  description: string;
}

export interface RecommendationSet {
  quadrant: QuadrantId;
  immediateAction: string;
  sevenDays: string[];
  thirtyDays: string[];
  ninetyDays: string[];
}

export interface ResultTemplate {
  stage: HumanStageId;
  titlePattern: string;
  metatype: string;
  chineseName: string;
  lifestyleArchetype: string;
  summary: string;
  coreProblem: string;
  crossQuadrantDynamics: string;
  shareInsight: string;
  friendPerspective: {
    impression: string;
    collaborationTip: string;
    misunderstoodAs: string;
    conversationStarter: string;
  };
  keywords: string[];
}

export interface QuadrantDevelopment {
  level: HumanLevel;
  phase: PhaseId;
  stage: QuadrantDevelopmentStageId;
  label: string;
  description: string;
}

export interface QuadrantScore {
  quadrant: QuadrantId;
  rawScore: number;
  state: QuadrantStateId;
  development: QuadrantDevelopment;
}

export interface ScoreMetrics {
  averageScore: number;
  minScore: number;
  maxScore: number;
  imbalanceScore: number;
  unstableCount: number;
  formingOrBetterCount: number;
  groundedOrBetterCount: number;
  matureCount: number;
}

export interface ScoringResult {
  quadrantScores: Record<QuadrantId, QuadrantScore>;
  level: HumanLevel;
  phase: PhaseId;
  stage: HumanStageId;
  dominantQuadrant: QuadrantId;
  weakQuadrant: QuadrantId;
  imbalanceScore: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
  unstableCount: number;
  formingOrBetterCount: number;
  groundedOrBetterCount: number;
  matureCount: number;
  answeredCount: number;
  missingQuestionIds: string[];
}

export interface CandidateQuadrantScore extends QuadrantScore {
  normalizedTotal: number;
  equivalentScore: number;
}

export interface CandidateScoringResult {
  assessmentVersion: "h3-a32-v1";
  resultVersion: "h3-result-v2";
  assessmentStatus: "draft";
  calibrationStatus: "not-started";
  questionSetHash: null;
  quadrantScores: Record<QuadrantId, CandidateQuadrantScore>;
  level: HumanLevel;
  phase: PhaseId;
  stage: HumanStageId;
  dominantQuadrants: QuadrantId[];
  weakQuadrants: QuadrantId[];
  imbalanceScore: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
  unstableCount: number;
  formingOrBetterCount: number;
  groundedOrBetterCount: number;
  matureCount: number;
  answeredCount: 32;
  missingQuestionIds: [];
}

export interface AssessmentAnswerValidation {
  valid: boolean;
  answers: Answers | null;
  expectedCount: number;
  receivedCount: number;
  missingQuestionIds: string[];
  extraAnswerIds: string[];
  invalidAnswerIds: string[];
}

export interface AssessmentAnswerMismatchDetails {
  expectedCount: number;
  receivedCount: number;
  missingIds: string[];
  extraIds: string[];
  invalidIds: string[];
}

export interface QuadrantReport {
  quadrant: QuadrantDefinition;
  state: QuadrantStateId;
  stateLabel: string;
  stateMeaning: string;
  development: QuadrantDevelopment;
  impact: string;
}

export interface BuiltResult {
  id: string;
  answers: Answers;
  stage: StageDefinition;
  title: string;
  metatype: string;
  lifestyleArchetype: string;
  headline: string;
  summary: string;
  coreProblem: string;
  crossQuadrantDynamics: string;
  shareInsight: string;
  friendPerspective: ResultTemplate["friendPerspective"];
  primaryBlock: string;
  dominantQuadrant: QuadrantDefinition;
  weakQuadrant: QuadrantDefinition;
  quadrantReports: QuadrantReport[];
  recommendations: {
    immediateAction: string;
    sevenDays: string[];
    thirtyDays: string[];
    ninetyDays: string[];
  };
  shareCard: {
    stageCode: HumanStageId;
    title: string;
    chineseName: string;
    metatype: string;
    dominantQuadrant: string;
    weakQuadrant: string;
    insight: string;
    keywords: string[];
    siteName: string;
  };
  scoring: ScoringResult;
}

export interface StoredAssessment {
  answers: Answers;
  currentIndex: number;
  updatedAt: string;
}

export interface StoredResult {
  id: string;
  answers: Answers;
  result: BuiltResult;
  createdAt: string;
}

export interface VersionedStoredAssessment extends StoredAssessment {
  storageSchemaVersion: "h3-storage-v2";
  assessmentVersion: AssessmentVersionId;
  contentSchemaVersion: ContentSchemaVersion;
}

export interface VersionedStoredResult extends StoredResult {
  storageSchemaVersion: "h3-storage-v2";
  assessmentVersion: AssessmentVersionId;
  contentSchemaVersion: ContentSchemaVersion;
  resultVersion: ResultVersionId;
}

export interface SiteContent {
  badge: string;
  intro: string;
  resultPreview: {
    title: string;
    example: string;
    description: string;
  };
  outcomes: {
    title: string;
    items: string[];
  };
  disclaimer: string;
}
