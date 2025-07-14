import { getSummaryById } from "@/lib/summaries";
import { notFound } from "next/navigation";

import { SummaryPage } from "@/components/individual-summaries-page/summary-page";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const summary: any = await getSummaryById(id);
  if (!summary) notFound();
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-[#0f0f0f] dark:to-[#1a1a1a] px-4 py-12">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-black dark:to-gray-900 opacity-30 blur-3xl" />
      <SummaryPage summary={summary} />
    </main>
  );
}
