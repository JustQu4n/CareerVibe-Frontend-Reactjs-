import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { Navbar } from "../navbar";
import Footer from "../components_lite/Footer";

const JobPostDetails = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/${jobId}`, {
          withCredentials: true,
        });
        console.log("API Response Get Detail Job:", res.data);
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);
  if (!singleJob) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
        {/* Header: Job Title, Status */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            {singleJob?.title}
          </h1>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              status === "active"
                ? "bg-green-200 text-green-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {singleJob?.status}
          </span>
        </div>

        {/* Job Info */}
        <div className="space-y-4">
          <div className="flex items-center text-gray-600 text-sm">
            <i className="fas fa-map-marker-alt mr-2 text-gray-400"></i>
            <p>{singleJob?.location}</p>
          </div>
          <div className="text-gray-600 text-sm">
            <span className="font-semibold">Address:</span> {singleJob?.address}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <i className="fas fa-briefcase mr-2 text-gray-400"></i>
            <p>{singleJob?.job_type}</p>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <i className="fas fa-users mr-2 text-gray-400"></i>
            <p>{singleJob?.gender}</p>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <i className="fas fa-calendar mr-2 text-gray-400"></i>
            <p>
              Expires at: {new Date(singleJob?.expires_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <i className="fas fa-calendar-check mr-2 text-gray-400"></i>
            <p>
              Created at: {new Date(singleJob?.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-900 text-lg space-y-4">
          <h2 className="text-xl font-semibold">Job Description</h2>
          <p>{singleJob?.description}</p>
        </div>

        {/* Skills */}
        <div className="text-gray-900 text-lg space-y-4">
          <h2 className="text-xl font-semibold">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {singleJob?.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Level & Salary */}
        <div className="flex justify-between text-gray-600 text-sm">
          <div>
            <span className="font-semibold">Experience:</span>{" "}
            {singleJob?.experience}
          </div>
          <div>
            <span className="font-semibold">Level:</span> {singleJob?.level}
          </div>
          {singleJob?.salary && (
            <div>
              <span className="font-semibold">Salary:</span> $
              {singleJob?.salary.toLocaleString()}
            </div>
          )}
        </div>

        {/* Views */}
        <div className="text-gray-600 text-sm">
          <span className="font-semibold">Views:</span> {singleJob?.views}
        </div>

        {/* Company Information */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Company Information
          </h2>
          <div>
            <span className="font-semibold">Company ID:</span>{" "}
            {singleJob?.company_id.name}
          </div>
          {/* You can fetch and display company details by ID if needed */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobPostDetails;
