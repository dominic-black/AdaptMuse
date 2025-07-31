"use client";

import { useUser } from "@/providers/UserProvider";

export const ScreenHeader = ({ heading }: { heading: string }) => {
  const { userProfile, loading } = useUser();

  return (
    <header className="flex justify-between items-center">
      <h1 className="font-bold text-color-text text-4xl">{heading}</h1>
      <div className="hidden md:flex items-center gap-3">
        {loading ? (
          <div className="bg-gray-300 rounded-full w-8 h-8 animate-pulse"></div>
        ) : userProfile ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-color-text">
              {userProfile.firstName} {userProfile.lastName}
            </span>
            <div className="flex justify-center items-center bg-primary rounded-full w-8 h-8 font-bold text-white">
              {userProfile.firstName
                ? userProfile.firstName.charAt(0).toUpperCase()
                : ""}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
