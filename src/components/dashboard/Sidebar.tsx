"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic,
  History,
  Users,
  Settings,
  Flame,
  Volume2,
  ExternalLink,
  Bot,
  LayoutDashboard,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Start Discussion",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Practice History",
      href: "/dashboard/history",
      icon: History,
      active: pathname === "/dashboard/history" || pathname === "/history",
    },
    {
      label: "Persona Directory",
      href: "/dashboard/personas",
      icon: Users,
      active: pathname === "/dashboard/personas",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
      badge: "Soon",
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 block mb-2">
            Practice Arena
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  item.active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      item.active
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Live Engine Status Card */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              Engine Status
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Floor state machine active with Web Speech STT and instant barge-in.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-[11px] text-slate-500 flex items-center justify-between">
          <span>PanelPrep v1.0</span>
          <span className="text-emerald-600 font-semibold font-mono">Ready</span>
        </div>
      </div>
    </aside>
  );
};
