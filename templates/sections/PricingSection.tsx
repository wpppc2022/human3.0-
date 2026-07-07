import { Human3Button } from "@/components/human3/Human3Button";
import { Human3Card } from "@/components/human3/Human3Card";
import { actionDestinationToHref } from "@/templates/action-link";
import type { PricingSectionProps } from "@/templates/schema";
import { SectionHeading } from "@/templates/sections/SectionHeading";

export function PricingSection({ heading, plans }: PricingSectionProps) {
  return (
    <section className="h3-page-section h3-section-surface">
      <div className="h3-page-shell">
        <SectionHeading {...heading} />
        <div className="h3-pricing-grid">
          {plans.map((plan) => (
            <Human3Card
              className={plan.featured ? "h3-card--featured" : undefined}
              description={
                <>
                  <p>{plan.description}</p>
                  <ul className="h3-template-list">
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </>
              }
              eyebrow={plan.name}
              footer={
                <Human3Button asChild variant={plan.action.variant}>
                  <a href={actionDestinationToHref(plan.action.destination)}>
                    {plan.action.label}
                  </a>
                </Human3Button>
              }
              key={plan.id}
              title={
                <>
                  {plan.price}
                  {plan.cadence ? <small>{plan.cadence}</small> : null}
                </>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
