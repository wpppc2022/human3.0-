import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type Human3ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary";
  compact?: boolean;
};

export function Human3Button({
  asChild = false,
  className,
  compact = false,
  variant = "primary",
  ...props
}: Human3ButtonProps) {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      className={cn(
        "h3-button",
        `h3-button--${variant}`,
        compact && "h3-button--compact",
        className,
      )}
      {...props}
    />
  );
}
