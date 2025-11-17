/**
 * BrowseHeader Component
 * Displays the hero section with title and description for Browse page
 */

import React from "react";

const BrowseHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Find Your Dream Job
      </h1>
      <p className="text-gray-600">
        Explore thousands of job opportunities with all the information you need.
      </p>
    </div>
  );
};

export default BrowseHeader;
