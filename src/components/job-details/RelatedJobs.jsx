import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, ChevronLeft } from 'lucide-react';
import RelatedJobCard from './RelatedJobCard';

/**
 * RelatedJobs Component - Horizontal carousel
 */
const RelatedJobs = ({ jobs = [], loading = false }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Similar Jobs You Might Like
              </h2>
              <p className="text-gray-600 text-sm mt-0.5">Discover more opportunities that match your profile</p>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          {jobs.length > 3 && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-blue-50 border border-gray-200"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:bg-blue-50 border border-gray-200"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-3 text-gray-600 text-sm font-medium">Loading similar jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            {/* Horizontal Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {jobs.map((job) => (
                <RelatedJobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Browse All Jobs Link */}
            <div className="text-center mt-8">
              <Link
                to="/find-job"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Browse All Jobs</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="p-4 bg-gray-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No similar jobs found at the moment</p>
              <Link
                to="/find-job"
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold text-sm shadow-md hover:shadow-lg"
              >
                Explore All Jobs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default React.memo(RelatedJobs);
