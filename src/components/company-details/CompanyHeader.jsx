import React from 'react';
import { ChevronRight, Heart, Loader2 } from 'lucide-react';
import useCompanyFollow from '@/hooks/useCompanyFollow';

/**
 * CompanyHeader Component
 * Header với logo, button follow và button view positions
 * 
 * @param {Object} props
 * @param {Object} props.company - Company data
 * @param {Array} props.jobPosts - Job posts array
 * @param {Function} props.onViewPositions - Callback khi click view positions
 */
const CompanyHeader = ({ company = {}, jobPosts, onViewPositions }) => {
  const companyId = company?.company_id || company?.id || null;
  const { isFollowed, loading, toggleFollow } = useCompanyFollow(companyId);
  const coverUrl = company?.cover_url || company?.cover || company?.cover_image || null;

  return (
    <div>
      {coverUrl && (
        <div className="w-full h-40 md:h-56 rounded-xl overflow-hidden mb-4">
          <img src={coverUrl} alt={`${company.name} cover`} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center">
        <div className="w-20 h-20 rounded-xl flex items-center justify-center overflow-hidden mr-4 shadow-lg">
          {company.logo_url ? (
            <img src={company.logo_url} alt={company.name || 'Company'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-bold">
              {(company.name && company.name.charAt ? company.name.charAt(0) : '')}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{company.name || 'Company'}</h2>
          <p className="text-gray-600">{company.industry || 'Technology'}</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
        {/* Follow Button */}
        <button 
          onClick={toggleFollow}
          disabled={loading}
          className={`py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 font-semibold min-w-[140px] ${
            isFollowed 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300' 
              : 'bg-gradient-to-r from-pink-500 to-red-500 text-white hover:shadow-xl'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Heart className={`w-5 h-5 mr-2 ${isFollowed ? 'fill-current' : ''}`} />
              {isFollowed ? 'Following' : 'Follow'}
            </>
          )}
        </button>
        
        {/* View Positions Button */}
        <button 
          onClick={onViewPositions}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl flex items-center hover:shadow-xl transition-all duration-300 font-semibold"
        >
          View Open Positions
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
    </div>
  );
};

export default React.memo(CompanyHeader);
