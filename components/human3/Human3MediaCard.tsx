import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Human3MediaCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  media: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  aspect?: "square" | "portrait" | "wide";
};

export function Human3MediaCard({
  aspect = "portrait",
  className,
  description,
  media,
  title,
  ...props
}: Human3MediaCardProps) {
  return (
    <article
      className={cn("h3-card h3-media-card", className)}
      data-aspect={aspect}
      {...props}
    >
      <div className="h3-media-card__media">{media}</div>
      <div className="h3-media-card__content">
        <h3 className="h3-media-card__title">{title}</h3>
        {description ? (
          <div className="h3-media-card__description">{description}</div>
        ) : null}
      </div>
    </article>
  );
}
