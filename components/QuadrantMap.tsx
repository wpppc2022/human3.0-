import type { BuiltResult } from "@/lib/types";

export function QuadrantMap({ result }: { result: BuiltResult }) {
  return (
    <section id="dimensions" className="space-y-8 border-b border-white/10 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs text-white/42">DIMENSIONS</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white">
            四象限状态
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-white/52">
          这里只展示当前状态和单象限层级说明，避免把结果误读成数字排名。
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {result.quadrantReports.map((report, index) => (
          <article
            key={report.quadrant.id}
            className="grid min-h-72 border border-white/12 bg-white/[0.025] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-white/38">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-normal text-white">
                  {report.quadrant.englishName}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  {report.quadrant.name}
                </p>
              </div>
              <span className="rounded-full border border-white/14 px-3 py-1 text-xs text-white/66">
                {report.stateLabel}
              </span>
            </div>
            <div className="mt-8 space-y-4">
              <div className="border border-white/10 bg-black p-4">
                <p className="font-mono text-xs text-white/40">象限发展阶段</p>
                <p className="mt-2 text-base font-medium text-white">
                  {report.development.stage} · {report.development.label}
                </p>
              </div>
              <p className="text-sm leading-7 text-white/62">
                {report.stateMeaning}
              </p>
              <p className="text-sm leading-7 text-white/52">
                {report.development.description}
              </p>
              <p className="text-sm leading-7 text-white/52">{report.impact}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
