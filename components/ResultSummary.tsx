import type { BuiltResult } from "@/lib/types";

export function ResultSummary({ result }: { result: BuiltResult }) {
  return (
    <section className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
      <div className="space-y-6">
        <p className="w-fit border-b border-white/20 pb-2 font-mono text-xs text-white/50">
          你的 Human 3.0 当前画像
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-white sm:text-6xl">
          {result.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/18 px-3 py-1 text-sm text-white">
            {result.shareCard.chineseName}
          </span>
          <span className="font-mono text-sm text-white/52">
            {result.metatype}
          </span>
        </div>
        <p className="max-w-3xl text-2xl leading-10 text-white">
          {result.shareInsight}
        </p>
        <p className="max-w-3xl text-base leading-8 text-white/62">
          {result.headline}
        </p>
      </div>

      <aside className="grid gap-3">
        <div className="border border-white/12 bg-white/[0.025] p-5">
          <p className="font-mono text-xs text-white/42">主导象限</p>
          <p className="mt-3 text-xl font-medium text-white">
            {result.dominantQuadrant.englishName} / {result.dominantQuadrant.name}
          </p>
        </div>
        <div className="border border-white/12 bg-white/[0.025] p-5">
          <p className="font-mono text-xs text-white/42">主要限制</p>
          <p className="mt-3 text-xl font-medium text-white">
            {result.weakQuadrant.englishName} / {result.weakQuadrant.name}
          </p>
        </div>
        <div className="border border-white/20 bg-white text-black p-5">
          <p className="font-mono text-xs text-black/52">先做这一步</p>
          <p className="mt-3 text-sm leading-7">
            {result.recommendations.immediateAction}
          </p>
        </div>
      </aside>

      <div className="space-y-6 lg:col-span-2">
        <div className="grid gap-3 lg:grid-cols-3">
          <article className="border border-white/12 p-5">
            <p className="font-mono text-xs text-white/42">Lifestyle Archetype</p>
            <p className="mt-3 text-lg text-white">{result.lifestyleArchetype}</p>
          </article>
          <article className="border border-white/12 p-5">
            <p className="font-mono text-xs text-white/42">Core Problem</p>
            <p className="mt-3 text-sm leading-7 text-white/64">
              {result.coreProblem}
            </p>
          </article>
          <article className="border border-white/12 p-5">
            <p className="font-mono text-xs text-white/42">
              Immediate Next Action
            </p>
            <p className="mt-3 text-sm leading-7 text-white/64">
              {result.recommendations.immediateAction}
            </p>
          </article>
        </div>
        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="border border-white/12 p-5">
            <p className="font-mono text-xs text-white/42">当前判断</p>
            <p className="mt-3 text-sm leading-7 text-white/66">
              {result.summary}
            </p>
          </article>
          <article className="border border-white/12 p-5">
            <p className="font-mono text-xs text-white/42">
              Cross-Quadrant Dynamics
            </p>
            <p className="mt-3 text-sm leading-7 text-white/66">
              {result.crossQuadrantDynamics}
            </p>
          </article>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-white/52">
          {result.primaryBlock}
        </p>
      </div>
    </section>
  );
}
