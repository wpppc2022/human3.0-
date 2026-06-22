import { Card, CardContent } from "@/components/ui/card";
import type { BuiltResult } from "@/lib/types";

const items = [
  { key: "impression", label: "你常给人的感觉" },
  { key: "collaborationTip", label: "和你协作的方式" },
  { key: "misunderstoodAs", label: "你容易被误解为" },
  { key: "conversationStarter", label: "可以问朋友的一句话" },
] as const;

export function FriendPerspective({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">别人眼中的你</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          这部分不是给你贴标签，而是把结果翻译成更容易和朋友讨论的协作视角。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.key} className="bg-card">
            <CardContent className="space-y-2 p-5">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-sm leading-7">
                {result.friendPerspective[item.key]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
