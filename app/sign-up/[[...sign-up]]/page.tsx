import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 overflow-hidden px-4 py-10">
      {/* Sign-Up Card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl p-6 sm:p-8 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-none border-0 bg-transparent",
              headerTitle:
                "text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white",
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full mt-4 text-base sm:text-lg py-3",
            },
          }}
        />
      </div>
    </main>
  );
}
