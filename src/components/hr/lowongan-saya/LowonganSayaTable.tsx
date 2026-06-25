"use client";

export interface Job {
  posisi: string;
  tanggal: string;
  status: "AKTIF" | "DITUTUP" | "MENUNGGU";
}

interface LowonganSayaTableProps {
  jobs: Job[];
}

export default function LowonganSayaTable({ jobs }: LowonganSayaTableProps) {
  const getStatusStyle = (status: string) => {
    const baseStyle = "inline-flex items-center justify-center min-w-[100px] px-3 py-1 rounded-full text-xs font-semibold text-center";

    switch (status) {
      case "AKTIF":
        return `${baseStyle} bg-green-500 text-white`;
      case "DITUTUP":
        return `${baseStyle} bg-red-500 text-white`;
      case "MENUNGGU":
        return `${baseStyle} bg-yellow-500 text-white`;
      default:
        return `${baseStyle} bg-gray-300 text-black`;
    }
  };

  return (
    <div>
      {/* Judul keluar dari kotak */}
      <h1 className="text-3xl font-bold mb-4">Lowongan Saya</h1>

      {/* Kotak tabel */}
      <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto max-h-[28rem]">
          <table className="w-full text-left">
            <thead className="bg-gray-300 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Posisi</th>
                <th className="px-6 py-3">Tanggal Posting</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-3">{job.posisi}</td>
                  <td className="px-6 py-3">{job.tanggal}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={getStatusStyle(job.status)}>{job.status}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-blue-600 cursor-pointer hover:underline">Lihat</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
