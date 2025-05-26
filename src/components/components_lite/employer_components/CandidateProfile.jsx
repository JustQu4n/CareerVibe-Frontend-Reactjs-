import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationDetails } from "../../../redux/applicationSlice";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Mail, UserPlus } from 'lucide-react';


const CandidateProfile = () => {
    const { applicationId } = useParams();
    console.log("Application ID from params:", applicationId);
// const applicationId = "6833eee624658ecefbeaf1c3"; // Example applicationId, replace with actual ID from params
  const dispatch = useDispatch();
  const { 
    applicationDetail, 
    detailLoading, 
    detailError 
  } = useSelector((state) => state.applications);

  useEffect(() => {
    if (applicationId) {
      dispatch(fetchApplicationDetails(applicationId));
    }
  }, [applicationId, dispatch]);

  console.log("Application Detail:", applicationDetail);
  // Loading state
  if (detailLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 text-lg">{detailError}</p>
            <button 
              onClick={() => dispatch(fetchApplicationDetails(applicationId))}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no data yet
  if (!applicationDetail) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No candidate information available</p>
        </div>
      </div>
    );
  }

  // Extract candidate information
  const { job_seeker_id,job_post_id, cover_letter, cv_url } = applicationDetail;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 bg-slate-100 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10">
        <Navbar />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left Panel */}
      <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <img 
              src={job_seeker_id?.avatar || "/default-avatar.png"} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover"
            />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
                 {job_seeker_id?.full_name || "Candidate Name"}
            </h2>
            <p className="text-sm text-gray-500"> 
                {job_seeker_id?.title || "Candidate Title"}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              <Mail size={16} /> Send Mail
            </button>
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
              <UserPlus size={16} /> Hire Candidates
            </button>
          </div>
        </div>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Biography</h3>
          <p className="text-gray-600 text-large leading-relaxed">
           {job_seeker_id?.bio || "No biography provided"}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Cover Letter</h3>
          <p className="text-gray-600 text-large leading-relaxed">
             {cover_letter || "No cover letter provided"}
          </p>
        </section>

        <section>
          <h4 className="text-large font-semibold text-gray-700 mb-2">Follow me on Social Media</h4>
          <div className="flex gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition" />
            ))}
          </div>
        </section>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <section className="grid grid-cols-2 gap-4 text-large text-gray-600">
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">14 June, 2021</p>
          </div>
          <div>
            <p className="text-gray-500">Nationality</p>
            <p className="font-medium">Bangladesh</p>
          </div>
          <div>
            <p className="text-gray-500">Marital Status</p>
            <p className="font-medium">Single</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">Male</p>
          </div>
          <div>
            <p className="text-gray-500">Experience</p>
            <p className="font-medium"> {job_seeker_id?.experience}</p>
          </div>
          <div>
            <p className="text-gray-500">Education</p>
            <p className="font-medium">Master Degree</p>
          </div>
        </section>

        <section>
        <a href={`${cv_url.replace(/\\/g, "/")}`} target="_blank" rel="noopener noreferrer">  
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Download My Resume</h4>
          <button className="w-full flex justify-between items-center bg-blue-50 text-blue-600 font-medium px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
            <span className="truncate">{cv_url}</span>
         <span>PDF</span>
          </button>
          </a>
        </section>

        <section className="text-large text-gray-600 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h4>
          <p><span className="font-medium">Website:</span> www.estherhoward.com</p>
          <p><span className="font-medium">Location:</span> {job_post_id?.location}</p>
          <p><span className="font-medium">Address:</span>{job_seeker_id?.address}</p>
          <p><span className="font-medium">Phone:</span> {job_seeker_id?.phone}</p>
        </section>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default CandidateProfile;
