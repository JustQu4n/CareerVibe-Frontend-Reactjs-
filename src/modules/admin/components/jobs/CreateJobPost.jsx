import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "@/redux/jobPostSlice";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";
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

export default function CreateJobPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.jobPosts);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    user_id: user?.user_id || "",
    company_id: user?.employer?.company?.company_id || "",
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
      await dispatch(createJobPost(formData)).unwrap();
      setSuccess(true);

      // Reset form
      setFormData({
        ...formData,
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
        expires_at: "",
        deadline: "",
      });

      // Navigate back after success
      setTimeout(() => {
        navigate('/admin/jobs');
      }, 2000);
    } catch (err) {
      // error handled by redux
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Briefcase },
    { number: 2, title: 'Details', icon: FileText },
    { number: 3, title: 'Description', icon: Tag }
  ];

  const jobTypes = [
    { value: 'full_time', label: 'Full Time', icon: Clock },
    { value: 'part_time', label: 'Part Time', icon: Clock },
    { value: 'contract', label: 'Contract', icon: FileText },
    { value: 'internship', label: 'Internship', icon: Award }
  ];

  const levels = [
    { value: 'Intern', label: 'Intern', color: 'blue' },
    { value: 'Junior', label: 'Junior', color: 'green' },
    { value: 'Middle', label: 'Middle', color: 'yellow' },
    { value: 'Senior', label: 'Senior', color: 'orange' },
    { value: 'Lead', label: 'Lead', color: 'red' },
    { value: 'Manager', label: 'Manager', color: 'purple' },
    { value: 'All', label: 'All', color: 'teal' }
  ];

  const genderOptions = [
    { value: 'any', label: 'Any Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Jobs</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Job Post</h1>
              <p className="text-gray-600">Fill in the details to post a new job opportunity</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10" />
              <div 
                className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.number;
                const isCurrent = currentStep === step.number;
                
                return (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg'
                          : 'bg-gray-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </motion.div>
                    <span className={`mt-2 text-sm font-medium ${
                      isCurrent ? 'text-blue-600' : isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-sm text-green-700">Job post created successfully. Redirecting...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              </div>

              {/* Job Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Job Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                   minLength={5}
                  disabled={loading}
                />
                {formData.title && formData.title.length < 5 && (
                  <p className="mt-1 text-sm text-red-600">Title must be at least 5 characters long</p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Job Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {jobTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, job_type: type.value })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.job_type === type.value
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-2 ${
                          formData.job_type === type.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.job_type === type.value ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Industry
                </label>
                <input
                  name="industries"
                  value={formData.industries}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Finance, Healthcare"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Location & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Location
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Ho Chi Minh City"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Full Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g., 123 Nguyen Hue St, District 1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
              </div>

              {/* Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Award className="w-4 h-4 text-blue-600" />
                  Experience Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {levels.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: lvl.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.level === lvl.value
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        formData.level === lvl.value ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {lvl.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Years of Experience
                </label>
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 3-5 years"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Required Skills
                  <span className="text-xs font-normal text-gray-500">(comma separated)</span>
                </label>
                <input
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="e.g., React, TypeScript, Node.js, AWS"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.filter(s => s).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Salary & Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Salary Range
                  </label>
                  <input
                    name="salary_range"
                    type="text"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g., $3000 - $5000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Expiration Date
                  </label>
                  <input
                    name="expires_at"
                    type="date"
                    value={formData.expires_at ? formData.expires_at.split("T")[0] : ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Application Deadline
                  </label>
                  <input
                    name="deadline"
                    type="date"
                    value={formData.deadline ? formData.deadline.split("T")[0] : ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.gender === option.value
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        formData.gender === option.value ? 'text-blue-600' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Description */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Describe the role, responsibilities, and requirements
                </label>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    disabled={loading}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "blockQuote",
                        "insertTable",
                        "undo",
                        "redo",
                      ],
                      placeholder: "Start typing your job description here...\n\nTip: Include responsibilities, qualifications, and what makes your company unique!",
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData({ ...formData, description: data });
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "min-height",
                          "300px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Job Requirements
                </label>
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.requirements}
                    disabled={loading}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "outdent",
                        "indent",
                        "|",
                        "undo",
                        "redo",
                      ],
                      placeholder: "List the requirements for this position...\n\nTip: Be specific about required qualifications, certifications, or experience!",
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFormData({ ...formData, requirements: data });
                    }}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "min-height",
                          "200px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                  />
                </div>
              </div>

              {/* Job Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Job Preview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{formData.title || 'Job Title'}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {formData.location || 'Location'}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formData.salary ? `$${parseInt(formData.salary).toLocaleString()}/year` : 'Salary'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {formData.level || 'Level'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1 || loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1 || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentStep >= step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                Next
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publish Job
                  </>
                )}
              </button>
            )}
          </div>
        </motion.form>
      </div>
    </div>
  );
}
