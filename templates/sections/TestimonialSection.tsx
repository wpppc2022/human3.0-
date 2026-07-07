import { Human3Card } from "@/components/human3/Human3Card";
import type { TestimonialSectionProps } from "@/templates/schema";
import { SectionHeading } from "@/templates/sections/SectionHeading";

export function TestimonialSection({
  heading,
  items,
}: TestimonialSectionProps) {
  return (
    <section className="h3-page-section h3-section-surface">
      <div className="h3-page-shell">
        <SectionHeading {...heading} />
        <div className="h3-testimonial-grid">
          {items.map((item) => (
            <Human3Card
              description={`“${item.quote}”`}
              eyebrow={item.context}
              footer={<span className="h3-card-signature">{item.author}</span>}
              key={item.id}
              title={item.author}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
