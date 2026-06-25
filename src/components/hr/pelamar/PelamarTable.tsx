//src/components/hr/pelamar/PelamarTable.tsx
"use client";

import { useRouter } from "next/navigation";
import { Download, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Pelamar {
  id: number;
  nama: string;
  tanggal: string;
  cv: string;
  posisi: string;
  resume_file_url: string;
  status?: "pending" | "accepted" | "rejected";
}

interface PelamarTableProps {
  pelamars: Pelamar[];
}

export default function PelamarTable({ pelamars }: PelamarTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [statusMap, setStatusMap] = useState<
    Record<number, "pending" | "accepted" | "rejected">
  >({});

  // 🧩 Inisialisasi status dari backend
  useEffect(() => {
    const initialStatuses: Record<number, "pending" | "accepted" | "rejected"> =
      {};
    pelamars.forEach((p) => {
      initialStatuses[p.id] = p.status || "pending";
    });
    setStatusMap(initialStatuses);
  }, [pelamars]);

  // ✅ Update status ke backend
  const handleUpdateStatus = async (
    id: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      setLoadingId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicant/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            notes:
              status === "accepted" ? "Lanjut ke tahap berikutnya" : "Ditolak",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui status");

      // ✅ Update state lokal agar tampilan langsung berubah
      setStatusMap((prev) => ({ ...prev, [id]: status }));
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui status pelamar");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Pelamar</h1>

      <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto max-h-[28rem]">
          <table className="w-full text-left">
            <thead className="bg-gray-300 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Nama</th>
                <th className="px-6 py-3">Tanggal Melamar</th>
                <th className="px-6 py-3">CV</th>
                <th className="px-6 py-3 text-center">Aksi</th>
                <th className="px-6 py-3 rounded-tr-lg">Posisi</th>
              </tr>
            </thead>
            <tbody>
              {pelamars.map((p) => {
                const status = statusMap[p.id] || "pending";
                const isAccepted = status === "accepted";
                const isRejected = status === "rejected";

                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-6 py-3">{p.nama}</td>
                    <td className="px-6 py-3">{p.tanggal}</td>
                    <td className="px-6 py-3">
                      <a
                        href={p.resume_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Unduh CV
                      </a>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2 items-center">
                        {/* ✅ Tombol Lanjut */}
                        <button
                          onClick={() => handleUpdateStatus(p.id, "accepted")}
                          disabled={loadingId === p.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isAccepted
                              ? "text-green-600 bg-transparent border border-green-600"
                              : "bg-yellow-400 hover:bg-yellow-500 text-white"
                          }`}
                        >
                          {isAccepted && <Check className="w-4 h-4" />}
                          {loadingId === p.id ? "..." : "Lanjut"}
                        </button>

                        {/* ❌ Tombol Tolak */}
                        <button
                          onClick={() => handleUpdateStatus(p.id, "rejected")}
                          disabled={loadingId === p.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isRejected
                              ? "text-red-600 bg-transparent border border-red-600"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {isRejected && <X className="w-4 h-4" />}
                          {loadingId === p.id ? "..." : "Tolak"}
                        </button>

                        <span
                          className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => router.push(`/hr/pelamar/${p.id}`)}
                        >
                          Lihat
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">{p.posisi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
