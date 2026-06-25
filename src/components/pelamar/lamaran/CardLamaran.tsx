"use client";

type StatusLamaran = "terkirim" | "dilihat" | "proses" | "diterima" | "gagal";

type CardLamaranProps = {
  posisi: string;
  perusahaan: string;
  nama: string;
  telepon: string;
  email: string;
  status: StatusLamaran;
};

const steps: { key: StatusLamaran; label: string }[] = [
  { key: "terkirim", label: "Terkirim" },
  { key: "dilihat", label: "Dilihat" },
  { key: "proses", label: "Proses Seleksi" },
  { key: "diterima", label: "Diterima" },
];

const failedSteps: { key: StatusLamaran; label: string }[] = [
  { key: "terkirim", label: "Terkirim" },
  { key: "dilihat", label: "Dilihat" },
  { key: "gagal", label: "Gagal" },
  { key: "diterima", label: "Diterima" },
];

export default function CardLamaran({
  posisi,
  perusahaan,
  nama,
  telepon,
  email,
  status,
}: CardLamaranProps) {
  const currentSteps = status === "gagal" ? failedSteps : steps;
  const activeIndex = currentSteps.findIndex((s) => s.key === status);

  // Menghitung progress width
  const getProgressWidth = () => {
    if (status === "gagal") {
      // Gagal ada di index 2 dari 4 step (0,1,2,3), jadi 2/3 * 100 = 66.67%
      return "66.67%";
    }
    return `${(activeIndex / (currentSteps.length - 1)) * 100}%`;
  };

  return (
    <div className="py-2 border-b border-gray-200 last:border-b-0">
      {/* Info lowongan */}
      <h3 className="font-semibold text-gray-900 text-base">{posisi}</h3>
      <p className="text-sm text-gray-600">{perusahaan}</p>

      {/* Info pelamar */}
      <div className="flex flex-wrap gap-8 text-sm text-gray-500 mt-1">
        <span className="flex items-center gap-1">
          <span className="text-gray-400">👤</span>
          {nama}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-gray-400">📞</span>
          {telepon}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-gray-400">✉️</span>
          {email}
        </span>
      </div>

      {/* Progress */}
      <div className="relative mt-3">
        {/* Garis background */}
        <div className="absolute top-1.5 left-0 w-full h-1 bg-gray-200 rounded-full" />

        {/* Garis progress */}
        <div
          className={`absolute top-1.5 left-0 h-1 rounded-full transition-all duration-300 ${
            status === "gagal" ? "bg-red-500" : "bg-blue-600"
          }`}
          style={{ width: getProgressWidth() }}
        />

        {/* Titik & Label */}
        <div className="flex justify-between relative z-10">
          {currentSteps.map((step, index) => {
            const isActive = index <= activeIndex;
            const isCurrent = index === activeIndex;
            const isFailed = status === "gagal" && step.key === "gagal";

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    isFailed
                      ? "bg-red-500 border-red-500"
                      : isActive
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                />
                <span
                  className={`mt-2 text-xs text-center transition-all duration-300 ${
                    isFailed
                      ? "text-red-500 font-medium"
                      : isCurrent && status !== "gagal"
                      ? "text-blue-600 font-medium"
                      : isActive
                      ? "text-gray-700"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}