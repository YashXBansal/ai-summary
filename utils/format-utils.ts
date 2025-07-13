export function formatFileNameAsTitle(fileName: string): string {
  // Remove file extension
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");

  // Replace underscores and hyphens with spaces
  const withSpace = withoutExtension
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  // Capitalize the first letter of each word
  return withSpace
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
