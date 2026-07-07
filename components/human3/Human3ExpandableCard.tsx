"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { useHuman3CarouselExpansion } from "@/components/human3/Human3Carousel";
import { Human3IconButton } from "@/components/human3/Human3IconButton";
import { cn } from "@/lib/utils";

type Human3ExpandableCardProps = {
  title: ReactNode;
  summary: ReactNode;
  details: ReactNode;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
};

export function Human3ExpandableCard({
  className,
  defaultExpanded = false,
  details,
  eyebrow,
  icon,
  summary,
  title,
}: Human3ExpandableCardProps) {
  const reactId = useId();
  const cardId = `h3-card-${reactId.replaceAll(":", "")}`;
  const detailId = `${cardId}-details`;
  const carousel = useHuman3CarouselExpansion();
  const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
  const didInitialize = useRef(false);
  const expanded = carousel
    ? carousel.expandedId === cardId
    : localExpanded;
  const contentWarning =
    typeof details === "string" && details.length > 110 ? "true" : undefined;

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;
    if (carousel && defaultExpanded) carousel.setExpandedId(cardId);
  }, [cardId, carousel, defaultExpanded]);

  const toggle = () => {
    if (carousel) {
      carousel.setExpandedId(expanded ? null : cardId);
      return;
    }
    setLocalExpanded((current) => !current);
  };

  return (
    <article
      className={cn("h3-card h3-card--expandable", className)}
      data-content-warning={contentWarning}
      data-expanded={expanded ? "true" : "false"}
    >
      <div className="h3-card__body">
        {icon ? (
          <span aria-hidden="true" className="h3-card__icon">
            {icon}
          </span>
        ) : null}
        {eyebrow ? <span className="h3-card__eyebrow">{eyebrow}</span> : null}
        <h3 className="h3-card__title">{title}</h3>
        <div className="h3-expandable-card__content">
          <div className="h3-card__description h3-expandable-card__summary">
            {summary}
          </div>
          <div
            aria-hidden={!expanded}
            className="h3-card__description h3-expandable-card__detail"
            id={detailId}
          >
            {details}
          </div>
        </div>
        <Human3IconButton
          aria-controls={detailId}
          className="h3-expandable-card__toggle"
          data-card-toggle
          expanded={expanded}
          kind="plus"
          label={expanded ? "收起补充说明" : "展开补充说明"}
          onClick={toggle}
        />
      </div>
    </article>
  );
}
