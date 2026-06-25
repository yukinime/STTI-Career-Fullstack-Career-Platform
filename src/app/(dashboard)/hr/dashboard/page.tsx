//src/app/(dashboard)/hr/dashboard/page.tsx
import Header from "@/components/hr/dashboard/Header";
import StatsSection from "@/components/hr/dashboard/StatsSection";
import LowonganTable from "@/components/hr/dashboard/LowonganTable";

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 p-8">
        <Header />
        <StatsSection />

        <h2 className="font-bold py-4 text-lg">Lowongan Kerja Aktif</h2>
        <LowonganTable />
      </div>
    </div>
  );
}
