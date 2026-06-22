import { SharedResultClient } from "@/components/SharedResultClient";

export default async function SharedResultPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const { a } = await searchParams;

  return <SharedResultClient shareCode={a} />;
}
