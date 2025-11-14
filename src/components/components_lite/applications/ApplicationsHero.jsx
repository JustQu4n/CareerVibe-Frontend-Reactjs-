import React from 'react';

/**
 * ApplicationsHero Component
 * Hiển thị hero section cho trang applications
 */
const ApplicationsHero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold">Your Job Applications</h1>
        <p className="mt-2 text-blue-100 max-w-2xl">
          Track the status of your applications and stay updated on your job search journey
        </p>
      </div>
    </div>
  );
};

export default React.memo(ApplicationsHero);
