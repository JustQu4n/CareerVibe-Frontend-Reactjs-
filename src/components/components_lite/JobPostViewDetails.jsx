import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { format } from "date-fns";
import Navbar from "./Navbar";

const JobPostViewDetails = () => {
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

  if (!singleJob) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No job detail available.</p>
      </div>
    );
  }

  const {
    title,
    description,
    location,
    address,
    skills,
    experience,
    level,
    salary,
    gender,
    job_type,
    views,
    created_at,
    expires_at,
  } = singleJob;

  // ✨ Mock data tương tự - bạn thay bằng dữ liệu thực nếu có
  const similarJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      salary: 2000000,
      experience: 2,
      location: "Ho Chi Minh",
    },
    {
      id: 2,
      title: "Fullstack Engineer",
      salary: 3000000,
      experience: 3,
      location: "Ha Noi",
    },
    {
      id: 3,
      title: "Mobile Developer",
      salary: 2500000,
      experience: 1,
      location: "Da Nang",
    },
  ];

  return (
   <div>
    <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
     <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Job Title */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <span className="mr-4">{location}</span>
          <span className="mr-4">Views: {views}</span>
          <span>Created at: {format(new Date(created_at), "dd/MM/yyyy")}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-md p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Thông tin chung</h2>
            <div className="text-sm space-y-2">
              <p>
                <strong>Hình thức:</strong> {job_type}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {address}
              </p>
              <p>
                <strong>Kinh nghiệm:</strong> {experience}+ năm
              </p>
              <p>
                <strong>Cấp bậc:</strong> {level}
              </p>
              <p>
                <strong>Mức lương:</strong> {salary.toLocaleString()} VND
              </p>
              <p>
                <strong>Giới tính:</strong>{" "}
                {gender === "any" ? "Không yêu cầu" : gender}
              </p>
              <p>
                <strong>Hạn nộp:</strong>{" "}
                {format(new Date(expires_at), "dd/MM/yyyy")}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Kỹ năng yêu cầu</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Mô tả công việc
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl text-lg w-full">
              Ứng tuyển ngay
            </button>
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Các công việc tương tự
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Lương:</strong> {job.salary.toLocaleString()} VND
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <strong>Kinh nghiệm:</strong> {job.experience}+ năm
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <strong>Địa điểm:</strong> {job.location}
              </p>
              <button className="mt-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg w-full">
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
   </div>
  );
};

export default JobPostViewDetails;
