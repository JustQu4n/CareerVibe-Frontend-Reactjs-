import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import { fetchRelatedJobs } from "@/redux/jobPostSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { format } from "date-fns";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Building,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight,
  User,
  BookOpen,
  BookMarked,
} from "lucide-react";

export default function JobPostViewDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const jobId = params.id;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const { relatedJobs, loadingRelated } = useSelector(
    (store) => store.jobPosts
  );

  useEffect(() => {
    // Fetch related jobs when component mounts
    if (jobId) {
      dispatch(fetchRelatedJobs(jobId));
    }
  }, [jobId, dispatch]);

  console.log("Related Jobs:", relatedJobs);
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

  const handleApplyClick = () => {
    navigate(`/apply/${jobId}`, {
      state: {
        jobData: {
          title: title,
          company: {
            name: singleJob.company_id.name,
          },
        },
      },
    });
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-500 font-medium">
          {typeof error === "object"
            ? error.message || "An error occurred"
            : error}
        </p>
        <button
          onClick={() => dispatch(fetchJobseekerApplications(jobseekerId))}
          className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
        >
          Try Again
        </button>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <a href="/" className="text-gray-500 hover:text-blue-600">
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/find-job" className="text-gray-500 hover:text-blue-600">
              Find Job
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <a
              href="/graphics-design"
              className="text-gray-500 hover:text-blue-600"
            >
              Graphics & Design
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Job Details</span>
          </div>
        </div>
      </div>
      {/* Job Details Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-lg  flex items-center justify-center">
                    <img
                      src={singleJob?.company_id?.logo}
                      alt="Instagram logo"
                      className="h-8 w-8"
                    />
                  </div>
                </div>

                <div className="md:ml-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {title}
                    </h1>

                    <div className="flex items-center mt-2 md:mt-0">
                      <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full mr-3">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                        Full Time
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                    <a
                      href="https://instagram.com"
                      className="flex items-center mr-6 mb-2"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      <span>https://instagram.com</span>
                    </a>
                    <div className="flex items-center mr-6 mb-2">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>(408) 555-0120</span>
                    </div>
                    <a
                      href="mailto:career@instagram.com"
                      className="flex items-center mb-2"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      <span>career@instagram.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>

              <div
                className="text-gray-600 space-y-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Responsibilities
              </h2>

              <ul className="text-gray-600 space-y-3 list-disc pl-5">
                <li>Quisque semper gravida est at consectetur.</li>
                <li>
                  Curabitur blandit lorem vel, vitae pretium leo placerat eget.
                </li>
                <li>Morbi mattis in ipsum ac tempus.</li>
                <li>
                  Curabitur eu vehicula libero. Vestibulum sed purus
                  ullamcorper, lobortis lectus nec.
                </li>
                <li>
                  vulputate turpis. Quisque ante odio, iaculis a porttitor sit
                  amet.
                </li>
                <li>lobortis vel lectus. Nulla sit risus ut diam.</li>
                <li>
                  commodo feugiat. Nullam laoreet, diam placerat dapibus
                  tincidunt.
                </li>
                <li>
                  odio metus posuere lorem, id condimentum erat velit nec neque.
                </li>
                <li>dui sodales ut. Curabitur tempus augue.</li>
              </ul>
            </div>

            {/* Share Job */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Share this job:</span>

                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm">
                    <span className="mr-1">Facebook</span>
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-blue-400 text-white rounded-md text-sm">
                    <span className="mr-1">Twitter</span>
                  </button>
                  <button className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md text-sm">
                    <span className="mr-1">Pinterest</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col space-y-3">
                <button
                  className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
                    bookmarked
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={toggleBookmark}
                >
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                  onClick={handleApplyClick}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-md flex items-center justify-center"
                >
                  Apply Now
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>

                <div className="text-sm text-gray-500 text-center mt-2">
                  Job expires in:{" "}
                  <span className="text-red-600">June 30, 2021</span>
                </div>
              </div>
            </div>

            {/* Job Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Job Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Job Posted
                    </h4>
                    <div className="text-sm font-medium mt-1">
                      14 June, 2021
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Job Expire In
                    </h4>
                    <div className="text-sm font-medium mt-1">
                      14 July, 2021
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Education
                    </h4>
                    <div className="text-sm font-medium mt-1">Graduation</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">Salary</h4>
                    <div className="text-sm font-medium mt-1">
                      $5Ok-80k/month
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Location
                    </h4>
                    <div className="text-sm font-medium mt-1">{location}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Job Type
                    </h4>
                    <div className="text-sm font-medium mt-1">{job_type}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-md">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Experience
                    </h4>
                    <div className="text-sm font-medium mt-1">{experience}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <img
                    src={singleJob?.company_id?.logo}
                    alt="Instagram logo"
                    className="h-6 w-6"
                  />
                </div>
                <div className="ml-3">
                  <h3
                    className="text-lg font-bold text-gray-900 cursor-pointer"
                    onClick={() =>
                      navigate(`/company-details/${singleJob?.company_id?._id}`)
                    }
                  >
                    {singleJob?.company_id?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Social networking service
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Founded in:</span>
                  <span className="font-medium">March 21, 2006</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Organization type:</span>
                  <span className="font-medium">Private Company</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Company size:</span>
                  <span className="font-medium">120-300 Employees</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">(408) 555-0120</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">twitter@gmail.com</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium">https://twitter.com</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-blue-400 text-white rounded"
                >
                  t
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded"
                >
                  i
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded"
                >
                  y
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Jobs */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Related Jobs</h2>
            {/* Buttons... */}
          </div>

          {loadingRelated ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.map((job) => (
                <div
                  key={job._id}
                  onClick={() => navigate(`/view-job-detail/${job._id}`)}
                  className="border border-red-300 rounded-lg p-4 bg-white shadow-sm relative hover:shadow-md transition"
                >
                  {/* HOT Badge */}
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                    HOT
                  </div>

                  {/* Time posted */}
                  <p className="text-gray-500 text-sm mb-1">
                    Posted 3 hours ago
                  </p>

                  {/* Job title */}
                  <h2 className="text-lg font-semibold mb-2">{job.title}</h2>

                  {/* Company */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
                      <img src={job.company_id.logo} alt="" />
                    </div>
                    <span className="font-medium">{job.company_id.name}</span>
                  </div>

                  {/* Position */}
                  <div className="mb-2 text-sm">
                    <a href="#" className="text-gray-700 underline">
                      {job.address}
                    </a>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>At office</span>
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>

                  {/* Tags */}
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
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
