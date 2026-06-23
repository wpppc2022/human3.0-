import { Brain, BriefcaseBusiness, HeartPulse, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuiltResult, QuadrantId } from "@/lib/types";

const icons: Record<QuadrantId, typeof Brain> = {
  mind: Brain,
  body: HeartPulse,
  spirit: Sparkles,
  vocation: BriefcaseBusiness,
};

export function QuadrantMap({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">四象限状态</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {result.quadrantReports.map((report) => {
          const Icon = icons[report.quadrant.id];
          return (
            <Card key={report.quadrant.id} className="bg-card">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">
                      {report.quadrant.englishName} / {report.quadrant.name}
                    </CardTitle>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                    {report.stateLabel}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
                <div className="rounded-md border bg-background p-3">
                  <p className="text-xs text-muted-foreground">象限发展阶段</p>
                  <p className="mt-1 font-medium text-foreground">
                    {report.development.stage} · {report.development.label}
                  </p>
                </div>
                <p>{report.stateMeaning}</p>
                <p>{report.development.description}</p>
                <p>{report.impact}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
