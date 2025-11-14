import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

/**
 * PersonalInfoSection Component
 * Form fields cho personal information
 * 
 * @param {Object} props
 * @param {Object} props.input - Input values
 * @param {Function} props.onChange - Change handler
 */
const PersonalInfoSection = ({ input, onChange }) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <User className="mr-2 h-5 w-5 text-blue-600" />
        Personal Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={onChange}
              className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={input.phone}
              onChange={onChange}
              className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              value={input.location}
              onChange={onChange}
              className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="City, State/Province"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PersonalInfoSection);
