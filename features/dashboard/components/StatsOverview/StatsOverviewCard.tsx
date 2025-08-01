import { Cell } from "@/components/ui/Cell/Cell";
import { ArrowUpRight, Clock } from "lucide-react";

export const StatsOverviewCard = ({
  title,
  total,
  recentTotal,
  change,
  icon,
  backgroundColor,
}: {
  title: string;
  total: number;
  recentTotal: string;
  change: number;
  icon: React.ReactNode;
  backgroundColor: string;
}) => {
  return (
    <Cell>
      <div className="p-2">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`bg-${backgroundColor} p-3 rounded-xl`}>{icon}</div>
            <p className="font-bold text-gray-900 text-2xl">{total || 0}</p>
          </div>
          <div className="flex items-center gap-1 font-medium text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>{change || 0}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600 text-sm">{title}</p>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span>{recentTotal}</span>
          </div>
        </div>
      </div>
    </Cell>
  );
};
