/**
 * JobList Component
 * Displays jobs in grid or list layout with loading and empty states
 * Uses AnimatePresence for smooth job card animations
 */

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import JobCard from "@/components/components_lite/JobCard";

const JobList = ({ jobs, loading, mode, onResetFilters }) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading jobs...</p>
      </div>
    );
  }

  // Empty state - no jobs found
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Filter className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          We couldn't find any jobs matching your current filters. Try adjusting
          your search criteria or check back later.
        </p>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  // Job list/grid with animation
  return (
    <div
      className={
        mode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-6"
      }
    >
      <AnimatePresence>
        {jobs.map((job) => (
          <motion.div
            key={job.job_post_id || job._id || job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <JobCard job={job} mode={mode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when parent updates
export default memo(JobList);
