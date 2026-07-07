"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type KeyboardEvent } from "react";

import type {
  TemplateCategory,
  TemplateType,
} from "@/templates/schema";

const typeOptions = [
  { value: "all", label: "All" },
  { value: "page", label: "Page" },
  { value: "section", label: "Section" },
] as const;

const categoryOptions = [
  "all",
  "narrative",
  "marketing",
  "content",
  "commerce",
  "conversion",
] as const;

type GalleryFiltersProps = {
  type: TemplateType | "all";
  category: TemplateCategory | "all";
  query: string;
};

export function GalleryFilters({
  category,
  query,
  type,
}: GalleryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value.length === 0) params.delete(key);
    else params.set(key, value);
    params.delete("preview");
    router.push(`/debug/template-gallery?${params.toString()}`);
  };

  const moveTypeFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
    event.preventDefault();
    const current = typeOptions.findIndex((option) => option.value === type);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (current + direction + typeOptions.length) % typeOptions.length;
    update("type", typeOptions[next].value);
  };

  return (
    <div className="h3-gallery-toolbar" aria-label="模板筛选">
      <div
        aria-label="模板类型"
        className="h3-gallery-segmented"
        onKeyDown={moveTypeFocus}
        role="tablist"
      >
        {typeOptions.map((option) => (
          <button
            aria-selected={type === option.value}
            key={option.value}
            onClick={() => update("type", option.value)}
            role="tab"
            tabIndex={type === option.value ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="h3-gallery-field">
        <span>Category</span>
        <select
          onChange={(event) => update("category", event.target.value)}
          value={category}
        >
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <form
        className="h3-gallery-search"
        onSubmit={(event) => {
          event.preventDefault();
          update("query", search.trim());
        }}
      >
        <label htmlFor="template-search">Search</label>
        <input
          id="template-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="名称、ID 或关键词"
          type="search"
          value={search}
        />
      </form>
      <button
        className="h3-gallery-clear"
        onClick={() => router.push("/debug/template-gallery")}
        type="button"
      >
        Clear
      </button>
    </div>
  );
}
