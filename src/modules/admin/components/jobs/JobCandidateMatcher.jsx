import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, File, X, BarChart2, CheckCircle, XCircle, 
  ChevronDown, Award, Clock, Briefcase, Zap, Check, AlertCircle
} from 'lucide-react';

const JobCandidateMatcher = ({ jobId, jobTitle }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('docx')) {
      setError('Please upload a PDF or DOCX file only');
      return;
    }
    
    setFile(file);
    setFileName(file.name);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`http://localhost:8000/match-cv-to-job/${jobId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process CV');
      }
      
      const data = await response.json();
      setMatchResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setMatchResult(null);
    setError('');
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500';
    if (score >= 50) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
          <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
          </div>
          CV Matcher
        </h2>
        <p className="text-gray-600">
          Evaluating candidate match for: <span className="text-indigo-600 font-medium">{jobTitle}</span>
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        {!matchResult ? (
          <motion.div
            key="upload-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all relative
                  ${dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
                  ${error ? 'border-rose-300 bg-rose-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-file-upload').click()}
              >
                <input
                  id="cv-file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <File className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div className="bg-white py-2 px-4 rounded-full shadow-sm border border-gray-100 flex items-center">
                      <span className="text-gray-700 font-medium mr-2">{fileName}</span>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setFileName('');
                        }}
                        className="text-gray-400 hover:text-rose-500 transition-colors bg-gray-100 rounded-full p-1 hover:bg-rose-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-indigo-500 mt-3 text-sm font-medium">CV ready for analysis</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-20 w-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-gray-700 font-medium">Drop your candidate's CV here or click to browse</p>
                    <p className="text-sm text-gray-500">
                      Upload CV to analyze match score for this job position
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">PDF</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">DOCX</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">DOC</span>
                    </div>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center"
                  >
                    <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg font-medium text-white shadow-sm flex items-center justify-center transition-all ${
                    isUploading || !file 
                      ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                      : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow'
                  }`}
                  disabled={isUploading || !file}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing CV...
                    </span>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Check Match Score
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Award className="h-5 w-5 text-indigo-600 mr-2" />
                  Match Results
                </h3>
                <button 
                  onClick={resetForm}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm"
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Check Another CV
                </button>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className={`h-32 w-32 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreGradient(matchResult.matching_scores.overall_score)}`}>
                      <div className="h-28 w-28 rounded-full bg-white flex items-center justify-center">
                        <div className={`text-4xl font-bold ${getScoreColor(matchResult.matching_scores.overall_score)}`}>
                          {matchResult.matching_scores.overall_score}%
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center border-2 border-white">
                      {matchResult.matching_scores.overall_score >= 70 ? 'A+' : 
                       matchResult.matching_scores.overall_score >= 60 ? 'B' : 
                       matchResult.matching_scores.overall_score >= 50 ? 'C' : 'D'}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h4 className="text-gray-500 uppercase tracking-wider text-xs font-semibold mb-1">Overall Match</h4>
                  <p className="text-gray-600 text-sm">
                    {matchResult.matching_scores.overall_score >= 70 
                      ? "Excellent match! This candidate is highly suitable for this position."
                      : matchResult.matching_scores.overall_score >= 50
                      ? "Good match. The candidate meets many of the job requirements."
                      : "Basic match. The candidate may need additional training or experience."}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className={`inline-flex h-12 w-12 rounded-full items-center justify-center ${getScoreBg(matchResult.matching_scores.skill_match)}`}>
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className={`text-2xl font-bold mt-2 ${getScoreColor(matchResult.matching_scores.skill_match)}`}>
                      {matchResult.matching_scores.skill_match}%
                    </div>
                    <div className="text-gray-500 text-sm mt-1 font-medium">Skills</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className={`inline-flex h-12 w-12 rounded-full items-center justify-center ${getScoreBg(matchResult.matching_scores.experience_match)}`}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className={`text-2xl font-bold mt-2 ${getScoreColor(matchResult.matching_scores.experience_match)}`}>
                      {matchResult.matching_scores.experience_match}%
                    </div>
                    <div className="text-gray-500 text-sm mt-1 font-medium">Experience</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className={`inline-flex h-12 w-12 rounded-full items-center justify-center ${getScoreBg(matchResult.matching_scores.industry_match)}`}>
                      <BarChart2 className="h-6 w-6" />
                    </div>
                    <div className={`text-2xl font-bold mt-2 ${getScoreColor(matchResult.matching_scores.industry_match)}`}>
                      {matchResult.matching_scores.industry_match}%
                    </div>
                    <div className="text-gray-500 text-sm mt-1 font-medium">Industry</div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                    Skills Analysis
                  </h4>
                  
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Matched Skills</div>
                      <div className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {matchResult.matching_details.matched_skills.length} matched
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                      {matchResult.matching_details.matched_skills.map((skill, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm flex items-center border border-emerald-200">
                          <Check className="mr-1 h-3.5 w-3.5" /> {skill}
                        </span>
                      ))}
                      {matchResult.matching_details.matched_skills.length === 0 && (
                        <span className="text-gray-500 text-sm flex items-center h-full w-full justify-center">No matched skills found</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">Missing Skills</div>
                      <div className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        {matchResult.matching_details.missing_skills.length} missing
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                      {matchResult.matching_details.missing_skills.map((skill, index) => (
                        <span key={index} className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-sm flex items-center border border-rose-200">
                          <X className="mr-1 h-3.5 w-3.5" /> {skill}
                        </span>
                      ))}
                      {matchResult.matching_details.missing_skills.length === 0 && (
                        <span className="text-gray-500 text-sm flex items-center h-full w-full justify-center">No missing skills</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                      Experience
                    </h4>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Candidate has</div>
                        <div className="text-xl font-bold text-indigo-600">
                          {matchResult.cv_info.experience} <span className="text-sm font-normal">years</span>
                        </div>
                      </div>
                      
                      <div className="h-10 border-r border-gray-300"></div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Job requires</div>
                        <div className="text-xl font-bold text-gray-700">
                          {matchResult.job_details.required_experience} <span className="text-sm font-normal">years</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {matchResult.cv_info.experience >= matchResult.job_details.required_experience 
                        ? <div className="flex items-center text-emerald-600"><CheckCircle className="h-4 w-4 mr-1.5" /> Candidate meets experience requirements</div>
                        : <div className="flex items-center text-amber-600"><AlertCircle className="h-4 w-4 mr-1.5" /> Candidate needs {matchResult.job_details.required_experience - matchResult.cv_info.experience} more years of experience</div>
                      }
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 text-indigo-600 mr-2" />
                      Industry Match
                    </h4>
                    
                    <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                      {matchResult.matching_details.matched_industries.map((industry, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm border border-blue-200">
                          {industry}
                        </span>
                      ))}
                      {matchResult.matching_details.matched_industries.length === 0 && (
                        <span className="text-gray-500 text-sm flex items-center h-full w-full justify-center">No industry match found</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg shadow-sm hover:shadow transition-all font-medium flex items-center"
                  onClick={() => {
                    // Add functionality to save this candidate to the job
                    alert("This will save the candidate to your job. Functionality to be implemented.");
                  }}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Save Candidate
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobCandidateMatcher;