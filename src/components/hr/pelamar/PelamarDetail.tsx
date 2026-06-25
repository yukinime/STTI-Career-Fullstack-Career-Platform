//src/components/hr/pelamar/PelamarDetail.tsx
"use client";

import { useRouter } from "next/navigation";
import { Download, ArrowLeftFromLine } from "lucide-react";

interface Pengalaman {
  posisi: string;
  perusahaan: string;
  periode: string;
  deskripsi: string[];
}

interface Certificate {
  certificate_name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  certificate_file_url: string;
}

interface Pelamar {
  id: string;
  nama: string;
  posisi: string;
  tanggal: string;
  foto: string;
  email: string;
  telepon: string;
  alamat: string;
  tanggalLahir: string;
  universitas: string;
  jurusan: string;
  tahunLulus: number;
  ipk: number;
  pengalaman: Pengalaman[];
  ringkasan: string;
  keahlian: string[];
  cv_file_url: string;
  certificates?: Certificate[];
}

export default function PelamarDetail({ pelamar }: { pelamar: Pelamar }) {
  const router = useRouter();

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Detail Pelamar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 text-sm"
          >
            <ArrowLeftFromLine size={16} />
            Kembali
          </button>
          <a
            href={pelamar.cv_file_url}
            download
            target="_blank"
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download size={16} />
            Download CV
          </a>
        </div>
      </div>

      {/* Kotak detail scrollable */}
      <div className="bg-white border rounded-xl shadow-md p-5 max-h-[80vh] overflow-y-auto">
        {/* Profil */}
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
          <img
            src={pelamar.foto}
            alt={pelamar.nama}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-bold">{pelamar.nama}</h2>
            <p className="text-gray-600 text-sm">{pelamar.posisi}</p>
            <p className="text-xs text-gray-500">
              Melamar pada {pelamar.tanggal}
            </p>
          </div>
        </div>

        {/* Informasi pribadi & pendidikan */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-semibold mb-2 border-b pb-1 text-sm">
              Informasi Pribadi
            </h3>
            <ul className="space-y-1 text-gray-700 text-xs">
              <li>
                <span className="font-semibold">Email:</span> {pelamar.email}
              </li>
              <li>
                <span className="font-semibold">Telepon:</span>{" "}
                {pelamar.telepon}
              </li>
              <li>
                <span className="font-semibold">Alamat:</span> {pelamar.alamat}
              </li>
              <li>
                <span className="font-semibold">Tanggal Lahir:</span>{" "}
                {pelamar.tanggalLahir}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 border-b pb-1 text-sm">
              Pendidikan
            </h3>
            <ul className="space-y-1 text-gray-700 text-xs">
              <li>
                <span className="font-semibold">Universitas:</span>{" "}
                {pelamar.universitas}
              </li>
              <li>
                <span className="font-semibold">Jurusan:</span>{" "}
                {pelamar.jurusan}
              </li>
              <li>
                <span className="font-semibold">Tahun Lulus:</span>{" "}
                {pelamar.tahunLulus}
              </li>
              <li>
                <span className="font-semibold">IPK:</span> {pelamar.ipk}
              </li>
            </ul>
          </div>
        </div>

        {/* Pengalaman Kerja */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 border-b pb-1 text-sm">
            Pengalaman Kerja
          </h3>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {pelamar.pengalaman
              .slice()
              .sort((a, b) => {
                const getYear = (p: string) =>
                  parseInt(p.split("-").pop()?.trim() || "0", 10);
                return getYear(b.periode) - getYear(a.periode);
              })
              .map((exp, i) => (
                <div
                  key={i}
                  className="relative pl-6 border-l-2 border-gray-300 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="absolute -left-[9px] top-3 w-3 h-3 bg-blue-600 rounded-full"></span>

                  <p className="font-semibold text-sm">
                    {exp.posisi} – {exp.perusahaan}
                  </p>
                  <p className="text-xs text-gray-500">{exp.periode}</p>
                  <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1 mt-1">
                    {exp.deskripsi.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {/* Ringkasan keahlian */}
        <div>
          <h3 className="font-semibold mb-2 border-b pb-1 text-sm">
            Ringkasan Keahlian
          </h3>
          <p className="text-xs text-gray-700 mb-2">{pelamar.ringkasan}</p>
          <div className="flex flex-wrap gap-2">
            {pelamar.keahlian.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        {/* Sertifikat */}
        {pelamar.certificates && pelamar.certificates.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 border-b pb-1 text-sm">
              Sertifikat
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {pelamar.certificates.map((cert, i) => (
                <div
                  key={i}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-start shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {cert.certificate_name}
                    </p>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(cert.issue_date).toLocaleDateString("id-ID")} →{" "}
                      {new Date(cert.expiry_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <a
                    href={cert.certificate_file_url}
                    target="_blank"
                    className="text-blue-600 text-xs hover:underline"
                  >
                    Unduh
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
