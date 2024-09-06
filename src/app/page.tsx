"use client";

import dynamic from "next/dynamic";
import DoYouNeed from "@/components/landingpage/DoYouNeed";
import HowItWorks from "@/components/landingpage/HowItWorks";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const DynamicStars = dynamic(() => import("@/components/Stars"), {
  ssr: false,
});

export default function Component() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-zinc-950">
      <div className="bg-zinc-950 w-full relative min-h-screen overflow-hidden">
        <div className="hero-background"></div>
        <div className="hero-pattern" aria-hidden="true"></div>

        {/* Hero section */}
        <div className="hero-content">
          <h1 className="hero-title text-3xl md:text-5xl">
            Experience the power of productive content
          </h1>
          <p className="hero-subtitle">
            It&apos;s the digital world now. The content you consume is the
            person you become. You now have the flexibility to do that.
            We&apos;re building consistently just for you to be the right
            person.
          </p>

          <div className="hero-actions">
            <Link href="/sign-in">
              <button className="hero-button">Unplug now</button>
            </Link>
            <span className="hero-divider"></span>
          </div>

          <div className="hero-learn-more">
            <button
              onClick={() => scrollToSection("doyouneed")}
              className="learn-more-button"
            >
              Learn More
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-5">
      <a href="https://www.producthunt.com/posts/youtube-detoxify?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-youtube&#0045;detoxify" target="_blank"><Image src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=485540&theme=dark" alt="Youtube&#0032;Detoxify - Have&#0032;control&#0032;over&#0032;what&#0032;you&#0032;surround&#0032;yourself&#0032;with&#0032;digitally&#0046; | Product Hunt" width="250" height="54" /></a>

      <Link href="https://github.com/jayprakash25/Digital-Detox" target="_blank" rel="noopener noreferrer">
      <button className="bg-zinc-900 text-white font-semibold py-3.5 px-4  rounded shadow-lg hover:bg-zinc-800 transition duration-300 ease-in-out">
      <Github />      </button>
    </Link>
      </div>
        </div>
        <DynamicStars />
      </div>

      <div id="doyouneed">
        <DoYouNeed />
      </div>

      <HowItWorks />
      
    </div>
  );
}