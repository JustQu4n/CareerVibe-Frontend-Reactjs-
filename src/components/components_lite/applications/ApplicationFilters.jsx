import React, { useCallback } from 'react';
import { Filter, Search } from 'lucide-react';

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
    { value: 'all', label: 'All', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'pending', label: 'Pending', colorClass: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'shortlisted', label: 'Shortlisted', colorClass: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'rejected', label: 'Rejected', colorClass: 'bg-red-100 text-red-700 border-red-200' },
  ];

  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-gray-500" />
            Filter by Status
          </h2>
          <div className="flex gap-2">
            {filters.map((filter) => (
              <FilterButton
                key={filter.value}
                filter={filter}
                isActive={filterStatus === filter.value}
                onClick={() => onFilterChange(filter.value)}
              />
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

/**
 * FilterButton - Individual filter button component
 */
const FilterButton = React.memo(({ filter, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? `${filter.colorClass} border` 
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
      }`}
    >
      {filter.label}
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

export default React.memo(ApplicationFilters);
