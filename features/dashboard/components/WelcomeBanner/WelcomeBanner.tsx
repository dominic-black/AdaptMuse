import { Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const WelcomeBanner = ({ name }: { name: string }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 border border-blue-100 rounded-2xl">
      <div className="flex lg:flex-row flex-col justify-between items-between items-center space-y-4 lg:space-y-0 w-full">
        <div className="space-y-3 mr-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-2xl">
                Welcome back, {name}!
              </h1>
              <p className="text-gray-600">
                Ready to create your next audience and generate amazing content?
              </p>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-4 w-full lg:w-auto">
          <Button
            href="/audience/create"
            className="bg-gradient-to-r from-blue-600 hover:from-blue-700 to-purple-600 hover:to-purple-700 w-full lg:w-auto"
          >
            <Target className="mr-2 w-full lg:w-4 h-full lg:h-4" />
            Create Audience
          </Button>
          <Button
            href="/generate-content"
            variant="outline"
            className="w-full lg:w-auto"
          >
            <Sparkles className="mr-2 w-full lg:w-4 h-full lg:h-4" />
            Generate Content
          </Button>
        </div>
      </div>
    </div>
  );
};
