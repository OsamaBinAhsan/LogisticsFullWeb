import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/top-bar";

export const metadata: Metadata = {
  title: "AuraCommerce Admin",
  description: "Admin panel for AuraCommerce",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden font-body-md antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
