import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/shared/NavBar/NavBar";
import { MobileNavBar } from "@/components/shared/NavBar/MobileNavBar";
import { AuthProvider } from "@/providers/AuthContext";
import { UserProvider } from "@/providers/UserProvider";
import { AudienceProvider } from "@/providers/AudienceProvider";
import { JobsProvider } from "@/providers/JobsProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdaptMuse | Audience-Driven Content Creation",
  description:
    "AdaptMuse analyzes your target audience with Qloo's Taste AI and empowers you to generate, optimize, and tailor content—ad copy, emails, social posts—designed to truly resonate.",
  openGraph: {
    title: "AdaptMuse | Audience-Driven Content Creation",
    description:
      "Generate and tailor content that truly connects. AdaptMuse analyzes your target audience using Qloo’s Taste AI to craft ad copy, emails, and posts that resonate.",
    url: "https://adaptmuse.com",
    siteName: "AdaptMuse",
    images: [
      {
        url: "https://adaptmuse.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "AdaptMuse Audience Insights",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdaptMuse | Audience-Driven Content Creation",
    description:
      "Supercharge your content. AdaptMuse leverages Qloo’s Taste AI to analyze audience interests and help you generate content that resonates.",
    images: ["https://adaptmuse.com/og-image.png"],
  },
  metadataBase: new URL("https://adaptmuse.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "AdaptMuse",
    "Qloo",
    "Audience insights",
    "Content generation",
    "AI marketing",
    "Ad copy",
    "Social media",
    "Personalized content",
    "Email marketing",
    "Creative AI",
    "Audience analysis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <UserProvider>
            <AudienceProvider>
              <JobsProvider>
                <div className="gap-16 min-h-screen font-[family-name:var(--font-inter)]">
                  <div>
                    <NavBar />
                    <MobileNavBar />
                    {children}
                  </div>
                  <footer className="flex flex-wrap justify-center items-center gap-[24px] row-start-3"></footer>
                </div>
              </JobsProvider>
            </AudienceProvider>
          </UserProvider>
        </AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
