import * as React from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type Human3IconButtonProps = Omit<
  React.ComponentProps<"button">,
  "children"
> & {
  kind: "plus" | "previous" | "next";
  label: string;
  expanded?: boolean;
};

const icons = {
  plus: Plus,
  previous: ArrowLeft,
  next: ArrowRight,
};

export function Human3IconButton({
  className,
  expanded,
  kind,
  label,
  type = "button",
  ...props
}: Human3IconButtonProps) {
  const Icon = icons[kind];

  return (
    <button
      aria-expanded={kind === "plus" ? expanded : undefined}
      aria-label={label}
      className={cn(
        "h3-icon-button",
        kind === "plus" && "h3-icon-button--plus",
        className,
      )}
      type={type}
      {...props}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
