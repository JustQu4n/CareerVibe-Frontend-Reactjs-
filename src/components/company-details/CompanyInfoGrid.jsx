import React from 'react';
import { Calendar, Users, Briefcase, Building } from 'lucide-react';

/**
 * CompanyInfoGrid Component
 * Grid hiển thị thông tin tổng quan về công ty
 * 
 * @param {Object} props
 * @param {Object} props.company - Company data
 * @param {number} props.jobPostsCount - Số lượng job posts
 */
const CompanyInfoGrid = ({ company, jobPostsCount }) => {
  const infoItems = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      label: "Founded In",
      value: new Date(company.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      icon: <Building className="w-6 h-6 text-purple-600" />,
      label: "Organization Type",
      value: "Private Company",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      label: "Team Size",
      value: jobPostsCount > 5 ? "50+" : "10-50" + " Employees",
      bgColor: "from-green-50 to-green-100"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-orange-600" />,
      label: "Industry Types",
      value: "Technology & Innovation",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-6 md:mb-0">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Company Information</h3>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoItems.map((item, index) => (
            <InfoCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * InfoCard - Individual info item
 */
const InfoCard = React.memo(({ icon, label, value, bgColor }) => (
  <div className="flex items-start group">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-medium text-gray-500 uppercase mb-1">{label}</h4>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  </div>
));

InfoCard.displayName = 'InfoCard';

export default React.memo(CompanyInfoGrid);
