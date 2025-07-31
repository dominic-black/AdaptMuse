"use client";

import { useState, useEffect } from "react";
import { Bot, Home, Bell, Settings, Users, List, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ size: number; color?: string; fill?: string }>;
  label: string;
  group: "main" | "bottom";
}

const navigationItems: NavigationItem[] = [
  { href: "/home", icon: Home, label: "Home", group: "main" },
  { href: "/audience", icon: Users, label: "Audience", group: "main" },
  {
    href: "/generate-content",
    icon: Bot,
    label: "Generate Content",
    group: "main",
  },
  { href: "/jobs", icon: List, label: "Jobs", group: "main" },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
    group: "bottom",
  },
  { href: "/settings", icon: Settings, label: "Settings", group: "bottom" },
];

export const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const publicRoutes = ["/", "/login", "/signup"];
  if (publicRoutes.includes(pathname)) return null;

  const mainItems = navigationItems.filter((item) => item.group === "main");
  const bottomItems = navigationItems.filter((item) => item.group === "bottom");

  const isActiveRoute = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden top-0 right-0 left-0 z-40 fixed flex justify-between items-center bg-white px-4 py-3 border-gray-200 border-b">
        <Link href="/home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="AdaptMuse Logo"
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <span className="ml-3 font-semibold text-gray-900 text-lg">
            AdaptMuse
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-50 hover:bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
          aria-label="Open navigation menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="lg:hidden z-50 fixed inset-0 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Navigation Drawer */}
          <div className="top-0 right-0 absolute bg-white shadow-2xl w-80 max-w-[85vw] transition-transform duration-300 ease-out transform">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-gray-100 border-b">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="AdaptMuse Logo"
                  width={28}
                  height={28}
                />
                <span className="ml-3 font-semibold text-gray-900 text-lg">
                  AdaptMuse
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-50 hover:bg-gray-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200"
                aria-label="Close navigation menu"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex flex-col h-full">
              {/* Main Navigation - Scrollable */}
              <nav className="flex-1 px-6 py-6 overflow-y-auto">
                <div className="space-y-2">
                  {mainItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        >
                          <Icon size={22} />
                        </span>
                        <span className="ml-4 font-medium text-base">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="bg-primary ml-auto rounded-full w-2 h-2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom Navigation - Fixed at bottom */}
              <div className="flex-shrink-0 bg-white px-6 pt-4 pb-6 border-gray-100 border-t">
                <div className="space-y-2">
                  {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveRoute(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span
                          className={`transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        >
                          <Icon size={22} />
                        </span>
                        <span className="ml-4 font-medium text-base">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="bg-primary ml-auto rounded-full w-2 h-2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
