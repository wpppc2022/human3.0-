import type { StageDefinition } from "@/lib/types";

const phaseCopy: Record<string, string> = {
  "1": "失调期",
  "2": "不确定期",
  "3": "发现期",
};

export function formatPhaseLabel(stage: StageDefinition) {
  if (stage.phaseName.includes("/")) return stage.phaseName;
  return `${stage.phaseName} / ${phaseCopy[stage.phase] ?? stage.phase}`;
}
