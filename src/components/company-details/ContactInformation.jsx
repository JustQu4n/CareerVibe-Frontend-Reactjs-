import React from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

/**
 * ContactInformation Component
 * Hiển thị thông tin liên hệ của công ty
 * 
 * @param {Object} props
 * @param {Object} props.company - Company data
 */
const ContactInformation = ({ company }) => {
  const contactItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: company.email_domain,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Phone",
      value: "Contact via email",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "Website",
      value: company.email_domain?.split('@')[1] || "Not provided",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: company.address,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="w-full md:w-1/3">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 h-full">
        <ul className="space-y-4">
          {contactItems.map((item, index) => (
            <ContactItem key={index} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
};

/**
 * ContactItem - Individual contact info
 */
const ContactItem = React.memo(({ icon, label, value, color, bgColor }) => (
  <li className="flex items-start group">
    <div className={`w-10 h-10 rounded-full ${bgColor} ${color} flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-gray-500 mb-1">{label}</h4>
      <p className={`${color} text-sm break-words`}>{value}</p>
    </div>
  </li>
));

ContactItem.displayName = 'ContactItem';

export default React.memo(ContactInformation);
