import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { Cell as UICell } from "@/components/ui/Cell/Cell";
import { AgeDistributionChart, GenderDistributionChart } from "../charts";
import { ExplainationToolTip } from "@/components/shared/ExplainationToolTip/ExplainationToolTip";

interface DemographicsSectionProps {
  ageTotals: Record<string, number>;
  genderTotals: Record<string, number>;
}

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({
  ageTotals,
  genderTotals,
}) => {
  return (
    <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
      {/* Age Distribution */}
      <UICell>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Age Distribution
                  </h3>
                  <ExplainationToolTip label="Age Demographics" />
                </div>
                <p className="text-gray-600 text-sm">
                  Demographic breakdown by age groups
                </p>
              </div>
            </div>
          </div>
          <AgeDistributionChart ageTotals={ageTotals} />
        </div>
      </UICell>

      {/* Gender Distribution */}
      <UICell>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Gender Distribution
                  </h3>
                  <ExplainationToolTip label="Gender Demographics" />
                </div>
                <p className="text-gray-600 text-sm">
                  Audience composition by gender
                </p>
              </div>
            </div>
          </div>
          <GenderDistributionChart genderTotals={genderTotals} />
        </div>
      </UICell>
    </div>
  );
};
