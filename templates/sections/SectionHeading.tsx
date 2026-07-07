import type { SectionHeadingConfig } from "@/templates/schema";

export function SectionHeading({
  description,
  eyebrow,
  title,
}: SectionHeadingConfig) {
  return (
    <header className="h3-section-heading">
      {eyebrow ? <p className="h3-section-heading__eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
