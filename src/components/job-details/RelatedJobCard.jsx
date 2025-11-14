import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin } from 'lucide-react';

/**
 * RelatedJobCard Component
 * Card hiển thị job liên quan
 * 
 * @param {Object} props
 * @param {Object} props.job - Thông tin job
 */
const RelatedJobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/view-job-detail/${job._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-blue-300 rounded-lg p-4 shadow-sm relative hover:shadow-md transition cursor-pointer"
    >
      {/* HOT Badge */}
      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
        HOT
      </div>

      {/* Posted Time */}
      <p className="text-gray-500 text-sm mb-1">Posted 3 hours ago</p>

      {/* Job Title */}
      <h2 className="text-lg font-semibold mb-2">{job.title}</h2>

      {/* Company Info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
          <img src={job.company_id.logo} alt={job.company_id.name} />
        </div>
        <span className="font-medium">{job.company_id.name}</span>
      </div>

      {/* Address */}
      <div className="mb-2 text-sm">
        <span className="text-gray-700 underline">{job.address}</span>
      </div>

      {/* Location Info */}
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
        <Briefcase className="w-4 h-4" />
        <span>At office</span>
        <MapPin className="w-4 h-4" />
        <span>{job.location}</span>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {job.skills.map((tag) => (
          <span
            key={tag}
            className="bg-gray-100 px-3 py-1 text-sm rounded-full text-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default React.memo(RelatedJobCard);
