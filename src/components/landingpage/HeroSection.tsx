import React from 'react'

const HeroSection = () => {
  return (
    <div className="absolute top-1/4 w-full px-4 sm:px-6 md:px-8 max-w-3xl xl:max-w-4xl text-center left-0 right-0 m-auto">
      <h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
        style={{
          background: "linear-gradient(to right, #fff 60%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent", // For fallback
        }}
      >
        Experience the power of productive content
      </h1>
      <p className="text-[#71717a] mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-medium">
        It&apos;s the digital world now. The content you consume is the person
        you become. You now have the flexibility to do that. We&apos;re
        building consistently just for you to be the right person.
      </p>

      <div className="flex flex-col mt-6 sm:mt-8 items-center justify-center">
        <button className="px-4 py-1.5 rounded-full text-gray-400 bg-black border-[#71717a] border text-sm sm:text-base hover:text-white transition duration-300 ease-in-out">
          Unplug now
        </button>
        <span className="h-px w-20 mt-2 bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </div>

      <div className="mt-4 sm:mt-6">
        <p className="text-gray-400 cursor-pointer hover:text-white transition duration-300 ease-in-out text-sm sm:text-base">
          Learn More
        </p>
      </div>
    </div>
  )
}

export default HeroSection