import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Check, 
  AlertTriangle, 
  Send,
  Briefcase,
  Building,
  Clock
} from "lucide-react";

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
  const [cvName, setCvName] = useState("");
  const [cvSize, setCvSize] = useState(0);
  const [cvProgress, setCvProgress] = useState(0);
  
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
    
    // Simulate scroll to top
    window.scrollTo(0, 0);
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
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setCvName(file.name);
      setCvSize(file.size);
      
      // Simulate upload progress
      setCvProgress(0);
      const interval = setInterval(() => {
        setCvProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }
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
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job
          </button>
          <img
            src="https://careervibe.com/logo.png" 
            alt="CareerVibe Logo"
            className="h-10"
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Application
          </h1>
          <p className="text-gray-600">
            Complete the form below to apply for this position
          </p>
        </div>

        {/* Job Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {jobData.title}
              </h2>
              <div className="flex items-center text-gray-600 mb-3">
                <Building className="h-4 w-4 mr-1" />
                <span>{jobData.company.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Full Time
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Senior Level
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Clock className="mr-1 h-3 w-3" />
                  Apply by June 30, 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <h3 className="text-xl font-bold">Application Form</h3>
            <p className="text-blue-100 text-sm mt-1">
              Fields marked with <span className="text-red-300">*</span> are required
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-green-800 font-semibold mb-1">Application Submitted!</h4>
                      <p className="text-green-700 text-sm">
                        Your application has been submitted successfully. Redirecting to your applications...
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-red-800 font-semibold mb-1">Application Error</h4>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CV Upload Section */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Resume/CV
              </h4>
              
              <div className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                cvFile ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-blue-50'
              }`}>
                {!cvFile ? (
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                      Drag and drop your CV here, or
                    </p>
                    <div className="relative inline-block">
                      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Browse Files
                      </button>
                      <input
                        type="file"
                        accept=".doc,.docx,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Supported formats: PDF, DOC, DOCX (max 3MB)
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center mr-3 border border-gray-200">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h5 className="font-medium text-gray-900">{cvName}</h5>
                            <p className="text-sm text-gray-500">{formatFileSize(cvSize)}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setCvFile(null)}
                            className="text-gray-500 hover:text-red-600 transition-colors text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${cvProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {cvProgress < 100 ? 'Uploading...' : 'Upload complete'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Personal Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      value={input.fullname}
                      onChange={changeEventHandler}
                      className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={input.phone}
                      onChange={changeEventHandler}
                      className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={input.location}
                      onChange={changeEventHandler}
                      className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="City, State/Province"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Cover Letter
                </h4>
                <span className="text-sm text-gray-500">Optional</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                Explain why you're a good fit for this position
              </p>
              
              <textarea
                value={coverLetter}
                onChange={handleCoverLetterChange}
                maxLength={500}
                rows={6}
                placeholder="Include specific examples of your relevant skills and experience that make you a strong candidate for this role..."
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              ></textarea>
              
              <div className="flex justify-end mt-2">
                <span className={`text-sm ${remainingChars < 50 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {remainingChars} characters remaining
                </span>
              </div>
            </div>

            {/* Terms and Submit */}
            <div>
              <div className="flex items-start mb-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I certify that all information provided is true and complete to the best of my knowledge. 
                  I understand that false information may disqualify me from consideration.
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Application
                  </>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                By clicking Submit, you acknowledge our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
              </p>
            </div>
          </form>
        </motion.div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            What happens next?
          </h4>
          <ol className="space-y-3 mt-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                1
              </div>
              <div className="text-gray-700">
                <strong>Application Review</strong>
                <p className="text-sm text-gray-600">
                  Our team will review your application and CV
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                2
              </div>
              <div className="text-gray-700">
                <strong>Initial Screening</strong>
                <p className="text-sm text-gray-600">
                  Qualified candidates will be contacted for a screening call
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold text-blue-800">
                3
              </div>
              <div className="text-gray-700">
                <strong>Interview Process</strong>
                <p className="text-sm text-gray-600">
                  Selected candidates will proceed to the interview stage
                </p>
              </div>
            </li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">
            The hiring process typically takes 2-3 weeks. You can check your application status
            in your <Link to="/jobseeker-applications" className="text-blue-600 hover:text-blue-800 font-medium">Applications Dashboard</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}