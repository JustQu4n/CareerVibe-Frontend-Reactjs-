import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

/**
 * CompanyInfo Component
 * Hiển thị thông tin về công ty
 * 
 * @param {Object} props
 * @param {Object} props.company - Thông tin công ty
 */
const CompanyInfo = ({ company }) => {
  const navigate = useNavigate();

  if (!company) return null;

  const { _id, name, logo, industry } = company;

  // Hardcoded data - nên được lấy từ API trong tương lai
  const companyDetails = [
    { label: 'Founded in:', value: '2006' },
    { label: 'Company size:', value: '100-500 Employees' },
    { label: 'Phone:', value: '(408) 555-0120', isLink: true, href: 'tel:4085550120' },
    { label: 'Email:', value: 'careers@company.com', isLink: true, href: 'mailto:careers@company.com' },
    { label: 'Website:', value: 'company.com', isLink: true, href: 'https://company.com', external: true },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Company Header */}
      <div className="flex items-start mb-5">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={logo || 'https://via.placeholder.com/48'}
            alt={`${name || 'Company'} logo`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h3
            className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={() => navigate(`/company-details/${_id}`)}
          >
            {name || 'Company Name'}
          </h3>
          <p className="text-sm text-gray-500">{industry || 'Technology'}</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-3 text-sm">
        {companyDetails.map((detail, index) => (
          <CompanyDetailRow key={index} {...detail} />
        ))}
      </div>

      {/* View Company Profile Button */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <button
          onClick={() => navigate(`/company-details/${_id}`)}
          className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors font-medium"
        >
          View Company Profile
        </button>
      </div>
    </div>
  );
};

/**
 * CompanyDetailRow - Hiển thị một dòng thông tin công ty
 */
const CompanyDetailRow = React.memo(({ label, value, isLink, href, external }) => (
  <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600">{label}</span>
    {isLink ? (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
      >
        {value}
        {external && <ExternalLink className="h-3 w-3 ml-1" />}
      </a>
    ) : (
      <span className="font-medium text-gray-900">{value}</span>
    )}
  </div>
));

CompanyDetailRow.displayName = 'CompanyDetailRow';

export default React.memo(CompanyInfo);
