"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

type FullDocumentLinkProps = ComponentProps<typeof Link>;

export function FullDocumentLink({ onClick, ...props }: FullDocumentLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.location.assign(event.currentTarget.href);
  }

  return <Link {...props} onClick={handleClick} />;
}
