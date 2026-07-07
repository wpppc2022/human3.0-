import Image from "next/image";
import type { CSSProperties } from "react";

import { Human3Button } from "@/components/human3/Human3Button";
import { actionDestinationToHref } from "@/templates/action-link";
import type { HeroSectionProps } from "@/templates/schema";

export function HeroSection({
  actions,
  align,
  description,
  eyebrow,
  image,
  title,
}: HeroSectionProps) {
  return (
    <section className="h3-page-section h3-template-hero" data-align={align}>
      <div className="h3-page-shell h3-template-hero__layout">
        <div className="h3-template-hero__copy">
          {eyebrow ? <p className="h3-template-eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {description ? <p className="h3-template-hero__description">{description}</p> : null}
          {actions.length > 0 ? (
            <div className="h3-template-actions">
              {actions.map((action) => (
                <Human3Button asChild key={action.id} variant={action.variant}>
                  <a href={actionDestinationToHref(action.destination)}>{action.label}</a>
                </Human3Button>
              ))}
            </div>
          ) : null}
        </div>
        {image ? (
          <div
            className="h3-template-visual"
            data-aspect={image.aspect}
            style={{
              "--h3-focal-x": `${(image.focalPoint?.x ?? 0.5) * 100}%`,
              "--h3-focal-y": `${(image.focalPoint?.y ?? 0.5) * 100}%`,
            } as CSSProperties}
          >
            <Image
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              src={image.src}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
