"use client";

import {
  Children,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Human3IconButton } from "@/components/human3/Human3IconButton";
import { cn } from "@/lib/utils";

type CarouselExpansionContextValue = {
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
};

const CarouselExpansionContext =
  createContext<CarouselExpansionContextValue | null>(null);

export function useHuman3CarouselExpansion() {
  return useContext(CarouselExpansionContext);
}

type Human3CarouselProps = {
  children: ReactNode;
  label: string;
  className?: string;
  itemKind?: "content" | "media";
};

export function Human3Carousel({
  children,
  className,
  itemKind = "content",
  label,
}: Human3CarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const expansionContext = useMemo(
    () => ({ expandedId, setExpandedId }),
    [expandedId],
  );

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardElements = Array.from(
      track.querySelectorAll<HTMLElement>("[data-carousel-item]"),
    );
    const closestIndex = cardElements.reduce((best, element, index) => {
      const bestDistance = Math.abs(
        (cardElements[best]?.offsetLeft ?? 0) - track.scrollLeft,
      );
      const currentDistance = Math.abs(element.offsetLeft - track.scrollLeft);
      return currentDistance < bestDistance ? index : best;
    }, 0);

    setActiveIndex(closestIndex);
    setHasOverflow(track.scrollWidth - track.clientWidth > 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateState();
    const resizeObserver = new ResizeObserver(updateState);
    resizeObserver.observe(track);
    track
      .querySelectorAll<HTMLElement>("[data-carousel-item]")
      .forEach((item) => resizeObserver.observe(item));
    const frame = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(updateState),
    );
    const settledMeasurement = window.setTimeout(updateState, 160);
    void document.fonts.ready.then(updateState);
    window.addEventListener("load", updateState);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settledMeasurement);
      window.removeEventListener("load", updateState);
    };
  }, [updateState]);

  const moveTo = (index: number) => {
    const track = trackRef.current;
    const target = track?.querySelectorAll<HTMLElement>("[data-carousel-item]")[
      index
    ];
    if (!track || !target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollTo({
      left: target.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <CarouselExpansionContext.Provider value={expansionContext}>
      <div
        className={cn("h3-carousel h3-carousel-section", className)}
        data-carousel
        data-overflow={hasOverflow ? "true" : "false"}
      >
        <div
          aria-label={label}
          className="h3-carousel__track"
          onScroll={updateState}
          ref={trackRef}
          role="region"
          tabIndex={0}
        >
          {items.map((item, index) => (
            <div
              className={cn(
                "h3-carousel__item",
                itemKind === "media" && "h3-carousel__item--media",
              )}
              data-carousel-item
              key={index}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="h3-carousel__footer">
          <span aria-live="polite" className="h3-carousel__status">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <div aria-label={`${label}导航`} className="h3-carousel__controls">
            <Human3IconButton
              disabled={activeIndex === 0}
              kind="previous"
              label="上一张卡片"
              onClick={() => moveTo(Math.max(0, activeIndex - 1))}
            />
            <Human3IconButton
              disabled={activeIndex === items.length - 1}
              kind="next"
              label="下一张卡片"
              onClick={() =>
                moveTo(Math.min(items.length - 1, activeIndex + 1))
              }
            />
          </div>
        </div>
      </div>
    </CarouselExpansionContext.Provider>
  );
}
