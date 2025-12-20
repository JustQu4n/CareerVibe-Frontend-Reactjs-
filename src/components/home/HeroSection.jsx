/**
 * HeroSection Component
 * Main hero section with search functionality
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const POPULAR_SEARCHES = [
  'Software Engineer',
  'Data Analyst',
  'Product Manager',
  'UX Designer',
  'Marketing Manager',
  'DevOps Engineer'
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
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-12 pb-16 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] opacity-20"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Job Matching
          </motion.div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-gray-900">
            Find the Right Job.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Faster. Smarter.
            </span>
          </h1>
          
          <p className="text-base mb-6 text-gray-600 leading-relaxed max-w-xl">
            Leverage AI technology to match your skills with the perfect job opportunities.
            Join thousands of professionals finding their dream careers.
          </p>
          
          {/* Search Form */}
          <form
            onSubmit={onSearchSubmit}
            className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 border border-gray-100"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Job title, keyword, or company"
                className="pl-10 h-11 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg text-sm"
                value={searchTitle}
                onChange={(e) => onSearchTitleChange(e.target.value)}
              />
            </div>
            <div className="relative md:w-1/3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="City or remote"
                className="pl-10 h-11 w-full bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500 rounded-lg text-sm"
                value={searchLocation}
                onChange={(e) => onSearchLocationChange(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
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
                  Search Jobs
                </>
              )}
            </Button>
          </form>
          
          {/* Popular Searches */}
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPopularSearchClick(term)}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm hover:shadow"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="relative">
            <img
              src="/src/assets/Illustration.png"
              alt="Job search illustration"
              className="w-full h-auto drop-shadow-2xl relative z-10"
            />
            {/* Floating cards animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-10 right-0 bg-white p-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-xs">+150 Jobs</p>
                  <p className="text-[10px] text-gray-500">Added today</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-20 left-0 bg-white p-3 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-xs">2,500+</p>
                  <p className="text-[10px] text-gray-500">Companies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
