import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "GD Arena - Voice-First AI Group Discussion Room",
  description:
    "Sit in a realistic campus placement group discussion room with 3-5 AI participants and a moderator. Receive evidence-backed rubric feedback quoting exact moments from your transcript.",
  keywords: [
    "Group Discussion",
    "GD Practice",
    "Campus Placements",
    "Voice AI",
    "Interview Preparation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-arena-dark text-slate-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
