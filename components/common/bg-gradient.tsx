import clsx from "clsx";

export default function BgGradient({
  children,
  classname,
}: {
  children?: React.ReactNode;
  classname?: string;
}) {
  return (
    <div className={clsx("relative w-full overflow-hidden", classname)}>
      {/* Main background gradient */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-br from-cyan-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
        aria-hidden="true"
      />

      {/* Soft blurred glowing polygonal shape 1 */}
      <div
        className="absolute -top-48 -left-32 w-[500px] h-[500px] bg-cyan-200/20 dark:bg-cyan-800/20 rounded-[30%] blur-[100px] -z-10"
        style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 0% 100%)" }}
        aria-hidden="true"
      />

      {/* Soft blurred glowing polygonal shape 2 */}
      <div
        className="absolute top-64 right-[-150px] w-[400px] h-[400px] bg-pink-200/20 dark:bg-pink-800/20 rounded-[40%] blur-[100px] -z-10"
        style={{ clipPath: "polygon(0 0, 100% 20%, 80% 100%, 0% 80%)" }}
        aria-hidden="true"
      />

      {/* Children go above background */}
      {children}
    </div>
  );
}
