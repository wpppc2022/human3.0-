import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Human3CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  href?: string;
};

export function Human3Card({
  className,
  description,
  eyebrow,
  footer,
  href,
  icon,
  title,
  ...props
}: Human3CardProps) {
  const content = (
    <div className="h3-card__body">
      {icon ? (
        <span aria-hidden="true" className="h3-card__icon">
          {icon}
        </span>
      ) : null}
      {eyebrow ? <span className="h3-card__eyebrow">{eyebrow}</span> : null}
      <h3 className="h3-card__title">{title}</h3>
      {description ? (
        <div className="h3-card__description">{description}</div>
      ) : null}
      {footer ? <div className="h3-card__footer">{footer}</div> : null}
    </div>
  );

  if (href) {
    return (
      <a
        className={cn("h3-card h3-card--content", className)}
        data-interactive="true"
        href={href}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <article
      className={cn("h3-card h3-card--content", className)}
      {...props}
    >
      {content}
    </article>
  );
}
