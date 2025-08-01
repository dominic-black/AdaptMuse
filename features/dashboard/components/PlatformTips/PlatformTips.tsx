import { Cell } from "@/components/ui/Cell/Cell";
import { Sparkles } from "lucide-react";

export const PlatformTips = () => {
  return (
    <Cell>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Pro Tips</h3>
            <p className="text-gray-600 text-sm">
              Maximize your platform usage
            </p>
          </div>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 mt-1 p-2 rounded-lg">
                <div className="bg-blue-600 rounded-full w-2 h-2"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Diversify Your Audiences
                </h4>
                <p className="text-gray-600 text-sm">
                  Create multiple audience profiles to test different
                  demographics and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 mt-1 p-2 rounded-lg">
                <div className="bg-emerald-600 rounded-full w-2 h-2"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Use Cultural Correlates
                </h4>
                <p className="text-gray-600 text-sm">
                  Leverage AI recommendations to discover new cultural
                  connections and trends.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 mt-1 p-2 rounded-lg">
                <div className="bg-purple-600 rounded-full w-2 h-2"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Iterate and Refine
                </h4>
                <p className="text-gray-600 text-sm">
                  Continuously update your audiences based on performance data
                  and insights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 mt-1 p-2 rounded-lg">
                <div className="bg-amber-600 rounded-full w-2 h-2"></div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Track Performance</h4>
                <p className="text-gray-600 text-sm">
                  Monitor your content performance to understand what resonates
                  with your audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Cell>
  );
};
