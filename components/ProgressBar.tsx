"use client";

import { Progress } from "@/components/ui/progress";

export function ProgressBar({ value }: { value: number }) {
  return (
    <div aria-label="答题进度" className="space-y-2">
      <Progress value={value} />
      <span className="sr-only">当前进度 {Math.round(value)}%</span>
    </div>
  );
}
