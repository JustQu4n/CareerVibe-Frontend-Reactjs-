import React from 'react';

/**
 * CompanyHeroBanner Component
 * Hero banner với background gradient
 * 
 * @param {Object} props
 * @param {Object} props.company - Company data
 */
const CompanyHeroBanner = ({ company }) => {
  return (
    <div
      className="w-full h-64 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 relative"
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
          <p className="text-xl text-blue-100">{company.industry || "Technology"}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CompanyHeroBanner);
