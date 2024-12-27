import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gamma AI - Your Intelligent Assistant",
  description:
    "Gamma AI is an intelligent assistant designed to enhance productivity, streamline communication, and support decision-making across diverse domains.",
  keywords: [
    "AI",
    "Gamma AI",
    "Intelligent Assistant",
    "Productivity",
    "Automation",
    "Decision Support",
    "Chatbot",
    "Machine Learning",
  ],
  authors: [{ name: "Inggrit Setya Budi" }],
  robots: "index, follow",
  openGraph: {
    title: "Gamma AI - Your Intelligent Assistant",
    description:
      "Gamma AI helps you with productivity, communication, and automation through advanced AI capabilities.",
    url: "https://gammac.vercel.app",
    siteName: "Gamma AI",
    images: [
      {
        url: "https://gammac.vercel.app/apple-touch-icon.png",
        alt: "Gamma AI Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamma AI - Your Intelligent Assistant",
    description:
      "Enhance productivity and streamline tasks with Gamma AI, your intelligent assistant.",
    images: ["https://gammac.vercel.app/apple-touch-icon.png"],
  },
  applicationName: "Gamma AI",
  manifest: "/site.webmanifest",
  other: {
    version: "1.1.0",
    releaseDate: "12-12-2024",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
