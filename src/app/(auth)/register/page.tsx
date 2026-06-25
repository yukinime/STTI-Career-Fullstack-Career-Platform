"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RegisterPelamar() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    if (!/^[0-9]+$/.test(phone)) {
      setError("Nomor telepon hanya boleh angka!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/pelamar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
            address,
            date_of_birth: dob,
            phone,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registrasi gagal");

      setShowSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan tak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    router.push("/login");
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen">
      {/* Background */}
      <Image src="/job.jpg" alt="Background" fill className="object-cover" />

      <div className="relative z-10 bg-white/90 rounded-lg shadow-lg w-11/12 md:w-4/5 lg:w-3/4 flex flex-col md:flex-row p-8 md:p-12 gap-8 my-4">
        {/* Logo di atas (hanya mobile) */}
        <div className="flex flex-col items-center justify-center mb-6 md:hidden">
          <Image
            src="/logo-stti.png"
            alt="Logo STTIS"
            width={120}
            height={120}
          />
          <h1 className="mt-2 text-xl font-bold text-[#0A1FB5]">STTICAREER</h1>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <button
              onClick={() => router.push("/role")}
              className="absolute top-2 left-2 z-20"
            >
              <Image src="/back.png" alt="Back" width={28} height={28} />
            </button>
            <label className="block text-sm font-medium">
              Full Name:
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan Nama Lengkap"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan Alamat"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Date of Birth:
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Phone:
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Masukkan Nomor Telepon"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi Password"
                className="w-full p-2 border rounded-md"
                required
              />
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-bold py-2 rounded-md hover:bg-yellow-500 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Daftar"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Sudah punya akun?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Login sekarang!
            </span>
          </p>
        </div>

        {/* Logo Section (hanya desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1">
          <Image
            src="/logo-stti.png"
            alt="Logo STTIS"
            width={200}
            height={200}
          />
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-[#0A1FB5]">
            STTICAREER
          </h1>
        </div>
      </div>

      {/* Modal Success */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center w-80">
            <h2 className="text-lg font-bold text-green-600 mb-4">
              Registrasi berhasil 🎉
            </h2>
            <button
              onClick={handleSuccessOk}
              className="px-4 py-2 bg-yellow-400 rounded font-semibold hover:bg-yellow-500"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
