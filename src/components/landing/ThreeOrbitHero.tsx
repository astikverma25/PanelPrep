"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mic, Sparkles, Volume2, ShieldCheck, Zap, Bot, Trophy, Star } from "lucide-react";
import { Button } from "@/components/common/Button";
import { PERSONAS } from "@/lib/constants/personas";

interface OrbitTile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  type: "persona" | "feature" | "metric";
  icon?: any;
}

const ORBIT_TILES: OrbitTile[] = [
  {
    id: "nair",
    name: "Dr. Nair",
    role: "Moderator",
    avatar: "N",
    color: "#6366F1",
    type: "persona",
  },
  {
    id: "arjun",
    name: "Arjun",
    role: "Dominator",
    avatar: "A",
    color: "#EF4444",
    type: "persona",
  },
  {
    id: "barge",
    name: "Barge-In",
    role: "<150ms Stop",
    avatar: "⚡",
    color: "#F59E0B",
    type: "feature",
    icon: Zap,
  },
  {
    id: "meera",
    name: "Meera",
    role: "Analyst",
    avatar: "M",
    color: "#3B82F6",
    type: "persona",
  },
  {
    id: "evidence",
    name: "Evidence",
    role: "Verified Quotes",
    avatar: "✓",
    color: "#10B981",
    type: "feature",
    icon: ShieldCheck,
  },
  {
    id: "kabir",
    name: "Kabir",
    role: "Quiet One",
    avatar: "K",
    color: "#10B981",
    type: "persona",
  },
  {
    id: "wpm",
    name: "135 WPM",
    role: "Live Pace",
    avatar: "📊",
    color: "#8B5CF6",
    type: "metric",
    icon: Trophy,
  },
  {
    id: "sana",
    name: "Sana",
    role: "The Drifter",
    avatar: "S",
    color: "#EC4899",
    type: "persona",
  },
  {
    id: "voice",
    name: "Voice AI",
    role: "Low-Lag STT",
    avatar: "🎙️",
    color: "#06B6D4",
    type: "feature",
    icon: Volume2,
  },
  {
    id: "rohan",
    name: "Rohan",
    role: "Diplomat",
    avatar: "R",
    color: "#8B5CF6",
    type: "persona",
  },
  {
    id: "replay",
    name: "Replay",
    role: "Missed Openings",
    avatar: "✨",
    color: "#38BDF8",
    type: "feature",
    icon: Sparkles,
  },
  {
    id: "rubric",
    name: "6-Rubrics",
    role: "Placement Scored",
    avatar: "★",
    color: "#F59E0B",
    type: "metric",
    icon: Star,
  },
];

export const ThreeOrbitHero: React.FC = () => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hoveredTile, setHoveredTile] = useState<OrbitTile | null>(null);
  const [radius, setRadius] = useState(360);

  // Responsive radius with ample clearance around center text
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 640) {
          setRadius(180);
        } else if (width < 1024) {
          setRadius(280);
        } else {
          setRadius(380);
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth auto-orbit rotation
  useEffect(() => {
    let animationFrameId: number;
    const speed = hoveredTile ? 0.03 : 0.09;
    const loop = () => {
      if (!isDragging) {
        setRotationAngle((prev) => (prev + speed) % 360);
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, hoveredTile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotationAngle((prev) => prev + delta * 0.3);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    setRotationAngle((prev) => prev + delta * 0.35);
    setStartX(e.touches[0].clientX);
  };

  const totalTiles = ORBIT_TILES.length;

  return (
    <section
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="relative min-h-[780px] lg:min-h-[860px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none py-12"
    >
      {/* Background Soft Glows (Clean Light Canvas) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pointer-events-none" />
      <div className="absolute w-[540px] h-[540px] rounded-full bg-blue-100/40 blur-[130px] pointer-events-none" />

      {/* CIRCULAR ORBIT RING (Matching Video Reference) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Subtle Orbit Ring Guideline */}
        <div
          className="absolute rounded-full border border-slate-200/80 pointer-events-none shadow-sm"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
          }}
        />

        {/* Orbit Tiles */}
        {ORBIT_TILES.map((tile, index) => {
          const angle = (index * (360 / totalTiles) + rotationAngle) % 360;
          const radian = (angle * Math.PI) / 180;

          // Pure 2D circular position on circumference
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          const isHovered = hoveredTile?.id === tile.id;

          return (
            <div
              key={tile.id}
              onMouseEnter={() => setHoveredTile(tile)}
              onMouseLeave={() => setHoveredTile(null)}
              className="absolute pointer-events-auto transition-transform duration-200"
              style={{
                transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${
                  isHovered ? 1.25 : 1.0
                })`,
                zIndex: isHovered ? 40 : 20,
              }}
            >
              {/* Compact Sleek Circular Badge Tile (Reference Video Style) */}
              <div
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-md group ${
                  isHovered
                    ? "bg-white border-blue-500 shadow-xl shadow-blue-500/15 ring-2 ring-blue-400/30"
                    : "bg-white/95 border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
                style={{
                  width: radius < 250 ? "54px" : "68px",
                  height: radius < 250 ? "54px" : "68px",
                }}
              >
                {/* Icon / Initial Avatar */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm mb-0.5"
                  style={{ backgroundColor: tile.color }}
                >
                  {tile.avatar}
                </div>

                {/* Minimal Label */}
                <span className="text-[9px] font-bold text-slate-800 truncate max-w-[54px] text-center">
                  {tile.name}
                </span>

                {/* Hover Tooltip Card */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 bg-slate-900 text-white border border-slate-800 px-3 py-1.5 rounded-xl shadow-2xl text-center pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95">
                    <p className="text-xs font-bold text-white">{tile.name}</p>
                    <p className="text-[10px] text-slate-300">{tile.role}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CLEAN CENTRAL CONTENT (Unhindered and Legible) */}
      <div className="relative z-30 max-w-lg mx-auto px-6 text-center space-y-6 pointer-events-auto">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Voice AI GD Practice &bull; Problem Statement 2</span>
        </div>

        {/* Clear Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
            The Future of <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Group Discussion
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm sm:max-w-md mx-auto pt-1">
            Practice spoken GDs with 3 to 5 AI participants and an active moderator. Get real-time turn-taking and verified evidence coaching.
          </p>
        </div>

        {/* Primary Call to Action Button */}
        <div className="pt-2 flex justify-center">
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="py-3.5 px-8 text-sm sm:text-base font-bold shadow-xl rounded-full hover:scale-105 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 mr-1.5" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* Interactive Drag Hint */}
        <div className="pt-4">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            &bull; Drag ring to rotate 3D view &bull;
          </span>
        </div>
      </div>
    </section>
  );
};
