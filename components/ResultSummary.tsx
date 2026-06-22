import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BuiltResult } from "@/lib/types";

export function ResultSummary({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <Badge variant="secondary" className="w-fit">
          你的 Human 3.0 当前画像
        </Badge>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {result.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="w-fit">{result.shareCard.chineseName}</Badge>
          <p className="font-mono text-sm text-primary">{result.metatype}</p>
        </div>
        <p className="max-w-3xl text-xl leading-8 text-foreground">
          {result.shareInsight}
        </p>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {result.headline}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border bg-card p-4">
          <p className="text-sm text-muted-foreground">主导象限</p>
          <p className="mt-2 font-medium">
            {result.dominantQuadrant.englishName} / {result.dominantQuadrant.name}
          </p>
        </div>
        <div className="rounded-md border bg-card p-4">
          <p className="text-sm text-muted-foreground">主要限制</p>
          <p className="mt-2 font-medium">
            {result.weakQuadrant.englishName} / {result.weakQuadrant.name}
          </p>
        </div>
        <div className="rounded-md border border-primary/30 bg-card p-4">
          <p className="text-sm text-muted-foreground">先做这一步</p>
          <p className="mt-2 text-sm leading-7">
            {result.recommendations.immediateAction}
          </p>
        </div>
      </div>
      <Card className="bg-card">
        <CardContent className="space-y-4 pt-6 leading-8">
          <div className="rounded-md bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Lifestyle Archetype</p>
            <p className="font-medium">{result.lifestyleArchetype}</p>
          </div>
          <p>{result.summary}</p>
          <p className="text-muted-foreground">{result.primaryBlock}</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Core Problem</p>
              <p className="mt-2 text-sm leading-7">{result.coreProblem}</p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                Cross-Quadrant Dynamics
              </p>
              <p className="mt-2 text-sm leading-7">
                {result.crossQuadrantDynamics}
              </p>
            </div>
            <div className="rounded-md border border-primary/30 p-4">
              <p className="text-sm text-muted-foreground">
                Immediate Next Action
              </p>
              <p className="mt-2 text-sm leading-7">
                {result.recommendations.immediateAction}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
