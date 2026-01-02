import React, { useCallback } from 'react';
import { Search, X } from 'lucide-react';

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
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                filterStatus === filter.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ApplicationFilters);
