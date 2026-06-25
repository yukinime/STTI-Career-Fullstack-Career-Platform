# 🚀 STTI Career – Fullstack Career Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge\&logo=mysql\&logoColor=white)

Platform karier komprehensif yang dirancang untuk menghubungkan talenta terbaik dengan perusahaan. Proyek ini memfasilitasi proses rekrutmen secara end-to-end, mulai dari publikasi lowongan kerja, manajemen profil pelamar, proses seleksi, hingga pemantauan status rekrutmen secara real-time.

---

## 📑 Daftar Isi

* [✨ Fitur Utama](#-fitur-utama)
* [📂 Struktur Repositori](#-struktur-repositori)
* [🛠️ Panduan Instalasi Lokal](#️-panduan-instalasi-lokal)
* [🔗 Dokumentasi API](#-dokumentasi-api)
* [☁️ Deployment Produksi](#️-deployment-produksi)
* [👥 Tim Pengembang](#-tim-pengembang)

---

## ✨ Fitur Utama

### 🧑‍🎓 Portal Pelamar

* Manajemen profil CV lengkap
* Riwayat pendidikan
* Pengalaman kerja
* Sertifikat dan portofolio
* Daftar keterampilan (skills)
* Pencarian lowongan kerja
* Bookmark lowongan favorit
* Pemantauan status lamaran secara real-time

### 🏢 Portal Perusahaan (HR)

* Publikasi lowongan pekerjaan
* Pengelolaan kandidat masuk
* Manajemen pipeline rekrutmen
* Pembaruan status seleksi pelamar
* Profil perusahaan yang dapat dikustomisasi

### 🔐 Portal Administrator

* Dashboard statistik sistem
* Moderasi dan verifikasi lowongan
* Manajemen pengguna
* Role Based Access Control (RBAC)
* Monitoring aktivitas platform

---

## 📂 Struktur Repositori

Proyek menggunakan pendekatan **monorepo-style**, di mana frontend berada pada root repository dan backend memiliki workspace terpisah.

```text
STTI-Career/
│
├── Backend/                # REST API (Node.js, Express.js)
├── public/                 # Static assets
├── src/                    # Source code Next.js
├── utils/                  # Utility functions
│
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── package.json            # Frontend dependencies
└── README.md               # Project documentation
```

---

## 🛠️ Panduan Instalasi Lokal

### Persyaratan Sistem

Pastikan perangkat telah terpasang:

* Node.js v18 atau lebih baru
* NPM atau Yarn
* MySQL Server
* Git

---

### 1️⃣ Menjalankan Backend

Masuk ke direktori backend:

```bash
cd Backend
```

Install seluruh dependency:

```bash
npm install
```

Salin file environment:

```bash
cp .env.example .env
```

Konfigurasikan file `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=stti_career

PORT=5000

JWT_SECRET=your_super_secret_jwt_key
```

Jalankan backend:

```bash
npm run start
```

Server API akan berjalan pada:

```text
http://localhost:5000
```

Health Check:

```text
GET /health
```

---

### 2️⃣ Menjalankan Frontend

Buka terminal baru lalu kembali ke root project:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi dapat diakses melalui:

```text
http://localhost:3000
```

---

## 🔗 Dokumentasi API

Seluruh komunikasi antara frontend dan backend menggunakan format response standar:

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

### 📄 Dokumentasi Endpoint

```text
Backend/docs/STTI_Career_API.md
```

Berisi:

* Authentication API
* User API
* Company API
* Vacancy API
* Application API
* Admin API

### 🧪 Postman Collection

Import file berikut ke Postman:

```text
Backend/postman/STTI_Career_API.postman_collection.json
```

---

## ☁️ Deployment Produksi

### 🚂 Backend Deployment (Railway)

Direkomendasikan menggunakan Railway dengan MySQL Internal Network.

Environment Variables:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306

NODE_OPTIONS=--dns-result-order=ipv4first

DB_BOOTSTRAP=1
```

> Aktifkan `DB_BOOTSTRAP=1` hanya sekali saat inisialisasi database produksi.

---

### ▲ Frontend Deployment (Vercel)

1. Hubungkan repository GitHub ke Vercel
2. Vercel akan mendeteksi aplikasi Next.js secara otomatis
3. Tambahkan Environment Variable:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

4. Deploy

---

## 🧰 Teknologi yang Digunakan

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* React Hooks
* Axios

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer Upload
* MySQL

### DevOps

* Railway
* Vercel
* GitHub

---

## 👥 Tim Pengembang

Proyek ini dikembangkan secara kolaboratif oleh:

| Nama                | Peran                              |
| ------------------- | ---------------------------------- |
| **Jerry Zhonathan** | Fullstack Developer / Project Lead |
| **Agra Mahesa Kusuma**      | Frontend Developer       |
| **Muhammad Rizal**      | Frontend & UI/UX Desginer Developer       |
| **Syahrur Ramadhani**      | UI/UX Designer & Quality Assurance |
| **Abdul Japar**      | Frontend Developer & Quality Assurance |
| **Dicky Agustian**      | Quality Assurance |


---

## 📜 Lisensi

Copyright © 2026 STTI Career Development Team.

All Rights Reserved.
