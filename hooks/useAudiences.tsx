import { useContext } from "react";

import { AudienceContext } from "@/providers/AudienceProvider";

export const useAudiences = () => {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error("useAudiences must be used within an AudienceProvider");
  }
  return context;
};
