import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Building2, Globe, MapPin, Users, ArrowRight } from 'lucide-react';

/**
 * CompanyInfo Component - Modern company information card
 */
const CompanyInfo = ({ company }) => {
  const navigate = useNavigate();

  if (!company) return null;

  const { company_id, name, logo_url, industry, location, website, description } = company;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Company Header with Gradient */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="relative group">
            <div className="h-12 w-12 rounded-lg bg-white shadow-md flex items-center justify-center overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
              <img
                src={logo_url || 'https://via.placeholder.com/48'}
                alt={`${name || 'Company'} logo`}
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Building2 className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3
              className="text-base font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors mb-1 line-clamp-2"
              onClick={() => navigate(`/company-details/${company_id}`)}
            >
              {name || 'Company Name'}
            </h3>
            {industry && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-indigo-700 border border-indigo-100">
                <Users className="h-2.5 w-2.5" />
                {industry}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Company Description */}
        {description && (
          <div className="pb-3 border-b border-gray-100">
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{description}</p>
          </div>
        )}

        {/* Company Details */}
        <div className="space-y-2">
          {location && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 p-1.5 bg-purple-50 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">Location</p>
                <p className="text-xs font-semibold text-gray-900 truncate">{location}</p>
              </div>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 p-1.5 bg-blue-50 rounded-md">
                <Globe className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">Website</p>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 truncate"
                >
                  <span className="truncate">{website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* View Company Profile Button */}
        <button
          onClick={() => navigate(`/company-details/${company_id}`)}
          className="w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
        >
          <span>View Company Profile</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CompanyInfo);
