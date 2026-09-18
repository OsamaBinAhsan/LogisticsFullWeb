export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 flex flex-col bg-[#06080A] min-h-screen">{children}</div>;
}
