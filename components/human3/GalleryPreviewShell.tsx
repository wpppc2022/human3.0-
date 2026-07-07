"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

export function GalleryPreviewShell({
  children,
  closeHref,
}: {
  children: ReactNode;
  closeHref: string;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    dialogRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push(closeHref);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      previous?.focus();
    };
  }, [closeHref, router]);

  return (
    <aside
      aria-label="Template preview detail"
      aria-modal="true"
      className="h3-gallery-detail"
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      {children}
    </aside>
  );
}
