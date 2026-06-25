import Header from "@/components/pelamar/Header";
import LamaranSaya from "@/components/pelamar/lamaran/LamaranSaya";

export default function HalamanLamaranSaya() {
  return (
    <>
      {/* Header sekarang hanya perlu prop title */}
      <Header title="Lamaran Saya" />
      <LamaranSaya />
    </>
  );
}