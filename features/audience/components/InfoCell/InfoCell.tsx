import { Cell } from "@/components/ui/Cell/Cell";
import { Lightbulb } from "lucide-react";

export const InfoCell = () => {
  return (
    <div className="top-0 sticky">
      <Cell>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
            <Lightbulb className="w-6" />
          </div>
          <h3 className="font-semibold text-gray-800 text-lg">
            What is an Audience?
          </h3>
        </div>
        <div className="space-y-3 text-gray-600 text-sm">
          <p>
            An audience is a defined group of people with shared
            characteristics, interests, or behaviors.
          </p>
          <p>
            By creating audiences, you can tailor your content—like ad copy,
            marketing emails, or social media posts—to resonate more effectively
            with specific segments. This targeted approach helps increase
            engagement and achieve your communication goals.
          </p>
        </div>
      </Cell>
    </div>
  );
};
