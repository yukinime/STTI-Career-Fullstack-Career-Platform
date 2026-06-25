# 🚀 STTI Career – Fullstack Career Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

Platform karier komprehensif yang dirancang untuk menghubungkan talenta terbaik dengan perusahaan. Proyek ini memfasilitasi proses rekrutmen dari ujung ke ujung (end-to-end), dilengkapi dengan sistem manajemen lowongan pekerjaan, profil pelamar, dan dasbor analitik.

## 📑 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Struktur Repositori](#-struktur-repositori)
- [Panduan Instalasi Lokal](#-panduan-instalasi-lokal)
- [Dokumentasi API](#-dokumentasi-api)
- [Deployment Produksi](#-deployment-produksi)
- [Tim Pengembang](#-tim-pengembang)

---

## ✨ Fitur Utama

- 🧑‍🎓 **Portal Pelamar:** Manajemen profil CV yang komprehensif (biodata, pendidikan, pengalaman, sertifikat, keterampilan), pencarian lowongan kerja, *bookmark*, dan pemantauan status lamaran secara *real-time*.
- 🏢 **Portal Perusahaan (HR):** Publikasi lowongan kerja, pengelolaan *pipeline* pelamar masuk, manajemen status rekrutmen, dan kustomisasi profil perusahaan.
- 🔐 **Portal Administrator:** Dasbor metrik sistem, verifikasi/moderasi lowongan kerja, serta manajemen akses pengguna dan *role-based access control* (RBAC).

---

## 📂 Struktur Repositori

Proyek ini menggunakan arsitektur *monorepo-style*, di mana *frontend* berada di *root directory* dan *backend* memiliki ruang kerja mandiri di dalam subdirektori.

```text
STTI Career/
├── Backend/                # REST API (Node.js/Express.js, JWT, Multer)
├── public/                 # Aset statis frontend (gambar, ikon, font)
├── src/                    # Source code Next.js (App Router, Components)
├── utils/                  # Utilitas dan fungsi pembantu frontend
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Konfigurasi dependensi frontend
├── tailwind.config.ts      # Konfigurasi styling Tailwind CSS
└── README.md               # Dokumentasi utama repositori
