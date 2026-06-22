import { AssessmentIntro } from "@/components/AssessmentIntro";
import quadrants from "@/data/quadrants.json";
import siteContent from "@/data/site-content.json";
import type { QuadrantDefinition, SiteContent } from "@/lib/types";

export default function HomePage() {
  return (
    <AssessmentIntro
      content={siteContent as SiteContent}
      quadrants={quadrants as QuadrantDefinition[]}
    />
  );
}
