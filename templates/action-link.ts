import type { ActionDestination } from "@/templates/schema";

export function actionDestinationToHref(destination: ActionDestination) {
  switch (destination.kind) {
    case "route":
      return destination.path;
    case "anchor":
      return `#${destination.id}`;
    case "url":
      return destination.url;
  }
}
