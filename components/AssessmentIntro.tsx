import Link from "next/link";
import { ArrowRight, Brain, BriefcaseBusiness, HeartPulse, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_SUBTITLE } from "@/lib/constants";
import type { QuadrantDefinition, SiteContent } from "@/lib/types";

const icons = {
  mind: Brain,
  body: HeartPulse,
  spirit: Sparkles,
  vocation: BriefcaseBusiness,
} as const;

const trustItems = ["48 道题", "约 5-8 分钟", "无需登录", "结果不显示原始分数"];

export function AssessmentIntro({
  content,
  quadrants,
}: {
  content: SiteContent;
  quadrants: QuadrantDefinition[];
}) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 sm:px-8 lg:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground">
            {content.badge}
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {SITE_SUBTITLE}
            </p>
          </div>
          <p className="max-w-2xl leading-8 text-foreground/80">
            {content.intro}
          </p>
          <div className="flex flex-wrap gap-2" aria-label="评估说明">
            {trustItems.map((item) => (
              <span
                key={item}
                className="rounded-full border bg-card px-3 py-1 text-sm text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 px-5">
              <Link href="/assessment">
                开始评估
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <p className="text-sm leading-6 text-muted-foreground">
              答题进度会保存在当前浏览器，可中途刷新后继续。
            </p>
          </div>
        </div>

        <Card className="border-primary/20 bg-card">
          <CardHeader>
            <CardTitle className="text-lg">{content.outcomes.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            {content.outcomes.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-4">
        {quadrants.map((quadrant) => {
          const Icon = icons[quadrant.id];
          return (
            <Card key={quadrant.id} className="bg-card">
              <CardHeader className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">
                  {quadrant.englishName} / {quadrant.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-muted-foreground">
                {quadrant.description}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-12 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {content.resultPreview.title}
          </h2>
          <p className="leading-7 text-muted-foreground">
            {content.resultPreview.example}
          </p>
        </div>
        <Card className="bg-card">
          <CardContent className="pt-6 leading-8 text-foreground/80">
            {content.resultPreview.description}
          </CardContent>
        </Card>
      </section>

      <p className="mt-10 max-w-3xl text-sm leading-7 text-muted-foreground">
        {content.disclaimer}
      </p>
    </main>
  );
}
