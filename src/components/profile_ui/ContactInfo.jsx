import React from 'react'
import { FaPhone, FaEnvelope, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const ContactInfo = () => {
  return (
    <div className="mt-6 text-sm text-gray-800">
    <h2 className="text-red-600 font-semibold text-lg mb-2">How to reach me:</h2>
    <p><strong>Home:</strong> 123-456-7890</p>
    <p><strong>Cell:</strong> 123-456-7890</p>
    <p className="flex items-center"><FaEnvelope className="mr-2" /> hello@reallygreat.com</p>
    <p className="flex items-center"><FaLinkedin className="mr-2" /> @reallygreatsite</p>
    <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> 123 Anywhere Street, Any City, State</p>
  </div>
  )
}

export default ContactInfo