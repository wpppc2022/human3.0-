"use client";

import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadShareCardImage } from "@/lib/share-card-image";
import type { BuiltResult } from "@/lib/types";

export function ShareCard({ result }: { result: BuiltResult }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">分享卡片</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => downloadShareCardImage(result)}
        >
          <Download className="size-4" aria-hidden="true" />
          下载 PNG
        </Button>
      </div>
      <Card className="max-w-xl border-primary/20 bg-card">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="secondary">{result.shareCard.stageCode}</Badge>
            <span className="text-sm text-muted-foreground">
              {result.shareCard.siteName}
            </span>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-sm text-primary">
              {result.shareCard.metatype}
            </p>
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
