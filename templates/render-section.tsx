import { assertNever } from "@/templates/guards";
import type { SectionInstanceConfig } from "@/templates/schema";
import { CTASection } from "@/templates/sections/CTASection";
import { FAQSection } from "@/templates/sections/FAQSection";
import { FeatureGridSection } from "@/templates/sections/FeatureGridSection";
import { HeroSection } from "@/templates/sections/HeroSection";
import { PricingSection } from "@/templates/sections/PricingSection";
import { RichTextSection } from "@/templates/sections/RichTextSection";
import { TestimonialSection } from "@/templates/sections/TestimonialSection";

export function renderSectionInstance(section: SectionInstanceConfig) {
  switch (section.templateId) {
    case "hero":
      return <HeroSection key={section.id} {...section.props} />;
    case "feature-grid":
      return <FeatureGridSection key={section.id} {...section.props} />;
    case "pricing":
      return <PricingSection key={section.id} {...section.props} />;
    case "faq":
      return <FAQSection key={section.id} {...section.props} />;
    case "testimonial":
      return <TestimonialSection key={section.id} {...section.props} />;
    case "cta":
      return <CTASection key={section.id} {...section.props} />;
    case "rich-text":
      return <RichTextSection key={section.id} {...section.props} />;
    default:
      return assertNever(section);
  }
}
