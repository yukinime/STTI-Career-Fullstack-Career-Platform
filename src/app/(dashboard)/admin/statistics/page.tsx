"use client";
import React, { useEffect, useState } from "react";

interface StatsResponse {
  users: number;
  jobs: number;
  applications: number;
  growth: {
    users: number;
    jobs: number;
    applications: number;
  };
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-6 text-slate-400">Loading...</div>;

  return (
    <div className="px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white">Statistics & Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <GrowthCard
          title="Monthly User Growth"
          percent={stats?.growth.users ?? 0}
          total={stats?.users ?? 0}
        />
        <GrowthCard
          title="Monthly Job Growth"
          percent={stats?.growth.jobs ?? 0}
          total={stats?.jobs ?? 0}
        />
        <GrowthCard
          title="Monthly Application Growth"
          percent={stats?.growth.applications ?? 0}
          total={stats?.applications ?? 0}
        />
      </div>
    </div>
  );
};

export default Statistics;

// === Card Component ===
interface CardProps {
  title: string;
  percent: number;
  total: number;
}

const GrowthCard: React.FC<CardProps> = ({ title, percent, total }) => {
  const isPositive = percent > 0;
  const isNegative = percent < 0;
  const isZero = percent === 0 || total === 0;

  const color = isPositive
    ? "text-emerald-400"
    : isNegative
    ? "text-red-400"
    : "text-slate-400";

  const arrow = isPositive ? "↗" : isNegative ? "↘" : "↔";
  const prefix = isPositive ? "+" : "";

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="mb-4">
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${color}`}>
            {isZero ? "0%" : `${prefix}${percent}%`}
          </span>
          <span className={`${color} text-sm`}>
            {isZero
              ? `↔ no change (${total} total)`
              : `${arrow} vs last month (${total} total)`}
          </span>
        </div>
      </div>

      {/* Chart area */}
      <div className="h-24 relative">
        <svg viewBox="0 0 200 60" className="w-full h-full">
          <defs>
            <linearGradient id={title} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M 0 45 Q 20 35 40 38 Q 60 30 80 25 Q 100 20 120 22 Q 140 18 160 15 Q 180 12 200 10"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M 0 45 Q 20 35 40 38 Q 60 30 80 25 Q 100 20 120 22 Q 140 18 160 15 Q 180 12 200 10 L 200 60 L 0 60 Z"
            fill="url(#gradient1)"
          />
        </svg>
      </div>
    </div>
  );
};
