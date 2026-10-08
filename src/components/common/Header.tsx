"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Volume2, ShieldCheck, LayoutDashboard, Home } from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isRoomOrReport = pathname === "/room" || pathname === "/report";

  return (
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-slate-200">
            <img
              src="/logo.png"
              alt="PanelPrep Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-950">
                PANELPREP
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Voice AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">Campus Placement GD Simulator</p>
          </div>
        </Link>

        {/* Header Right Actions */}
        <nav className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Turn-Taking Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {/* Conditional Navigation / Action */}
          {isDashboard || isRoomOrReport ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Landing Page</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Disclosure</span>
          </div>
        </nav>
      </div>
    </header>
  );
};
