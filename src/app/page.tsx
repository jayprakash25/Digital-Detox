"use client";

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
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-zinc-950">
      <div className="bg-zinc-950 w-full relative min-h-screen overflow-hidden">
        <div className="hero-background"></div>
        <div className="hero-pattern" aria-hidden="true"></div>

        {/* Hero section */}
        <div className="hero-content">
          <h1 className="hero-title">
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