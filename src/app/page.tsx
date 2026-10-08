"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ThreeOrbitHero } from "@/components/landing/ThreeOrbitHero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PersonasPreview } from "@/components/landing/PersonasPreview";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 w-full flex flex-col">
      <ThreeOrbitHero />
      <Features />
      <HowItWorks />
      <PersonasPreview />
      <CTASection />
    </div>
  );
}
