import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import { fetchRelatedJobs } from "@/redux/jobPostSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
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
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Heart,
  MessageCircle,
  CheckCircle,
  Users,
  Bookmark,
  ExternalLink,
  ArrowUpRight,
  Eye,
  GraduationCap,
  Star,
  AlertTriangle,
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
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    // Fetch related jobs when component mounts
    if (jobId) {
      dispatch(fetchRelatedJobs(jobId));
    }
  }, [jobId, dispatch]);

  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/${jobId}`, {
          withCredentials: true,
        });
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
          title: singleJob?.title || "",
          company: {
            name: singleJob?.company_id?.name || "",
          },
        },
      },
    });
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "d MMMM, yyyy");
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading job details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Error Loading Job
            </h3>
            <p className="text-red-600 mb-6">
              {typeof error === "object"
                ? error.message || "An error occurred"
                : error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!singleJob) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center p-8">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Job Details Available
            </h3>
            <p className="text-gray-600 mb-6">
              The job you're looking for might have been removed or doesn't
              exist.
            </p>
            <Link
              to="/find-job"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium inline-flex items-center"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse All Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    title,
    description,
    location,
    address,
    skills = [],
    experience,
    level,
    salary,
    gender,
    job_type,
    views,
    created_at,
    expires_at,
  } = singleJob;

  // Calculate days remaining for job expiration
  const daysRemaining = expires_at ? getDaysUntilExpiration(expires_at) : null;
  const expirationColor =
    daysRemaining && daysRemaining < 7 ? "text-red-600" : "text-green-600";

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </div>

      {/* Job Details Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center max-w-5xl mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center mb-4 md:mb-0">
              <img
                src={
                  singleJob?.company_id?.logo ||
                  "https://via.placeholder.com/64"
                }
                alt={`${singleJob?.company_id?.name || "Company"} logo`}
                className="max-h-12 max-w-12"
              />
            </div>
            <div className="md:ml-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {job_type?.replace("_", " ") || "Full Time"}
                </span>
                {level && (
                  <span className="px-3 py-1 bg-indigo-500/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    {level}
                  </span>
                )}
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center">
                  <Eye className="mr-1 h-3 w-3" />
                  {views || 0} views
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
              <div className="flex flex-wrap items-center text-sm text-blue-100 gap-y-2">
                <div className="flex items-center mr-4">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{singleJob?.company_id?.name || "Company Name"}</span>
                </div>
                <div className="flex items-center mr-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location || "Remote"}</span>
                </div>
                <div className="flex items-center mr-4">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>
                    {salary
                      ? `$${salary.toLocaleString()}`
                      : "Competitive salary"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Posted{" "}
                    {created_at
                      ? formatDistanceToNow(new Date(created_at), {
                          addSuffix: true,
                        })
                      : "recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            to="/find-job"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Find Job
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Job Details</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Content Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "description"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("responsibilities")}
                    className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "responsibilities"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Responsibilities
                  </button>
                  <button
                    onClick={() => setActiveTab("requirements")}
                    className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "requirements"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Requirements
                  </button>
                  <button
                    onClick={() => setActiveTab("benefits")}
                    className={`px-5 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "benefits"
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Benefits
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "description" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
                      Job Description
                    </h2>
                    <div
                      className="text-gray-600 space-y-4 prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}

                {activeTab === "responsibilities" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
                      Responsibilities
                    </h2>
                    <ul className="text-gray-600 space-y-3">
                      {[
                        "Develop and maintain web applications using React.js and related technologies",
                        "Write clean, maintainable, and efficient code",
                        "Collaborate with backend developers and designers",
                        "Implement responsive design and ensure cross-browser compatibility",
                        "Optimize applications for maximum speed and scalability",
                        "Participate in code reviews and contribute to team discussions",
                        "Stay updated on emerging technologies and industry trends",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="mr-2 h-5 w-5 text-blue-600" />
                      Requirements
                    </h2>
                    <ul className="text-gray-600 space-y-3">
                      {[
                        "3+ years of experience in frontend development",
                        "Strong proficiency in JavaScript, HTML, CSS, and React.js",
                        "Familiarity with RESTful APIs and modern frontend practices",
                        "Experience with responsive design and cross-browser compatibility",
                        "Knowledge of state management libraries (Redux, MobX, etc.)",
                        "Bachelor's degree in Computer Science or related field",
                        "Strong problem-solving skills and attention to detail",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5 mr-3">
                            <Star className="h-3 w-3 text-blue-600" />
                          </div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "benefits" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <Heart className="mr-2 h-5 w-5 text-blue-600" />
                      Benefits & Perks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Competitive salary",
                        "Flexible working hours",
                        "Remote work options",
                        "Health insurance",
                        "Professional development budget",
                        "Regular team events",
                        "Modern office space",
                        "Gym membership",
                      ].map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-start bg-blue-50 rounded-lg p-3"
                        >
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                          <span className="text-gray-800">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-600" />
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No specific skills listed for this position.
                  </p>
                )}
              </div>
            </div>

            {/* Share Job */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-4">
                    Share this job:
                  </span>
                  <div className="flex space-x-2">
                    <button className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      <Facebook className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors">
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button className="flex items-center justify-center h-9 w-9 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors">
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                  <Share2 className="h-4 w-4" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleApplyClick}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center font-medium shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Apply Now
                  <ArrowUpRight className="h-5 w-5 ml-1" />
                </button>

                <button
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center font-medium transition-colors ${
                    bookmarked
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                  }`}
                  onClick={toggleBookmark}
                >
                  {bookmarked ? (
                    <>
                      <Bookmark className="h-5 w-5 mr-2 fill-blue-700 text-blue-700" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-5 w-5 mr-2" />
                      Save Job
                    </>
                  )}
                </button>

                {daysRemaining !== null && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                    <p className="text-sm text-gray-500">
                      {daysRemaining > 0 ? (
                        <>
                          Expires in:{" "}
                          <span className={expirationColor + " font-medium"}>
                            {daysRemaining} days
                          </span>
                        </>
                      ) : (
                        <span className="text-red-600 font-medium">
                          This job has expired
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Job Overview
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Posted On
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {formatDate(created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Expires On
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {formatDate(expires_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Education
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      Bachelor's Degree
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">Salary</h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {salary ? `$${salary.toLocaleString()}` : "Competitive"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Location
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {location || "Remote"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Job Type
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {job_type?.replace("_", " ") || "Full Time"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-xs text-gray-500 uppercase">
                      Experience
                    </h4>
                    <div className="text-sm font-medium mt-1 text-gray-900">
                      {experience || "2-3 years"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start mb-5">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      singleJob?.company_id?.logo ||
                      "https://via.placeholder.com/48"
                    }
                    alt={`${singleJob?.company_id?.name || "Company"} logo`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3
                    className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(`/company-details/${singleJob?.company_id?._id}`)
                    }
                  >
                    {singleJob?.company_id?.name || "Company Name"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {singleJob?.company_id?.industry || "Technology"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600">Founded in:</span>
                  <span className="font-medium text-gray-900">2006</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600">Company size:</span>
                  <span className="font-medium text-gray-900">
                    100-500 Employees
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600">Phone:</span>
                  <a
                    href="tel:4085550120"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    (408) 555-0120
                  </a>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-600">Email:</span>
                  <a
                    href="mailto:careers@company.com"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    careers@company.com
                  </a>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-gray-600">Website:</span>
                  <a
                    href="https://company.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    company.com
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-gray-100">
                <button
                  onClick={() =>
                    navigate(`/company-details/${singleJob?.company_id?._id}`)
                  }
                  className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors font-medium"
                >
                  View Company Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Jobs */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
              Similar Jobs You Might Like
            </h2>
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
                  className="border border-blue-300 rounded-lg p-4 shadow-sm relative hover:shadow-md transition"
                >
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl">
                    HOT
                  </div>
                  <p className="text-gray-500 text-sm mb-1">
                    Posted 3 hours ago
                  </p>
                  <h2 className="text-lg font-semibold mb-2">{job.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded">
                      <img src={job.company_id.logo} alt="" />
                    </div>
                    <span className="font-medium">{job.company_id.name}</span>
                  </div>
                  <div className="mb-2 text-sm">
                    <a href="#" className="text-gray-700 underline">
                      {job.address}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>At office</span>
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
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

          <div className="text-center mt-8">
            <Link
              to="/find-job"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse All Jobs
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
