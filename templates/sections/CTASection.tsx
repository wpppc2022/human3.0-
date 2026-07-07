import { Human3Button } from "@/components/human3/Human3Button";
import { actionDestinationToHref } from "@/templates/action-link";
import type { CTASectionProps } from "@/templates/schema";

export function CTASection({
  actions,
  description,
  eyebrow,
  title,
}: CTASectionProps) {
  return (
    <section className="h3-page-section h3-template-cta">
      <div className="h3-page-shell h3-template-cta__inner">
        {eyebrow ? <p className="h3-template-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        <div className="h3-template-actions">
          {actions.map((action) => (
            <Human3Button asChild key={action.id} variant={action.variant}>
              <a href={actionDestinationToHref(action.destination)}>{action.label}</a>
            </Human3Button>
          ))}
        </div>
      </div>
    </section>
  );
}
