"use client";

import { Check, Copy, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import questionsData from "@/data/questions.json";
import { buildShareResultPath } from "@/lib/share-link";
import { downloadShareCardImage } from "@/lib/share-card-image";
import type { BuiltResult, Question } from "@/lib/types";

export function ShareCard({ result }: { result: BuiltResult }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const [shareUrl, setShareUrl] = useState("");
  const sharePath = useMemo(
    () => buildShareResultPath(questionsData as Question[], result.answers),
    [result],
  );

  useEffect(() => {
    queueMicrotask(() => {
      setShareUrl(new URL(sharePath, window.location.origin).toString());
    });
  }, [sharePath]);

  function fallbackCopy(url: string) {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy = document.execCommand("copy");
    textarea.remove();
    return didCopy;
  }

  async function copyShareLink() {
    const url = shareUrl || new URL(sharePath, window.location.origin).toString();
    let didCopy = fallbackCopy(url);

    if (!didCopy && window.navigator.clipboard) {
      try {
        await window.navigator.clipboard.writeText(url);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    setCopyState(didCopy ? "copied" : "failed");
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">保存或分享结果</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            下载图片适合发给朋友；复制链接可以让别人打开同一份结果。
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadShareCardImage(result)}
            className="w-full sm:w-auto"
          >
            <Download className="size-4" aria-hidden="true" />
            下载 PNG
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={copyShareLink}
            className="w-full sm:w-auto"
          >
            {copyState === "copied" ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copyState === "copied" ? "已复制" : "复制链接"}
          </Button>
        </div>
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
            <p className="text-sm font-medium text-primary">
              {result.shareCard.chineseName}
            </p>
            <p className="font-mono text-sm text-primary">
              {result.shareCard.metatype}
            </p>
            <h3 className="text-2xl font-semibold">{result.shareCard.title}</h3>
            <p className="leading-8 text-muted-foreground">
              {result.shareCard.insight}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border px-3 py-1 text-sm">
              最强支点：{result.shareCard.dominantQuadrant}
            </span>
            <span className="rounded-full border px-3 py-1 text-sm">
              当前卡点：{result.shareCard.weakQuadrant}
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
      <div className="max-w-xl space-y-2">
        <label
          htmlFor="share-url"
          className="text-sm font-medium text-muted-foreground"
        >
          结果链接
        </label>
        <input
          id="share-url"
          readOnly
          value={shareUrl}
          className="h-11 w-full rounded-md border bg-card px-3 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onFocus={(event) => event.currentTarget.select()}
        />
        {copyState === "failed" ? (
          <p className="text-sm text-muted-foreground">
            自动复制失败，可以手动选中上方链接复制。
          </p>
        ) : null}
      </div>
    </section>
  );
}
