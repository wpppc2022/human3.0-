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
    <section aria-labelledby={question.id} className="grid justify-items-center gap-8 text-center">
      <div className="grid justify-items-center gap-4">
        <p className="sr-only">
          {question.quadrant} · {question.dimension}
        </p>
        <h1
          id={question.id}
          className="max-w-2xl text-3xl font-medium leading-tight tracking-normal text-white sm:text-5xl"
        >
          {question.text}
        </h1>
      </div>
      <div
        className="grid w-full max-w-3xl grid-cols-1 gap-0 sm:grid-cols-5 sm:gap-5"
        role="radiogroup"
        aria-labelledby={question.id}
      >
        {ANSWER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected === option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "grid min-h-14 grid-cols-[1fr_auto] items-center gap-3 border-b border-white/10 py-3 text-left text-sm leading-5 text-white/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-h-28 sm:grid-cols-1 sm:justify-items-center sm:border-b-0 sm:px-1 sm:text-center",
              selected === option.value && "text-white",
            )}
          >
            <span
              className={cn(
                "relative order-2 size-6 rounded-full border-2 border-white/28 transition-all sm:order-none",
                selected === option.value &&
                  "border-white shadow-[0_0_0_6px_rgba(255,255,255,0.08)] after:absolute after:inset-1.5 after:rounded-full after:bg-white",
              )}
              aria-hidden="true"
            />
            <span className="order-1 sm:order-none">{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
