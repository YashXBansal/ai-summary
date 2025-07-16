import LinkAnonSummaryToUser from "@/components/dashboard/LinkAnonSummaryToUser";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LinkAnonSummaryToUser />
      {children}
    </>
  );
}
