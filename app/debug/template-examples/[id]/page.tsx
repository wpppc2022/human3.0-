import Link from "next/link";

import { findExamplePageConfig } from "@/templates/configs/examples";
import { TemplatePageRenderer } from "@/templates/render-template";

export const metadata = {
  title: "Template Example · Human 3.0",
  robots: { index: false, follow: false },
};

export default async function TemplateExamplePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = findExamplePageConfig(id);

  if (!config) {
    return (
      <main className="h3-template-render-state">
        <p>UNKNOWN TEMPLATE EXAMPLE</p>
        <h1>未找到示例配置：{id}</h1>
        <Link href="/debug/template-gallery">返回 Template Gallery</Link>
      </main>
    );
  }

  return (
    <>
      <div className="h3-template-preview-bar">
        <Link href="/debug/template-gallery">← Gallery</Link>
        <span>{config.templateId} · {config.id}</span>
      </div>
      <TemplatePageRenderer config={config} />
    </>
  );
}
