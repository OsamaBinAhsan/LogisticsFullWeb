export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 flex flex-col bg-background text-on-surface min-h-screen">{children}</div>;
}
