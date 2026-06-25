//src/app/(dashboard)/hr/pelamar/[id]/page.tsx
"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import PelamarDetail from "@/components/hr/pelamar/PelamarDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PelamarDetailPage({ params }: Props) {
  const { id } = use(params); // ✅ unwrap params Promise

  const [pelamar, setPelamar] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPelamar = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");

        const res = await fetch(`${apiUrl}/api/applicant/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat data pelamar");

        const json = await res.json();
        const data = json.data && json.data.length > 0 ? json.data[0] : null;
        if (!data) throw new Error("Data pelamar tidak ditemukan");

        setPelamar({
          id: data.application_id.toString(),
          nama: data.full_name,
          posisi: data.posisi,
          tanggal: new Date(data.applied_at).toLocaleDateString("id-ID"),
          foto: data.profile_photo_url,
          email: data.email,
          telepon: data.phone,
          alamat: data.address,
          tanggalLahir: "-",
          universitas: data.institution_name,
          jurusan: data.major,
          tahunLulus: data.graduation_year,
          ipk: parseFloat(data.gpa),
          pengalaman: data.work_experiences.map((exp: any) => ({
            posisi: exp.position,
            perusahaan: exp.company_name,
            periode: `${new Date(exp.start_date).getFullYear()} - ${new Date(
              exp.end_date
            ).getFullYear()}`,
            deskripsi: [exp.job_description],
          })),
          ringkasan: "Pelamar ini memiliki pengalaman kerja yang relevan.",
          keahlian: data.certificates.map((c: any) => c.certificate_name),
          cv_file_url: data.resume_file?.startsWith("http")
            ? data.resume_file
            : `${apiUrl}/uploads/files/${data.resume_file}`,
          certificates: data.certificates || [],
        });
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data pelamar");
      }
    };

    fetchPelamar();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!pelamar) return <div>Loading...</div>;

  return <PelamarDetail pelamar={pelamar} />;
}
