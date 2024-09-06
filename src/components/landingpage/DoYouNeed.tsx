import React from 'react';

const DoYouNeed = () => {
  return (
    <div className="container mx-auto mt-24">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-zinc-900 rounded-r-3xl p-8 shadow-lg">
          <h2 className="gradient-text text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Do you need this?
          </h2>
          <p className="text-[#71717a] text-base sm:text-lg">
            Opening YouTube for being productive, but end up watching something you didn&apos;t want in the first place? If this is a yes, then yes, you need this.
          </p>
        </div>
        <div className="flex-1 bg-zinc-900 rounded-l-3xl p-8 shadow-lg">
          <h2 className="gradient-text text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          How are we helping?          </h2>
          <p className="text-[#71717a] text-base sm:text-lg">
           We&apos;ll only show you what you need to see, helping you stay focused and productive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoYouNeed;