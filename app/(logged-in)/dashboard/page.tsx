import BgGradient from "@/components/common/bg-gradient";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import SummaryCard from "@/components/dashboard/Summary-card";
import Link from "next/link";
import { getSummaries } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EmptySummaryState from "@/components/dashboard/empty-summary-state";
import { migrateAnonSummaryToUser } from "@/lib/migrateAnonSummaryToUser";
import { getUploadStatus } from "@/actions/upload-actions";
import ClearAnonCookieClient from "@/components/dashboard/ClearAnonCookieClient";
import MigrateFromClient from "@/components/dashboard/migrateFromClient";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user?.id) return redirect("/sign-in");

  await migrateAnonSummaryToUser(user.id);

  const summaries = await getSummaries(user.id);
  const uploadStatus = await getUploadStatus();
  const isPro = uploadStatus.isPro;
  const limit: any = isPro ? null : 3;

  return (
    <>
      <MigrateFromClient userId={user.id} />
      <ClearAnonCookieClient />
      <BgGradient classname="bg-indigo-200/20 dark:bg-indigo-800/20">
        <main className="min-h-screen pt-8 sm:pt-12">
          <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-8">
            {/* Top Heading Section */}
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
              <div className="flex flex-col gap-2 text-center sm:text-left w-full">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 drop-shadow-sm">
                  Your Summaries
                </h1>

                {!isPro && (
                  <span className="text-xs font-medium text-gray-500 sm:text-sm">
                    {summaries.length} / {limit} used
                  </span>
                )}

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-md mx-auto sm:mx-0">
                  Transform your PDFs into clear, concise summaries right from
                  your phone or desktop.
                </p>

                {/* Mobile CTA */}
                <div className="mt-4 sm:hidden">
                  <Button
                    variant="ghost"
                    className="w-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white active:scale-95 hover:from-pink-600 hover:to-fuchsia-700 transition-all duration-150 ease-out shadow-md hover:shadow-lg px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Link
                      href="/upload"
                      className="flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Summary</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden sm:flex justify-end">
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white active:scale-95 hover:from-pink-600 hover:to-fuchsia-700 transition-all duration-150 ease-out shadow-md hover:shadow-lg px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Link href="/upload" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>New Summary</span>
                  </Link>
                </Button>
              </div>
            </section>

            {/* Plan Limit Banner */}
            {!isPro && summaries.length >= limit && (
              <section>
                <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-5 sm:p-6 text-rose-800 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-6 text-center sm:text-left">
                    <p className="text-sm sm:text-base leading-relaxed">
                      You’ve reached your limit of{" "}
                      <strong>{limit} free uploads</strong> on the Free plan.
                    </p>
                    <Link
                      href="/#pricing"
                      className="text-sm sm:text-base text-rose-800 font-semibold underline underline-offset-4 inline-flex items-center justify-center gap-1 transition-colors hover:text-rose-900"
                    >
                      Upgrade to Pro
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Summary Cards Grid */}
            <section>
              {summaries.length === 0 ? (
                <EmptySummaryState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {summaries.map((summary, index) => (
                    <SummaryCard key={index} summary={summary} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </BgGradient>
    </>
  );
}
