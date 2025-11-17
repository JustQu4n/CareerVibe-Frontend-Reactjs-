import React from "react";
import { Briefcase, Clock, MapPin, Bookmark, ArrowRight, DollarSign, Eye, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job, mode }) => {
    const navigate = useNavigate();
    const isGrid = mode === "grid";

    return (
        <div
            onClick={() => navigate(`/view-job-detail/${job.job_post_id}`)}
            className={`group relative flex ${
                isGrid
                    ? "flex-col h-full"
                    : "flex-row items-center justify-between"
            } p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                job.highlight
                    ? "bg-gradient-to-br from-green-50 via-blue-50 to-white"
                    : "bg-white"
            } ${
                job.status === 'active' ? "border-green-200" : "border-gray-100"
            } hover:shadow-xl`}
            style={{
                minHeight: isGrid ? "400px" : "160px",
                background:
                    !job.highlight && job.status !== 'active' && !isGrid
                        ? "linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)"
                        : undefined,
            }}
        >
            {/* Company Logo */}
            <div
                className={`flex-shrink-0 ${
                    isGrid ? "mb-4" : "mr-6"
                } bg-white rounded-xl shadow-md border border-gray-100 p-2 transition-all duration-200 group-hover:shadow-lg group-hover:border-blue-200`}
            >
                <img
                    src={job.company?.logo_url || 'https://via.placeholder.com/80'}
                    alt={job.company?.name}
                    className={`${isGrid ? "w-16 h-16" : "w-20 h-20"} rounded-lg object-contain`}
                />
            </div>

            {/* Job Info */}
            <div
                className={`flex-1 flex flex-col items-start ${
                    isGrid ? "space-y-3" : "space-y-2"
                }`}
            >
                {/* Title and Status */}
                <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`${isGrid ? "text-lg" : "text-xl"} font-bold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2`}>
                        {job.title}
                    </h2>
                    {job.status === 'active' && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold border border-green-200">
                            Active
                        </span>
                    )}
                </div>
                
                {/* Company Name */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="font-medium line-clamp-1">{job.company?.name}</span>
                </div>

                {/* Location and Salary */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-green-500 flex-shrink-0" />
                        <span className="line-clamp-1">{job.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <DollarSign size={16} className="text-emerald-500 flex-shrink-0" />
                        <span className="font-medium line-clamp-1">{job.salary_range || 'Competitive'}</span>
                    </div>
                </div>

                {/* Tags and Meta Info */}
                <div className="flex flex-wrap items-center gap-2">
                    {job.employment_type && (
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {job.employment_type === "full-time"
                                ? "Full-time"
                                : job.employment_type === "part-time"
                                ? "Part-time"
                                : job.employment_type === "contract"
                                ? "Contract"
                                : job.employment_type}
                        </span>
                    )}
                    {job.company?.industry && (
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
                            {job.company.industry}
                        </span>
                    )}
                </div>

                {/* Views and Time - Only show in grid mode or at bottom in list mode */}
                {isGrid && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto pt-2">
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {job.views_count || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> 
                            {job.created_at 
                                ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
                                : 'Recently'}
                        </span>
                    </div>
                )}
                
                {!isGrid && (
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <Eye size={14} /> {job.views_count || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> 
                            {job.created_at 
                                ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true })
                                : 'Recently'}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div
                className={`flex ${isGrid ? "flex-col w-full mt-4 gap-2" : "flex-col ml-6 gap-3"} items-center`}
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={() => navigate(`/apply/${job.job_post_id}`)}
                    className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 transition-all ${
                        isGrid ? "w-full" : ""
                    }`}
                >
                    Apply Now <ArrowRight size={16} />
                </button>
                {!isGrid && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bookmark
                            size={20}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                        />
                    </button>
                )}
            </div>
            
            {/* Decorative border for active status */}
            {job.status === 'active' && (
                <span className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-400" />
            )}
        </div>
    );
};

export default JobCard;
