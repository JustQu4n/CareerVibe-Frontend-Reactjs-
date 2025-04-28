import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-[#8c9ae2] text-white pt-12 pb-20">
      {/* Background overlay hình bóng người */}
      <div className="absolute inset-0">
        <img
          src="https://same-assets.com/job-hero-banner.png"
          alt="banner bg"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-[#23273a] bg-opacity-80" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="text-cyan-400 mr-2">3,000+</span>
          Browse Jobs
        </h1>
        <div className="text-lg mb-8">
          Find Jobs, Employment & Career Opportunities
        </div>
        {/* Search bar */}
        <form className="flex flex-col md:flex-row gap-3 justify-center items-center bg-white bg-opacity-10 rounded-lg p-4 max-w-2xl mx-auto shadow-lg">
          <input
            type="text"
            placeholder="Job title, keywords..."
            className="flex-1 min-w-[150px] px-4 py-2 rounded-md text-[#23273a] focus:outline-cyan-400"
          />
          <input
            type="text"
            placeholder="Location"
            className="flex-1 min-w-[150px] px-4 py-2 rounded-md text-[#23273a] focus:outline-cyan-400"
          />
          <input
            type="text"
            placeholder="Category"
            className="flex-1 min-w-[150px] px-4 py-2 rounded-md text-[#23273a] focus:outline-cyan-400"
          />
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-500 text-white font-bold px-8 py-2 rounded-md shadow transition"
          >
            Search
          </button>
        </form>
        {/* Subtitle nhỏ dưới search */}
        <div className="mt-4 text-sm text-gray-300">
          For Job Seekers, Employers, Career centers, and Recruiting Agencies
        </div>
      </div>
    </section>
  );
};

export default Hero;
