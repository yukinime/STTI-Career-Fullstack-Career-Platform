//src/app/(auth)/login/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2"; // ✅ ganti toast dengan SweetAlert


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

 async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) throw new Error("Email atau password salah!");

      const data = await res.json();
      const user = data.data.user;
      const accessToken = data.data.tokens.accessToken;
      const refreshToken = data.data.tokens.refreshToken;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ SweetAlert success
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil 🎉",
        text: "Selamat datang kembali!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // ✅ Redirect setelah popup hilang
      if (user.role === "admin") router.push("/admin/dashboard");
      else if (user.role === "hr") router.push("/hr/dashboard");
      else router.push("/");
    } catch (err: unknown) {
      let message = "Terjadi kesalahan tak terduga";
      if (err instanceof Error) message = err.message;
      setError(message);

      // ❌ SweetAlert error
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
        confirmButtonText: "Coba Lagi",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col md:flex-row h-screen relative">
      {/* Tombol Back */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 z-20"
      >
        <Image src="/back.png" alt="Back" width={32} height={32} />
      </button>

      {/* Bagian Logo */}
      <div
        className="
          w-full 
          md:w-2/5 
          flex flex-col items-center justify-center 
          bg-white relative z-10 p-8
          h-2/5 md:h-full
        "
      >
        <Image
          src="/logo-stti.png"
          alt="Logo STTIS"
          width={180}
          height={180}
          className="w-24 sm:w-32 md:w-44 h-auto"
        />
        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-[#0A1FB5]">
          STTICAREER
        </h1>
      </div>

      {/* Bagian Form */}
      <div
        className="
          w-full 
          md:w-3/5 
          relative flex items-center justify-center 
          bg-[#0A1FB5] md:bg-transparent
          h-3/5 md:h-full
        "
      >
        {/* Background miring hanya muncul di desktop */}
        <div
          className="hidden md:block absolute inset-0 bg-[#0A1FB5]"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />

        <form
          onSubmit={handleLogin}
          className="relative z-10 w-11/12 sm:w-3/4 max-w-md text-white py-6 md:py-0"
        >
          {error && <p className="mb-4 text-red-300">{error}</p>}

          <label className="block mb-2 font-semibold">Your Mail :</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 rounded-md text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Your Password :</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 mb-4 rounded-md text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between items-center mb-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-white" />
              Remember me
            </label>
            <a href="/forgot-password" className="hover:underline">
              Forget password ?
            </a>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black font-bold py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/role")}
              className="flex-1 bg-yellow-400 text-black font-bold py-2 rounded-md"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
