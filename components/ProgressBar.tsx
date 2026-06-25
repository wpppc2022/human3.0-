"use client";

export function ProgressBar({ value }: { value: number }) {
  const activeSegments = Math.max(1, Math.ceil((value / 100) * 12));

  return (
    <div aria-label="答题进度" className="space-y-3">
      <div className="grid grid-cols-12 gap-1.5" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={
              index < activeSegments
                ? "h-0.5 bg-white"
                : "h-0.5 bg-white/18"
            }
          />
        ))}
      </div>
      <span className="sr-only">当前进度 {Math.round(value)}%</span>
    </div>
  );
}
