import { Human3Button } from "@/components/human3/Human3Button";
import { Human3Card } from "@/components/human3/Human3Card";
import { actionDestinationToHref } from "@/templates/action-link";
import { TemplateIcon } from "@/templates/icon-map";
import type { FeatureGridSectionProps } from "@/templates/schema";
import { SectionHeading } from "@/templates/sections/SectionHeading";

export function FeatureGridSection({
  density,
  heading,
  items,
}: FeatureGridSectionProps) {
  return (
    <section className="h3-page-section h3-section-surface" data-density={density}>
      <div className="h3-page-shell">
        <SectionHeading {...heading} />
        {items.length > 0 ? (
          <div className="h3-feature-grid" id="template-content">
            {items.map((item) => (
              <Human3Card
                description={item.description}
                eyebrow={item.eyebrow}
                footer={
                  item.action ? (
                    <Human3Button asChild compact variant={item.action.variant}>
                      <a href={actionDestinationToHref(item.action.destination)}>
                        {item.action.label}
                      </a>
                    </Human3Button>
                  ) : undefined
                }
                icon={item.icon ? <TemplateIcon name={item.icon} /> : undefined}
                key={item.id}
                title={item.title}
              />
            ))}
          </div>
        ) : (
          <p className="h3-template-empty">当前配置没有 Feature 项。</p>
        )}
      </div>
    </section>
  );
}
