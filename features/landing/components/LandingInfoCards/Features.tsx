import { Users, Bot, BarChart } from "lucide-react";

export const FEATURES = [
  {
    icon: <Users className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />,
    title: "Audience Analysis",
    description:
      "Deep insights into your audience's demographics, interests, and behaviors with real-time segmentation.",
  },
  {
    icon: <Bot className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />,
    title: "AI Content Generation",
    description:
      "Generate high-impact, on-brand content in seconds with advanced AI models fine-tuned to your voice.",
  },
  {
    icon: (
      <BarChart className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />
    ),
    title: "Performance Tracking",
    description:
      "See exactly what's working with smart, actionable metrics and live performance dashboards.",
  },
];
