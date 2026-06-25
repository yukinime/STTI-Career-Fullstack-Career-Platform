"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Trash2,
} from "lucide-react";

interface ActivityLog {
  id: number;
  admin_id: number;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: number;
  note: string | null;
  created_at: string;
}

export default function NotificationPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/logs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) setLogs(data.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getIcon = (action: string) => {
    switch (action) {
      case "verify_job":
        return <CheckCircle className="text-green-500" />;
      case "reject_job":
        return <XCircle className="text-red-500" />;
      case "activate_user":
        return <UserCheck className="text-blue-500" />;
      case "deactivate_user":
        return <UserX className="text-yellow-500" />;
      case "delete_user":
        return <Trash2 className="text-gray-500" />;
      default:
        return <Bell className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <main className="flex h-full flex-col items-center justify-center text-white">
        <p>Memuat notifikasi...</p>
      </main>
    );
  }

  return (
    <main className="px-6 pb-6 bg-gray-900 min-h-screen rounded-lg text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-yellow-400" /> Notifikasi Aktivitas Admin
      </h1>

      {logs.length === 0 ? (
        <p className="text-gray-400 text-center">Belum ada aktivitas admin.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl shadow hover:bg-gray-700 transition"
            >
              <div className="w-8 h-8">{getIcon(log.action)}</div>
              <div className="flex-1">
                <p className="font-semibold">
                  {log.admin_name} melakukan aksi{" "}
                  <span className="text-yellow-400">{log.action}</span> pada{" "}
                  <span className="italic">{log.target_type}</span> ID{" "}
                  {log.target_id}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
