"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ChooseRole() {
  const router = useRouter();

  return (
    <section className="flex flex-col md:flex-row h-screen">
      <button
        onClick={() => router.push("/login")}
        className="absolute top-2 left-2 z-20"
      >
        <Image src="/back.png" alt="Back" width={28} height={28} />
      </button>

      {/* Kiri / Atas - Company */}
      <div className="relative w-full md:w-2/5 h-1/2 md:h-full hover:brightness-90 transition">
        <Image src="/company.jpg" alt="Company" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Link
            href="/register-company"
            className="bg-white/80 px-10 py-4 rounded-lg text-xl font-bold text-black hover:bg-white transition"
          >
            Company
          </Link>
        </div>
      </div>

      {/* Kanan / Bawah - Jobseeker */}
      <div className="relative w-full md:w-3/5 h-1/2 md:h-full hover:brightness-90 transition">
        <Image src="/job.jpg" alt="Jobseeker" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#0A1FB5]/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Link
            href="/register"
            className="bg-white/80 px-10 py-4 rounded-lg text-xl font-bold text-black hover:bg-white transition"
          >
            Jobseeker
          </Link>
        </div>
      </div>
    </section>
  );
}
