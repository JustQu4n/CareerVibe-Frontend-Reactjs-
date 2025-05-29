import React from "react";
import { Briefcase, Clock, MapPin, Bookmark, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, mode }) => {
    const navigate = useNavigate();
    const isGrid = mode === "grid";

    return (
        <div
            onClick={() => navigate(`/view-job-detail/${job._id}`)}
            className={`group relative flex ${
                isGrid
                    ? "flex-col items-center text-center max-w-xs mx-auto bg-white/90"
                    : "flex-row items-center justify-between"
            } p-7 rounded-3xl shadow-xl border-2 transition-all duration-200 cursor-pointer ${
                job.highlight
                    ? "bg-gradient-to-br from-green-50 via-blue-50 to-white"
                    : "bg-white"
            } ${
                job.featured ? "border-yellow-400" : "border-gray-100"
            } hover:shadow-2xl hover:scale-[1.03]`}
            style={{
                minHeight: isGrid ? 420 : 160,
                background:
                    !job.highlight && !job.featured && !isGrid
                        ? "linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)"
                        : undefined,
            }}
        >
            {/* Company Logo */}
            <div
                className={`flex-shrink-0 ${
                    isGrid ? "mb-6" : "mr-8"
                } bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-3 transition-all duration-200 group-hover:shadow-blue-100`}
            >
                <img
                    src={job.company_id?.logo}
                    alt={job.company}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-blue-50"
                />
            </div>
            {/* Job Info */}
            <div
                className={`flex-1 flex flex-col gap-3 ${
                    isGrid ? "items-center" : "items-start"
                }`}
            >
                <div className={`flex items-center gap-2 ${isGrid ? "justify-center" : ""}`}>
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors drop-shadow-sm">
                        {job.title}
                    </h2>
                    {job.featured && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold border border-yellow-200 animate-pulse shadow">
                            Featured
                        </span>
                    )}
                </div>
                <div
                    className={`flex items-center gap-3 text-sm text-gray-500 ${
                        isGrid ? "justify-center" : ""
                    }`}
                >
                    <Briefcase size={16} className="text-blue-400" />
                    <span className="font-medium">{job.level}</span>
                    <MapPin size={16} className="text-green-400" />
                    <span>{job.location}</span>
                </div>
                <div
                    className={`flex flex-wrap items-center gap-2 mt-2 ${
                        isGrid ? "justify-center" : ""
                    }`}
                >
                    {job.job_type && (
                        <span className="bg-blue-100/60 text-blue-700 px-4 py-1 rounded-full text-xs font-medium border border-blue-200 shadow-sm">
                            {job.job_type === "full_time"
                                ? "Full-time"
                                : job.job_type === "part_time"
                                ? "Part-time"
                                : job.job_type}
                        </span>
                    )}
                    {job.salary && (
                        <span className="bg-green-100/60 text-green-700 px-4 py-1 rounded-full text-xs font-medium border border-green-200 shadow-sm">
                            {job.status}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={14} /> {job.createdAt}
                    </span>
                </div>
            </div>
            {/* Actions */}
            <div
                className={`flex flex-col items-end gap-3 ${
                    isGrid ? "absolute right-6 top-6" : "ml-8"
                }`}
                onClick={e => e.stopPropagation()}
            >
                <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm px-7 py-2 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 flex items-center gap-2 transition-all font-semibold">
                    Apply Now <ArrowRight size={18} />
                </button>
                <Bookmark
                    size={22}
                    className="text-gray-300 hover:text-blue-600 cursor-pointer transition-colors"
                />
            </div>
            {/* Decorative border for highlight */}
            {job.highlight && (
                <span className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r from-green-400 via-blue-400 to-blue-200" />
            )}
            {/* Subtle shadow for grid mode */}
            {isGrid && (
                <span className="absolute inset-0 rounded-3xl pointer-events-none shadow-[0_8px_32px_0_rgba(0,60,255,0.07)]" />
            )}
        </div>
    );
};

export default JobCard;
