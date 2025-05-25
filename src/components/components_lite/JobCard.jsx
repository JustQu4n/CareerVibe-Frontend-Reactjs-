import React from 'react';
import { Briefcase, Clock, MapPin, Bookmark, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, mode }) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(`/view-job-detail/${job._id}`)}
            className={`flex ${mode === 'grid' ? 'flex-col' : 'flex-row justify-between'} items-start p-6 rounded-lg shadow-md border transition-transform transform  ${
                job.highlight ? 'bg-gradient-to-r from-green-50 to-blue-50' : 'bg-white'
            } ${job.featured ? 'border-yellow-400' : 'border-gray-200'} hover:bg-amber-50`}
        >
            <div className={`flex ${mode === 'grid' ? 'flex-col items-start' : 'flex-row items-center space-x-4'}`}>
                <img
                    src={job.company_id.logo}
                    alt={job.company}
                    className="w-20 h-20 rounded-lg border-gray-200"
                />
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-gray-500" /> {job.location} • {job.salary}
                    </p>
                    <div className="flex space-x-2 mt-2">
                        {job.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                                Featured
                            </span>
                        )}
                        {job.job_type && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                {job.job_type}
                            </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1 text-gray-400" /> {job.createdAt}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <button className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md">
                    Apply Now <ArrowRight size={18} />
                </button>
                <Bookmark
                    size={22}
                    className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                />
            </div>
        </div>
    );
};

export default JobCard;