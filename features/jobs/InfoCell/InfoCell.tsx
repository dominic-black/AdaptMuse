import { Lightbulb, Zap } from 'lucide-react';

export const InfoCell = () => {
  return (
    <div className="bg-white shadow-sm p-6 rounded-lg space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">What are Jobs?</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Jobs are records of content generation tasks. Each job stores the original content, the generated content, and the audience it was tailored for.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-500/10 p-2 rounded-full text-green-600">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">Coming Soon</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Soon you'll be able to re-run jobs, edit the generated content, and export the results.
        </p>
      </div>
    </div>
  );
};