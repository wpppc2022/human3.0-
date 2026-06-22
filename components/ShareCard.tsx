import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BuiltResult } from "@/lib/types";

export function ShareCard({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">分享卡片</h2>
      <Card className="max-w-xl border-primary/20 bg-card">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{result.shareCard.stageCode}</Badge>
            <span className="text-sm text-muted-foreground">
              {result.shareCard.siteName}
            </span>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold">{result.shareCard.title}</h3>
            <p className="leading-8 text-muted-foreground">
              {result.shareCard.oneLiner}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-sm">
              主导象限：{result.shareCard.dominantQuadrant}
            </span>
            {result.shareCard.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
