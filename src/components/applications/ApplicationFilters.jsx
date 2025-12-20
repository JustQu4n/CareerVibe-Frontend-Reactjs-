import React, { useCallback } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ApplicationFilters Component
 * Hiển thị filter và search controls
 * 
 * @param {Object} props
 * @param {string} props.filterStatus - Filter status hiện tại
 * @param {Function} props.onFilterChange - Callback khi thay đổi filter
 * @param {string} props.searchTerm - Search term hiện tại
 * @param {Function} props.onSearchChange - Callback khi thay đổi search
 */
const ApplicationFilters = ({
  filterStatus = 'all',
  onFilterChange,
  searchTerm = '',
  onSearchChange,
}) => {
  const filters = [
    { value: 'all', label: 'All Applications', icon: Filter, count: 0, color: 'blue' },
    { value: 'pending', label: 'Pending', icon: Filter, count: 0, color: 'amber' },
    { value: 'shortlisted', label: 'Shortlisted', icon: Filter, count: 0, color: 'emerald' },
    { value: 'rejected', label: 'Rejected', icon: Filter, count: 0, color: 'red' },
  ];

  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filters.map((filter, index) => (
            <FilterButton
              key={filter.value}
              filter={filter}
              isActive={filterStatus === filter.value}
              onClick={() => onFilterChange(filter.value)}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * FilterButton - Individual filter button component
 */
const FilterButton = React.memo(({ filter, isActive, onClick, index }) => {
  const colorClasses = {
    blue: isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    amber: isActive ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30' : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    emerald: isActive ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    red: isActive ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-50 text-red-700 hover:bg-red-100',
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
        colorClasses[filter.color]
      } ${isActive ? 'scale-105' : 'scale-100'}`}
    >
      {filter.label}
      {isActive && (
        <motion.div
          layoutId="activeFilter"
          className="absolute inset-0 rounded-xl border-2 border-white/30"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
});

FilterButton.displayName = 'FilterButton';

export default React.memo(ApplicationFilters);
