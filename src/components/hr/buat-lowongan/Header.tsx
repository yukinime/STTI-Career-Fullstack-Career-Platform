"use client";

interface HeaderProps {
  title?: string;
  onAddClick: () => void;
}

export default function Header({ title = "Buat Lowongan", onAddClick }: HeaderProps) {
  return (
  <div className="flex items-center justify-between px-6 py-4">
  <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
  <button
    onClick={onAddClick}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
  >
    + Lowongan
  </button>
</div>

  );
}
