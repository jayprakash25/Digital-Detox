"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from  'next/dynamic'
import HeroSection from "@/components/landingpage/HeroSection";


const DynamicStars = dynamic(() => import('@/components/Stars'), { ssr: false })

export default function Component() {
  return (
    <div className=" bg-zinc-950 w-full relative overflow-hidden min-h-screen">
      <div
        className="absolute top-0 left-1/2 h-[70vh] transform -translate-x-1/2 w-[200%] aspect-[2/1]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
          borderRadius: "0 0 200% 200%",
        }}
      ></div>
      <div
        className=" min-h-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExOS41IDEyMEguNVYuNUgxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzIwMjAyMCIgb3BhY2l0eT0iMC4yIi8+PC9zdmc+')]"
        aria-hidden="true"
      ></div>
      <DynamicStars/>

     <HeroSection/>

      
    </div>
  );
}
