"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { FAQItemConfig } from "@/templates/schema";

export function FAQListClient({ items }: { items: readonly FAQItemConfig[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="h3-faq-list">
      {items.map((item) => {
        const expanded = item.id === openId;
        const panelId = `faq-${item.id}`;
        return (
          <div className="h3-faq-item" data-expanded={expanded} key={item.id}>
            <button
              aria-controls={panelId}
              aria-expanded={expanded}
              className="h3-faq-trigger"
              onClick={() => setOpenId(expanded ? null : item.id)}
              type="button"
            >
              <span>{item.question}</span>
              <Plus aria-hidden="true" />
            </button>
            <div className="h3-faq-answer" hidden={!expanded} id={panelId}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
