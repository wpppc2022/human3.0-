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
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
          {result.headline}
        </p>
      </div>
      <Card className="bg-card">
        <CardContent className="space-y-4 pt-6 leading-8">
          <p>{result.summary}</p>
          <p className="text-muted-foreground">{result.primaryBlock}</p>
        </CardContent>
      </Card>
    </section>
  );
}
