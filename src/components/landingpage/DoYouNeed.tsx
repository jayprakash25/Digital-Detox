import React from 'react'

const DoYouNeed = () => {
  return (
    <div className="container mx-auto mt-24">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-zinc-900 rounded-r-3xl p-8 shadow-lg">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{
            background: "linear-gradient(to right, #fff 60%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent", // For fallback
          }}
        >
          Do you need this?
        </h2>
        <p className="text-[#71717a] text-base sm:text-lg">
          Opening YouTube for being productive, but end up watching something you didn&apos;t want in the first place? If this is a yes, then yes, you need this.
        </p>
      </div>
      <div className="flex-1 bg-zinc-900 rounded-l-3xl p-8 shadow-lg">
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{
            background: "linear-gradient(to right, #fff 60%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent", // For fallback
          }}
        >
          How are we helping?
        </h2>
        <p className="text-[#71717a] text-base sm:text-lg">
          We&apos;ll only show you what you need to see, helping you stay focused and productive.
        </p>
      </div>
    </div>
    <div className="flex justify-center mt-8">
      <span className="h-px w-20 bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
    </div>
  </div>
  )
}

export default DoYouNeed

