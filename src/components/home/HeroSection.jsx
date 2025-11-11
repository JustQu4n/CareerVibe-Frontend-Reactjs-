/**
 * HeroSection Component
 * Main hero section with search functionality
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const POPULAR_SEARCHES = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'UX Designer',
];

const HeroSection = React.memo(({
  searchTitle,
  searchLocation,
  isSearching,
  onSearchTitleChange,
  onSearchLocationChange,
  onSearchSubmit,
  onPopularSearchClick,
}) => {
  return (
    <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 pt-16 pb-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-blue-100 to-transparent opacity-70"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-gray-900">
            Find a job that matches your{' '}
            <span className="text-blue-600 relative">
              passion
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 Q50,12 100,0"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
              </svg>
            </span>{' '}
            & expertise
          </h1>
          <p className="text-lg mb-8 text-gray-600 leading-relaxed">
            Explore thousands of job opportunities with all the information you need.
            Make your future happen.
          </p>
          
          <form
            onSubmit={onSearchSubmit}
            className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Job title or keyword"
                className="pl-10 h-12 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                value={searchTitle}
                onChange={(e) => onSearchTitleChange(e.target.value)}
              />
            </div>
            <div className="relative md:w-1/3">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Location"
                className="pl-10 h-12 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500"
                value={searchLocation}
                onChange={(e) => onSearchLocationChange(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Jobs
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Popular Searches:</span>
            {POPULAR_SEARCHES.map((term, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPopularSearchClick(term)}
                className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block"
        >
          <img
            src="/src/assets/Illustration.png"
            alt="Job search illustration"
            className="w-full h-auto drop-shadow-xl"
          />
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          fill="#ffffff"
        >
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

HeroSection.propTypes = {
  searchTitle: PropTypes.string.isRequired,
  searchLocation: PropTypes.string.isRequired,
  isSearching: PropTypes.bool.isRequired,
  onSearchTitleChange: PropTypes.func.isRequired,
  onSearchLocationChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onPopularSearchClick: PropTypes.func.isRequired,
};

export default HeroSection;
