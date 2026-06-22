import type { QuadrantId, QuadrantStateId } from "@/lib/types";

export const SITE_NAME = "Human 3.0 自我发展评估";
export const SITE_SUBTITLE =
  "看见你当前的人生系统：认知、身体、意义与事业如何协同运转。";

export const ASSESSMENT_STORAGE_KEY = "human-3-assessment-progress";
export const RESULT_STORAGE_KEY = "human-3-assessment-result";

export const QUADRANT_ORDER: QuadrantId[] = [
  "mind",
  "body",
  "spirit",
  "vocation",
];

export const ANSWER_OPTIONS = [
  { value: 1, label: "非常不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "不确定" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "非常符合" },
] as const;

export const QUADRANT_STATE_LABELS: Record<QuadrantStateId, string> = {
  unstable: "尚未稳定",
  forming: "正在形成",
  grounded: "已有基础",
  mature: "相对成熟",
};

export const QUADRANT_STATE_MEANINGS: Record<QuadrantStateId, string> = {
  unstable: "这个象限还没有形成可靠支撑。",
  forming: "这个象限有意识和局部行动，但还不稳定。",
  grounded: "这个象限已经能在多数情况下发挥作用。",
  mature: "这个象限已经成为人生系统中的稳定能力。",
};
