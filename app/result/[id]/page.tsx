import { ResultClient } from "@/components/ResultClient";

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <ResultClient />;
}
