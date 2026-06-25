import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}

export default function StatsCard({ icon: Icon, title, value, iconBg, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} mb-2`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <p className="text-gray-600 font-medium">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
