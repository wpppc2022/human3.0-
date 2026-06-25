"use client";

import { Check, Copy, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <section id="share" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs text-white/42">SHARE</p>
          <h2 className="text-3xl font-semibold tracking-normal text-white">
            保存或分享结果
          </h2>
          <p className="text-sm leading-6 text-white/52">
            下载图片适合发给朋友；复制链接可以让别人打开同一份结果。
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => downloadShareCardImage(result)}
            className="w-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black sm:w-auto"
          >
            <Download className="size-4" aria-hidden="true" />
            下载 PNG
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={copyShareLink}
            className="w-full border-white/20 bg-transparent text-white hover:bg-white hover:text-black sm:w-auto"
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_minmax(280px,1fr)]">
        <div className="border border-white/12 bg-white/[0.025] p-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <Badge variant="secondary" className="bg-white text-black">
              {result.shareCard.stageCode}
            </Badge>
            <span className="text-sm text-white/45">{result.shareCard.siteName}</span>
          </div>
          <div className="space-y-4 py-8">
            <p className="text-sm font-medium text-white/62">
              {result.shareCard.chineseName}
            </p>
            <p className="font-mono text-sm text-white/45">
              {result.shareCard.metatype}
            </p>
            <h3 className="text-3xl font-semibold leading-tight tracking-normal text-white">
              {result.shareCard.title}
            </h3>
            <p className="leading-8 text-white/62">{result.shareCard.insight}</p>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <span className="rounded-full border border-white/14 px-3 py-1 text-sm text-white/68">
              最强支点：{result.shareCard.dominantQuadrant}
            </span>
            <span className="rounded-full border border-white/14 px-3 py-1 text-sm text-white/68">
              当前卡点：{result.shareCard.weakQuadrant}
            </span>
            {result.shareCard.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-white/12 px-3 py-1 text-sm text-white/68"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label htmlFor="share-url" className="text-sm font-medium text-white/58">
            结果链接
          </label>
          <input
            id="share-url"
            readOnly
            value={shareUrl}
            className="h-12 w-full border border-white/14 bg-black px-3 text-sm text-white/62 outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            onFocus={(event) => event.currentTarget.select()}
          />
          {copyState === "failed" ? (
            <p className="text-sm text-white/52">
              自动复制失败，可以手动选中上方链接复制。
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
