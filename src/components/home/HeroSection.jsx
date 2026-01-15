/**
 * HeroSection Component
 * Main hero section with search functionality
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, TrendingUp, Briefcase, Users, Building2, ArrowRight } from 'lucide-react';
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
    <section className="bg-white pt-8 pb-12 px-6 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30"></div>
      
      {/* Accent Shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      
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
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-semibold mb-4 shadow-lg shadow-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Job Matching
          </motion.div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-900">
            Find Your Dream Job{' '}
            <span className="text-blue-600">
            Faster.
            </span>
          </h1>
          
          <p className="text-base mb-6 text-gray-600 leading-relaxed max-w-xl">
            Discover thousands of job opportunities tailored to your skills and preferences.
            Let AI match you with the perfect career path.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">10,000+</p>
                <p className="text-xs text-gray-600">Active Jobs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">50,000+</p>
                <p className="text-xs text-gray-600">Job Seekers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">2,500+</p>
                <p className="text-xs text-gray-600">Companies</p>
              </div>
            </div>
          </div>
          
          {/* Search Form */}
          <form
            onSubmit={onSearchSubmit}
            className="bg-white p-2 rounded-xl shadow-xl border-2 border-gray-100 flex flex-col md:flex-row gap-2"
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
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm group"
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
                  Search Jobs
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
          
          {/* Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onPopularSearchClick(term)}
                className="text-xs px-3 py-1.5 bg-gray-100 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white transition-all font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card 1 - Job Openings */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-xl border-2 border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">+150</p>
                  <p className="text-xs text-gray-600">New Jobs Today</p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating Card 2 - Companies */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-xl border-2 border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-base text-gray-900">2,500+</p>
                  <p className="text-xs text-gray-600">Top Companies</p>
                </div>
              </div>
            </motion.div>
            
            {/* Floating Card 3 - Success Rate */}
            <motion.div
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white p-3 rounded-xl shadow-xl border-2 border-gray-100"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                  <span className="text-lg font-bold text-purple-600">95%</span>
                </div>
                <p className="text-[10px] font-semibold text-gray-900">Success Rate</p>
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
