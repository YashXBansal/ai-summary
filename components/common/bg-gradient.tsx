import clsx from "clsx";

export default function BgGradient({
  children,
  classname,
}: {
  children?: React.ReactNode;
  classname?: string;
}) {
  const defaultPolygonColor1 = "bg-cyan-200/20 dark:bg-cyan-800/20";
  const defaultPolygonColor2 = "bg-pink-200/20 dark:bg-pink-800/20";

  return (
    <div className="relative w-full min-h-screen overflow-hidden isolate">
      {/* Background Gradient Layer */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-br from-cyan-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
        aria-hidden="true"
      />

      {/* Decorative Polygon Shape 1 */}
      <div
        className={clsx(
          "absolute -top-48 -left-32 w-[500px] h-[500px] rounded-[30%] blur-[100px] -z-10 opacity-80",
          classname ?? defaultPolygonColor1
        )}
        style={{
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 0% 100%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative Polygon Shape 2 */}
      <div
        className={clsx(
          "absolute top-64 -right-36 w-[400px] h-[400px] rounded-[40%] blur-[100px] -z-10 opacity-80",
          classname ?? defaultPolygonColor2
        )}
        style={{
          clipPath: "polygon(0 0, 100% 20%, 80% 100%, 0% 80%)",
        }}
        aria-hidden="true"
      />

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
