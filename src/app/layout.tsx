import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "PANELPREP - Voice-First AI Group Discussion & Placement Room",
  description:
    "Sit in a realistic campus placement group discussion room with 3-5 AI participants and an active moderator. Receive evidence-backed rubric feedback quoting exact moments from your transcript.",
  keywords: [
    "PanelPrep",
    "Group Discussion Practice",
    "Campus Placements",
    "Voice AI GD",
    "Interview Preparation",
    "Turn Taking AI",
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
