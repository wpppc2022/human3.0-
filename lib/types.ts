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

export type AnswerValue = 1 | 2 | 3 | 4 | 5;

export type Answers = Record<string, AnswerValue>;

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

export interface QuadrantScore {
  quadrant: QuadrantId;
  rawScore: number;
  state: QuadrantStateId;
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
  answeredCount: number;
  missingQuestionIds: string[];
}

export interface QuadrantReport {
  quadrant: QuadrantDefinition;
  state: QuadrantStateId;
  stateLabel: string;
  stateMeaning: string;
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
