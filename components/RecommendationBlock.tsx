import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuiltResult } from "@/lib/types";

const groups = [
  { key: "sevenDays", title: "未来 7 天" },
  { key: "thirtyDays", title: "未来 30 天" },
  { key: "ninetyDays", title: "未来 90 天" },
] as const;

export function RecommendationBlock({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">下一步行动</h2>
      <Card className="border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-base">24 小时内</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">
          {result.recommendations.immediateAction}
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.key} className="bg-card">
            <CardHeader>
              <CardTitle className="text-base">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                {result.recommendations[group.key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
