"use client";

import { ANSWER_OPTIONS } from "@/lib/constants";
import type { AnswerValue, Question } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: Question;
  selected?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
}) {
  return (
    <section aria-labelledby={question.id} className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-normal text-muted-foreground">
          {question.quadrant} · {question.dimension}
        </p>
        <h1 id={question.id} className="text-2xl font-semibold leading-10">
          {question.text}
        </h1>
      </div>
      <div className="grid gap-3" role="radiogroup" aria-labelledby={question.id}>
        {ANSWER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex min-h-12 items-center justify-between rounded-md border bg-card px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected === option.value
                ? "border-primary bg-secondary text-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            <span>{option.label}</span>
            <span className="font-mono text-xs">{option.value}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
