import type { BuiltResult } from "@/lib/types";

const groups = [
  { key: "sevenDays", title: "未来 7 天" },
  { key: "thirtyDays", title: "未来 30 天" },
  { key: "ninetyDays", title: "未来 90 天" },
] as const;

function ActionCheck({
  label,
  ariaLabel,
  inverted = false,
}: {
  label: string;
  ariaLabel: string;
  inverted?: boolean;
}) {
  return (
    <label
      className={
        inverted
          ? "grid cursor-pointer grid-cols-[1fr_auto] items-start gap-4 bg-white p-5 text-black"
          : "grid cursor-pointer grid-cols-[1fr_auto] items-center gap-3 border-b border-white/10 py-3 text-sm leading-7 text-white/62"
      }
    >
      <span>{label}</span>
      <input type="checkbox" className="peer sr-only" aria-label={ariaLabel} />
      <span
        aria-hidden="true"
        className={
          inverted
            ? "relative mt-1 size-6 shrink-0 rounded-full border-2 border-black/34 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-black/70 peer-checked:border-black peer-checked:shadow-[0_0_0_6px_rgba(0,0,0,0.08)] after:absolute after:inset-1.5 after:rounded-full after:bg-black after:opacity-0 peer-checked:after:opacity-100"
            : "relative size-6 shrink-0 rounded-full border-2 border-white/28 transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-white/80 peer-checked:border-white peer-checked:shadow-[0_0_0_6px_rgba(255,255,255,0.08)] after:absolute after:inset-1.5 after:rounded-full after:bg-white after:opacity-0 peer-checked:after:opacity-100"
        }
      />
    </label>
  );
}

export function RecommendationBlock({ result }: { result: BuiltResult }) {
  return (
    <section id="next" className="space-y-8 border-b border-white/10 pb-16">
      <div>
        <p className="font-mono text-xs text-white/42">NEXT ACTION</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">
          下一步行动
        </h2>
      </div>

      <div className="border border-white/20">
        <div className="border-b border-black/10 bg-white px-5 pt-5 font-mono text-xs text-black/50">
          24 小时内
        </div>
        <ActionCheck
          label={result.recommendations.immediateAction}
          ariaLabel="24 小时内行动"
          inverted
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <article key={group.key} className="border border-white/12 p-5">
            <h3 className="text-lg font-semibold text-white">{group.title}</h3>
            <div className="mt-5 grid gap-3">
              {result.recommendations[group.key].map((item, index) => (
                <ActionCheck
                  key={item}
                  label={item}
                  ariaLabel={`${group.title}行动 ${index + 1}`}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
