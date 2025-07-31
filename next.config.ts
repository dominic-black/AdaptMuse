import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.qloo.com', 'cdn-icons-png.flaticon.com', "storage.googleapis.com", "firebasestorage.googleapis.com"],
  },
  // Enable runtime configuration for Firebase
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
