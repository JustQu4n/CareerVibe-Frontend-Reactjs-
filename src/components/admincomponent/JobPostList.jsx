// src/components/admincomponent/JobPostList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobPostsByEmployer } from "../../redux/jobPostSlice";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTable, FaList } from "react-icons/fa";
import EditJobModal from "./EditJobModal";
import {
  updateJobPostById,
} from "../../redux/jobPostSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const JobPostList = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' hoặc 'table'
  const { user } = useSelector((state) => state.auth);
  const employerId = user?.employer?.id;
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobPosts);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditModalOpen(true);
  };
  const handleUpdateJob = (updatedJob) => {
    dispatch(updateJobPostById({ jobId: updatedJob._id, updatedData: updatedJob }))
      .unwrap()
      .then(() => toast.success("Job updated successfully"))
      .catch((err) => toast.error(err || "Failed to update job"));
  };
  useEffect(() => {
    if (employerId) {
      dispatch(fetchJobPostsByEmployer(employerId));
    }
  }, [dispatch, employerId]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'table' : 'list');
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Job Posts</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center px-3 py-2 rounded-md transition ${
              viewMode === 'list' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaList className="mr-2" /> List View
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-2 rounded-md transition ${
              viewMode === 'table' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaTable className="mr-2" /> Table View
          </button>
        </div>
      </div>

      {/* List View */}
        {viewMode === 'list' && (
          <div className="grid gap-6">
            {jobs.map((job) => (
          <div
            key={job._id}
            className="p-6 bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
              <span
            className={`px-3 py-1 text-sm rounded-full ${
              job.status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
              >
            {job.status}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
            <FaMapMarkerAlt /> {job.location}
              </span>
              <span className="flex items-center gap-1">
            <FaMoneyBillWave /> ${job.salary?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
            <FaClock /> {job.experience}
              </span>
              <span>Level: {job.level}</span>
              <span>Type: {job.job_type?.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-gray-400">
            Posted on: {new Date(job.created_at).toLocaleDateString()}
              </p>
              
             <div className="flex gap-4">
               <Link
             to={`/details/${job._id}`}
             className="text-sm px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
               >
             View
               </Link>
               <button
             className="text-sm px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
             onClick={() => handleEditClick(job)}
               >
             Edit
               </button>
               <button
             className="text-sm px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
             onClick={() => handleEditClick(job)}
               >
             Delete
               </button>
               
             </div>
            </div>
          </div>
            ))}
            
            {jobs?.length === 0 && (
          <p className="text-gray-500 text-center py-6">No job posts found.</p>
            )}
          </div>
        )}

        {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Level</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Salary</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Views</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expires</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((job, index) => (
                <tr key={job._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 text-sm text-blue-700 font-medium">{job.title}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{job.location}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{job.level}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">${job.salary?.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm capitalize text-gray-600">{job.job_type}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{job.views || 0}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {job.expires_at ? new Date(job.expires_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <button className="text-sm px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"  onClick={() => handleEditClick(job)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jobs?.length === 0 && (
            <p className="text-gray-500 text-center py-6">No job posts found.</p>
          )}
        </div>
      )}
      <EditJobModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        job={selectedJob}
        onSubmit={handleUpdateJob}
      />
    </div>
  );
};

export default JobPostList;