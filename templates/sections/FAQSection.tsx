import type { FAQSectionProps } from "@/templates/schema";
import { FAQListClient } from "@/templates/sections/FAQListClient";
import { SectionHeading } from "@/templates/sections/SectionHeading";

export function FAQSection({ heading, items }: FAQSectionProps) {
  return (
    <section className="h3-page-section">
      <div className="h3-page-shell h3-narrow-shell">
        <SectionHeading {...heading} />
        <FAQListClient items={items} />
      </div>
    </section>
  );
}
