  //src/components/pelamar/profile/sertifikat/SertifikatSection.tsx
  "use client";

  import { useEffect, useState } from "react";
  import { Pencil, Plus, Trash2, FileText, Image as ImageIcon } from "lucide-react";
  import SertifikatForm from "./SertifikatForm";

  type Certificate = {
    id: number;
    certificate_name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string;
    certificate_file: string;
  };

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  // Helper untuk mendapatkan URL gambar yang benar
  function getCertificateImageUrl(certificateFile: string): string {
    if (!certificateFile) return "";

    // Jika sudah URL lengkap
    if (certificateFile.startsWith("http://") || certificateFile.startsWith("https://")) {
      return certificateFile;
    }

    // Jika sudah ada /uploads/ di path, return dengan BASE_URL
    if (certificateFile.includes("/uploads/")) {
      return `${BASE_URL}${certificateFile}`;
    }

    // Tentukan folder berdasarkan ekstensi file
    const ext = certificateFile.toLowerCase().substring(certificateFile.lastIndexOf("."));
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];

    // Jika gambar -> uploads/images/, jika bukan -> uploads/files/
    if (imageExtensions.includes(ext)) {
      return `${BASE_URL}/uploads/images/${certificateFile}`;
    } else {
      return `${BASE_URL}/uploads/files/${certificateFile}`;
    }
  }

  // Helper untuk cek apakah file adalah gambar
  function isImageFile(filename: string): boolean {
    if (!filename) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
    return imageExtensions.includes(ext);
  }

  // Helper mapping data API ke Form
  function mapCertToForm(cert: Certificate) {
    return {
      id: cert.id.toString(),
      nama: cert.certificate_name,
      penerbit: cert.issuer,
      gambar: getCertificateImageUrl(cert.certificate_file),
      tanggal_terbit: cert.issue_date,
      tanggal_berakhir: cert.expiry_date,
    };
  }

  export default function SertifikatSection() {
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [sertifikatList, setSertifikatList] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const getToken = () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
      }
      return null;
    };

    useEffect(() => {
      const fetchCertificates = async () => {
        setIsLoading(true);
        setError("");

        try {
          const token = getToken();
          if (!token) {
            setError("Token tidak ditemukan. Silakan login kembali.");
            setIsLoading(false);
            return;
          }

          const res = await fetch(`${BASE_URL}/api/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error("Gagal mengambil data sertifikat");
          }

          const json = await res.json();

          if (json.data?.certificates) {
            setSertifikatList(json.data.certificates);
            console.log("✅ Certificates loaded:", json.data.certificates);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Terjadi kesalahan saat fetch");
          console.error("❌ Error fetching certificates:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCertificates();
    }, []);

    const handleAdd = () => {
      setEditIndex(null);
      setShowForm(true);
    };

    const handleEdit = (idx: number) => {
      setEditIndex(idx);
      setShowForm(true);
    };
  const handleDelete = async (idx: number) => {
    const cert = sertifikatList[idx];
    if (!confirm(`Yakin mau hapus sertifikat "${cert.certificate_name}"?`)) {
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/profile/certificate/${cert.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ambil isi response buat debug
      const text = await res.text();
      if (!res.ok) {
        console.error("❌ Delete failed:", res.status, text);
        alert(`Gagal menghapus sertifikat (${res.status}): ${text}`);
        return;
      }

      console.log("✅ Delete success:", text);

      // baru hapus dari state kalau backend benar-benar sukses
      setSertifikatList((prev) => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error("❌ Error deleting certificate:", err);
      alert("Gagal menghapus sertifikat");
    }
  };


    const handleCancel = () => {
      setShowForm(false);
      setEditIndex(null);
    };

    const handleSave = () => {
      // Refresh data setelah save
      setShowForm(false);
      setEditIndex(null);
      // Trigger refresh dengan memanggil fetch ulang
      window.location.reload();
    };

    const handleImageError = (certId: number) => {
      console.error(`❌ Failed to load image for certificate ID: ${certId}`);
      setImageErrors((prev) => ({ ...prev, [certId]: true }));
    };

    const handleImageLoad = (certId: number, certName: string) => {
      console.log(`✅ Image loaded successfully for: ${certName}`);
    };

    return (
      <div className="mt-3 p-4 bg-white rounded shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">Sertifikat</h2>
          {!showForm && (
            <button onClick={handleAdd} className="inline-flex items-center bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Memuat data sertifikat...</div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {showForm ? (
          <SertifikatForm mode={editIndex === null ? "add" : "edit"} data={editIndex !== null ? mapCertToForm(sertifikatList[editIndex]) : undefined} onCancel={handleCancel} onSave={handleSave} />
        ) : (
          !isLoading &&
          !error && (
            <div className="space-y-3">
              {sertifikatList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                  {sertifikatList.map((cert, idx) => {
                    const imageUrl = getCertificateImageUrl(cert.certificate_file);
                    const hasImageError = imageErrors[cert.id];
                    const isImage = isImageFile(cert.certificate_file);

                    console.log(`🖼️ Certificate #${idx + 1}:`, {
                      name: cert.certificate_name,
                      file: cert.certificate_file,
                      url: imageUrl,
                      isImage,
                    });

                    return (
                      <div key={cert.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                        {/* Gambar / Preview */}
                        <div className="relative w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100">
                          {hasImageError || !isImage ? (
                            // Fallback: Icon file (untuk PDF atau gambar error)
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 p-4">
                              <FileText className="w-16 h-16 stroke-1" />
                              <span className="text-xs text-center break-all line-clamp-2 px-2">{cert.certificate_file.split("/").pop()}</span>
                              {!isImage && (
                                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-500 hover:text-blue-700 hover:underline">
                                  📄 Buka PDF
                                </a>
                              )}
                            </div>
                          ) : (
                            // Tampilkan gambar (JPG, PNG, JPEG, dll)
                            <div className="relative w-full h-full overflow-hidden">
                              <img src={imageUrl} alt={cert.certificate_name} className="w-full h-full object-cover" onError={() => handleImageError(cert.id)} onLoad={() => handleImageLoad(cert.id, cert.certificate_name)} />
                              {/* Overlay untuk loading */}
                              <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10" />
                            </div>
                          )}
                        </div>

                        {/* Info Card */}
                        <div className="p-3 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate" title={cert.certificate_name}>
                                {cert.certificate_name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate" title={cert.issuer}>
                                {cert.issuer}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-1 flex-shrink-0">
                              <button onClick={() => handleEdit(idx)} className="p-1.5 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </button>
                              <button onClick={() => handleDelete(idx)} className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Hapus">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>

                          {/* Tanggal */}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>📅 {cert.issue_date}</span>
                            {cert.expiry_date && (
                              <>
                                <span>→</span>
                                <span>{cert.expiry_date}</span>
                              </>
                            )}
                          </div>

                          {/* Debug Info - Bisa dihapus setelah selesai */}
                          <details className="text-xs text-gray-400">
                            <summary className="cursor-pointer hover:text-gray-600">Debug Info</summary>
                            <div className="mt-1 space-y-1 p-2 bg-gray-50 rounded text-xs font-mono">
                              <div>
                                <strong>File:</strong> {cert.certificate_file}
                              </div>
                              <div>
                                <strong>Extension:</strong> {cert.certificate_file.substring(cert.certificate_file.lastIndexOf("."))}
                              </div>
                              <div>
                                <strong>URL:</strong>{" "}
                                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                                  {imageUrl}
                                </a>
                              </div>
                              <div>
                                <strong>Is Image:</strong> {isImage ? "✅ Yes (uploads/images/)" : "❌ No (uploads/files/)"}
                              </div>
                              <div>
                                <strong>Error:</strong> {hasImageError ? "❌ Yes" : "✅ No"}
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-3 stroke-1" />
                  <p className="text-sm">Belum ada sertifikat yang tersimpan</p>
                  <p className="text-xs mt-1">Klik tombol Tambah untuk menambahkan sertifikat</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  }
