import type { RichTextSectionProps } from "@/templates/schema";
import { SectionHeading } from "@/templates/sections/SectionHeading";

export function RichTextSection({ blocks, heading }: RichTextSectionProps) {
  return (
    <section className="h3-page-section">
      <div className="h3-page-shell h3-rich-text">
        {heading ? <SectionHeading {...heading} /> : null}
        {blocks.map((block) => {
          switch (block.type) {
            case "heading":
              return block.level === 2 ? (
                <h2 key={block.id}>{block.text}</h2>
              ) : (
                <h3 key={block.id}>{block.text}</h3>
              );
            case "paragraph":
              return <p key={block.id}>{block.text}</p>;
            case "quote":
              return (
                <blockquote key={block.id}>
                  <p>{block.text}</p>
                  {block.attribution ? <cite>{block.attribution}</cite> : null}
                </blockquote>
              );
            case "list":
              return (
                <ul key={block.id}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
          }
        })}
      </div>
    </section>
  );
}
