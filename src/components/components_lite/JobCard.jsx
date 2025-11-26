import React from "react";
import { Clock, MapPin, Bookmark, ArrowRight, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const handleQuickView = (e) => {
        e.stopPropagation();
        navigate(`/view-job-detail/${job.job_post_id}`);
    };

    const handleApply = (e) => {
        e.stopPropagation();
        navigate(`/apply/${job.job_post_id}`);
    };

    return (
        <div className="w-full bg-white rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {/* Top section - Company logo, badges, title, salary, status */}
            <div className="p-4 md:p-5 border-b border-gray-100">
                <div className="flex gap-4 items-start">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-blue-100 bg-white p-2 flex items-center justify-center">
                            <img
                                src={job.company?.logo_url || 'https://via.placeholder.com/80'}
                                alt={job.company?.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 flex flex-col gap-2">
                        {/* Badges row */}
                        <div className="flex flex-wrap gap-2 items-center">
                            {job.highlight && (
                                <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                                    <span>📌</span> Tìm mới
                                </span>
                            )}
                            {job.status === 'active' && (
                                <span className="inline-flex items-center gap-1 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                                    <span>🔥</span> Nổi bật
                                </span>
                            )}
                        </div>

                        {/* Job Title */}
                        <h2 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight">
                            {job.title}
                        </h2>

                        {/* Salary and status */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-lg font-bold text-green-600">
                                {job.salary_range || 'Thỏa thuận'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-semibold">
                                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                Thỏa thuận
                            </span>
                        </div>

                        {/* Company info */}
                        <div className="flex items-center gap-2">
                            <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
                                Pro
                            </span>
                            <span className="font-medium text-sm text-gray-700">{job.company?.name}</span>
                        </div>

                        {/* Location and time */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-blue-500" />
                                <span>{job.location || 'Không xác định'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} className="text-gray-400" />
                                <span>
                                    {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: false }) : 'Gần đây'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Quick view link and status */}
                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={handleQuickView}
                            className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                        >
                            Xem nhanh
                            <ChevronRight size={16} />
                        </button>
                        {job.status === 'active' && (
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                Thỏa thuận
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom section - Job details and actions */}
            <div className="p-4 md:p-5 bg-gray-50">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Job details */}
                    <div className="flex-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        {job.employment_type && (
                            <span>{job.employment_type === 'full-time' ? 'Toàn thời gian' : job.employment_type}</span>
                        )}
                        {job.company?.industry && (
                            <span className="text-gray-400">•</span>
                        )}
                        {job.company?.industry && (
                            <span>{job.company.industry}</span>
                        )}
                        {job.category?.name && (
                            <>
                                <span className="text-gray-400">•</span>
                                <span>{job.category.name}</span>
                            </>
                        )}
                        {job.views_count && (
                            <>
                                <span className="text-gray-400">+</span>
                                <span>{job.views_count}</span>
                            </>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleApply}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                            Ứng tuyển
                        </button>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <Bookmark size={18} className="text-gray-500 hover:text-blue-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
