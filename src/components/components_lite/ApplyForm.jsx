import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ApplyForm() {
  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [remainingChars, setRemainingChars] = useState(500);
  
  const [input, setInput] = useState({
    fullname: user?.jobseeker?.full_name || "",
    phone: user?.jobseeker?.phone || "",
    location: user?.jobseeker?.location || "",
  });
  
  const [jobData, setJobData] = useState({
    title: "",
    company: { name: "" }
  });
  
  useEffect(() => {
    if (location.state && location.state.jobData) {
      setJobData(location.state.jobData);
    } else if (singleJob) {
      setJobData({
        title: singleJob.title,
        company: { name: singleJob.company_id?.name || "Company" }
      });
    }
  }, [id, location.state, singleJob]);
  
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  
  const handleCoverLetterChange = (e) => {
    const text = e.target.value;
    setCoverLetter(text);
    setRemainingChars(500 - text.length);
  };
  
  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cvFile) {
      setError("Please upload your CV");
      return;
    }
    
    if (!user?.jobseeker?.id) {
      setError("You must be logged in as a job seeker to apply");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("job_post_id", id);
    formData.append("job_seeker_id", user.jobseeker.id);
    formData.append("cover_letter", coverLetter);
    formData.append("cv", cvFile);

    // Debugging FormData content
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:5000/api/jobseeker/applications/submit", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` 
          },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/jobseeker-applications");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Application submission error:", err);
      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Please contact support.");
      } else {
        setError(err.response?.data?.message || "Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          Back
        </button>
        <img
          src="https://media.licdn.com/dms/image/v2/C561BAQGnoaNjsBLsQg/company-background_10000/company-background_10000/0/1590217283917/jobseeker_hub_cover?e=2147483647&v=beta&t=izGlJYuYMvsHNLdu5MgxzoZzZotna4k65zE2r2yTjD0"
          alt="Logo"
          className="w-32 mx-auto"
        />
      </div>
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {jobData.title} at {jobData.company.name}
          </h2>
          
          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Application submitted successfully! Redirecting to your applications...
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Upload CV */}
          <div className="mb-6 border border-red-300 p-4 rounded-md bg-red-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your CV <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={handleFileChange}
                className="file:bg-red-600 file:text-white file:py-2 file:px-4 file:rounded-md file:border-none"
                required
              />
              <p className="text-sm text-gray-500">
                Please upload a .doc, .docx, or .pdf file, max 3MB, no password
                protection
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={input.phone}
                onChange={changeEventHandler}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Cover Letter <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={handleCoverLetterChange}
              maxLength={500}
              rows={4}
              placeholder="Details and specific examples will make your application stronger..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 resize-none focus:outline-none focus:ring-red-500 focus:border-red-500"
            ></textarea>
            <p className="text-sm text-gray-400 text-right mt-1">
              {remainingChars} of 500 characters remaining
            </p>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-semibold py-3 rounded-md transition`}
          >
            {loading ? 'Submitting...' : 'Send my CV'}
          </button>
        </form>
      </div>
    </div>
  );
}