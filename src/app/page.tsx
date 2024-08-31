"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import DoYouNeed from "@/components/landingpage/DoYouNeed";
import HowItWorks from "@/components/landingpage/HowItWorks";
import Link from "next/link";

const DynamicStars = dynamic(() => import("@/components/Stars"), {
  ssr: false,
});

export default function Component() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({behavior: "smooth"});
  }
  
  return (
    <div className="bg-zinc-950">
      <div className=" bg-zinc-950 w-full relative min-h-screen overflow-hidden">
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

        {/* Hero section  */}
        <div>
          <div className="absolute z-10 top-1/4 w-full px-4 sm:px-6 md:px-8 max-w-3xl xl:max-w-4xl text-center left-0 right-0 m-auto">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              style={{
                background:
                  "linear-gradient(to right, #fff 60%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Experience the power of productive content
            </h1>
            <p className="text-[#71717a] mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-medium">
              It&apos;s the digital world now. The content you consume is the
              person you become. You now have the flexibility to do that.
              We&apos;re building consistently just for you to be the right
              person.
            </p>

            <div className="flex flex-col mt-6 sm:mt-8 items-center justify-center">
              <Link href={'/sign-in'}>
              <button className="px-4 py-1.5 rounded-full text-gray-400 bg-black border-[#71717a] border text-sm sm:text-base hover:text-white transition duration-300 ease-in-out">
                Unplug now
              </button>
              </Link>
              <span className="h-px w-20 mt-2 bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
            </div>

            <div className="mt-4 sm:mt-6">
              <button onClick={() => scrollToSection("doyouneed")} className="text-gray-400 cursor-pointer hover:text-white transition duration-300 ease-in-out text-sm sm:text-base">
                Learn More
              </button>
            </div>
          </div>
          <DynamicStars />
        </div>
      </div>

      <div id="doyouneed">
      <DoYouNeed />
      </div>

      <HowItWorks />
    </div>
  );
}
