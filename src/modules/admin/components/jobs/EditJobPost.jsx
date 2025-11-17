import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateJobPostById } from "@/redux/jobPostSlice";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Award,
  Building2,
  FileText,
  Tag,
  Clock,
  TrendingUp,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function EditJobPost() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.jobPosts);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Find the job to edit - support both job_post_id and _id
  const jobToEdit = jobs.find(job => job.job_post_id === jobId || job._id === jobId);
  
  const [formData, setFormData] = useState({
    title: "",
    industries: "",
    description: "",
    requirements: "",
    location: "",
    address: "",
    skills: [],
    experience: "",
    level: "",
    salary_range: "",
    gender: "any",
    job_type: "full_time",
    status: "active",
    expires_at: "",
    deadline: "",
  });

  // Load job data when component mounts
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || "",
        industries: jobToEdit.industries || "",
        description: jobToEdit.description || "",
        requirements: jobToEdit.requirements || "",
        location: jobToEdit.location || "",
        address: jobToEdit.address || "",
        skills: jobToEdit.skills || [],
        experience: jobToEdit.experience || "",
        level: jobToEdit.level || "",
        salary_range: jobToEdit.salary_range || jobToEdit.salary || "",
        gender: jobToEdit.gender || "any",
        job_type: jobToEdit.job_type || "full_time",
        status: jobToEdit.status || "active",
        expires_at: jobToEdit.expires_at ? jobToEdit.expires_at.split('T')[0] : "",
        deadline: jobToEdit.deadline ? jobToEdit.deadline.split('T')[0] : "",
      });
    } else {
      toast.error("Job not found");
      navigate('/admin/jobs');
    }
  }, [jobToEdit, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((s) => s.trim());
    setFormData({ ...formData, skills });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);

    try {
      await dispatch(updateJobPostById({ 
        jobId: jobId, 
        updatedData: formData 
      })).unwrap();
      
      setSuccess(true);
      toast.success("Job post updated successfully!");

      // Navigate back after success
      setTimeout(() => {
        navigate('/admin/jobs');
      }, 2000);
    } catch (err) {
      toast.error(err || "Failed to update job post");
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Briefcase },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Description', icon: Tag }
  ];

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <React.Fragment key={step.number}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50'
                      : isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  <Icon className={`w-7 h-7 ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-400'
                  }`} />
                </motion.div>
                <p className={`mt-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </motion.div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 mb-8 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Backend Developer"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Industries *
          </label>
          <input
            type="text"
            name="industries"
            value={formData.industries}
            onChange={handleChange}
            placeholder="e.g., IT, Software Development"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Ho Chi Minh City"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g., 123 Nguyen Van Linh, District 7"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          Continue to Details
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Experience Required *
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., 3-5 years"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            Job Level *
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          >
            <option value="">Select Level</option>
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Middle">Middle</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Salary Range *
          </label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            placeholder="e.g., $3000 - $5000"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            Gender Requirement
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Job Type *
          </label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Tag className="w-4 h-4 text-blue-600" />
            Required Skills (comma-separated) *
          </label>
          <input
            type="text"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="e.g., React, NodeJS, PostgreSQL"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            required
          />
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Expiration Date
          </label>
          <input
            type="date"
            name="expires_at"
            value={formData.expires_at}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Application Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setCurrentStep(1)}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          Continue to Description
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Job Description *
        </label>
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData({ ...formData, description: data });
            }}
            config={{
              toolbar: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                'blockQuote', 'insertTable', '|',
                'undo', 'redo'
              ],
              placeholder: 'Describe the job role, responsibilities, and requirements in detail...'
            }}
          />
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Tag className="w-4 h-4 text-blue-600" />
          Job Requirements
        </label>
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
          <CKEditor
            editor={ClassicEditor}
            data={formData.requirements}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData({ ...formData, requirements: data });
            }}
            config={{
              toolbar: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo'
              ],
              placeholder: 'List the specific requirements for this position...'
            }}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setCurrentStep(2)}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Updating..." : "Update Job Post"}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Job List</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job Post</h1>
              <p className="text-gray-600">Update your job posting details</p>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-sm text-green-700">Your job post has been updated successfully.</p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit}>
            {renderStepIndicator()}
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
