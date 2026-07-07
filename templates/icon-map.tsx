import {
  BookOpen,
  CircleDot,
  GitBranch,
  Layers,
  Network,
  Repeat2,
  Route,
  Sparkles,
  Target,
  Waypoints,
} from "lucide-react";

import type { IconRef } from "@/templates/schema";

const iconMap = {
  "circle-dot": CircleDot,
  "git-branch": GitBranch,
  network: Network,
  waypoints: Waypoints,
  "book-open": BookOpen,
  route: Route,
  repeat: Repeat2,
  layers: Layers,
  sparkles: Sparkles,
  target: Target,
} as const;

export function TemplateIcon({ name }: { name: IconRef }) {
  const Icon = iconMap[name];
  return <Icon aria-hidden="true" />;
}
