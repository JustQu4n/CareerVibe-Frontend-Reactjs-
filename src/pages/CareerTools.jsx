/**
 * Career Tools Page
 * Upload CV and get job matching + CV analysis
 */

import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/components_lite/Footer';
import apiClient from '@/api/client';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CareerTools = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'matches', 'analysis'
  const [analysisView, setAnalysisView] = useState('basic'); // 'basic' or 'ai'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUploadAndMatch = async () => {
    if (!file) {
      toast.error('Please select a CV file first');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(
        'http://127.0.0.1:8000/cv/upload-and-match?top_n=10',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds
        }
      );

      // Extract CV analysis data
      if (response.data.cv_analysis) {
        const analysis = response.data.cv_analysis;
        setCvAnalysis({
          skills_found: analysis.skills_found || [],
          skills_count: analysis.skills_count || 0,
          experience_years: analysis.experience_years || 0,
          education_level: analysis.education_level || 'not_specified',
          total_jobs_scanned: response.data.total_jobs_scanned || 0,
        });
      }

      // Transform matched jobs
      const transformedJobs = response.data.matched_jobs?.map((job) => ({
        job_id: job.job_post_id || job.job_id,
        title: job.title,
        company: {
          name: job.company_name,
          logo_url: job.company_logo,
        },
        location: job.location,
        salary_range: job.salary_range,
        job_type: job.job_type === 'full_time' ? 'Full-time' : 
                  job.job_type === 'part_time' ? 'Part-time' :
                  job.job_type === 'contract' ? 'Contract' : job.job_type,
        match_score: Math.round((job.score || job.match_score) * 100),
        posted_at: job.posted_date || 'Recently',
        description: job.description,
        requirements: job.requirements,
        skills: job.skills || [],
      })) || [];

      setMatchedJobs(transformedJobs);
      setActiveTab('matches');
      toast.success(`Found ${transformedJobs.length} matching jobs! CV analyzed with ${response.data.cv_analysis?.skills_count || 0} skills detected.`);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading CV:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. The service is taking too long.');
      } else {
        toast.error('Failed to upload and match CV. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleAnalyzeCV = async () => {
    if (!file) {
      toast.error('Please select a CV file first');
      return;
    }

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(
        'http://127.0.0.1:8000/cv/analyze',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      setCvAnalysis(response.data);
      setActiveTab('analysis');
      setAnalysisView('basic');
      toast.success('CV analysis completed!');
      setAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. The analysis is taking too long.');
      } else {
        toast.error('Failed to analyze CV. Please try again.');
      }
      setAnalyzing(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!file) {
      toast.error('Please select a CV file first');
      return;
    }

    try {
      setAnalyzingAI(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(
        'http://127.0.0.1:8000/cv/analyze-with-ai',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 90000, // 90 seconds for AI processing
        }
      );

      setAiAnalysis(response.data);
      setActiveTab('analysis');
      setAnalysisView('ai');
      toast.success('AI-powered CV analysis completed!');
      setAnalyzingAI(false);
    } catch (error) {
      console.error('Error analyzing CV with AI:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. AI analysis is taking too long.');
      } else {
        toast.error('Failed to analyze CV with AI. Please try again.');
      }
      setAnalyzingAI(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(droppedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(droppedFile);
      toast.success('File uploaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">
              Career Tools
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Upload your CV to find matching jobs and get professional analysis
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload CV
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
            disabled={matchedJobs.length === 0}
          >
            <Briefcase className="w-4 h-4" />
            Job Matches
            {matchedJobs.length > 0 && (
              <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                {matchedJobs.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'analysis'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-black'
            }`}
            disabled={!cvAnalysis && !aiAnalysis}
          >
            <Target className="w-4 h-4" />
            Analysis
            {(cvAnalysis || aiAnalysis) && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Instructions Card - Only show when no file */}
            {!file && (
              <Card className="border border-blue-200 bg-blue-50 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-gray-700">
                      Upload your CV to get AI-powered job matching and professional feedback.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Area - Compact when file is uploaded */}
            {!file ? (
              <Card className="border-2 border-dashed border-gray-300 shadow-sm hover:border-blue-500 transition-all">
                <CardContent className="p-6">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative transition-all ${
                      isDragging ? 'bg-blue-50 border-2 border-blue-500 rounded-lg p-4' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-base font-semibold text-black mb-1">
                        {isDragging ? 'Drop your CV here' : 'Upload Your CV'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3">
                        Drag & drop or click • PDF, DOC, DOCX • Max 5MB
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label htmlFor="cv-upload">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('cv-upload').click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-5 text-sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Compact file display */
              <Card className="border border-green-200 bg-green-50 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-green-100 rounded">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">{file.name}</p>
                      <p className="text-xs text-gray-600">
                        {(file.size / 1024).toFixed(2)} KB • Ready to analyze
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFile(null);
                        toast.info('File removed');
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium px-2"
                    >
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {file && (
              <div className="space-y-2">
                <Button
                  onClick={handleUploadAndMatch}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Matching Jobs...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Find Matching Jobs
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                    
                      <Button
                        onClick={handleAnalyzeCV}
                        disabled={analyzing}
                        variant="outline"
                        className="w-full border-gray-300 h-10"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Basic Analysis
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 shadow-sm">
                    <CardContent className="p-4">
                    
                      <Button
                        onClick={handleAnalyzeWithAI}
                        disabled={analyzingAI}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10"
                      >
                        {analyzingAI ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            AI Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI Deep Analysis
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matchedJobs.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-2">
                    No matches yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your CV to find matching job opportunities
                  </p>
                  <Button
                    onClick={() => setActiveTab('upload')}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-5"
                  >
                    Upload CV
                  </Button>
                </CardContent>
              </Card>
            ) : (
              matchedJobs.map((job) => (
                <Card key={job.job_id} className="border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
                          {job.company.logo_url ? (
                            <img
                              src={job.company.logo_url}
                              alt={job.company.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-black mb-0.5">
                              {job.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {job.company.name}
                            </p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="border border-green-600 text-green-600 bg-green-50 font-medium px-2 py-0.5 text-xs"
                          >
                            {job.match_score}% Match
                          </Badge>
                        </div>

                        {/* Job Info */}
                        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                            {job.salary_range}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                            {job.job_type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            {job.posted_at}
                          </div>
                        </div>

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border border-gray-300 text-gray-700 bg-gray-50 text-xs px-2 py-0.5"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Action */}
                        <Button
                          onClick={() => navigate(`/job/${job.job_id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* CV Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            {/* Analysis Type Toggle */}
            {(cvAnalysis || aiAnalysis) && (
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                {cvAnalysis && (
                  <button
                    onClick={() => setAnalysisView('basic')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      analysisView === 'basic'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Basic Analysis
                  </button>
                )}
                {aiAnalysis && (
                  <button
                    onClick={() => setAnalysisView('ai')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      analysisView === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Analysis
                  </button>
                )}
              </div>
            )}

            {!cvAnalysis && !aiAnalysis ? (
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-2">
                    No analysis yet
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your CV to get automatic analysis
                  </p>
                  <Button
                    onClick={() => setActiveTab('upload')}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-5"
                  >
                    Upload CV
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Basic Analysis View */}
                {analysisView === 'basic' && cvAnalysis && (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Skills Detected</p>
                              <p className="text-2xl font-bold text-blue-600">{cvAnalysis.skills_count}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Experience</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {cvAnalysis.experience_years === 0 ? 'Fresher' : `${cvAnalysis.experience_years}+ yrs`}
                              </p>
                            </div>
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Jobs Scanned</p>
                              <p className="text-2xl font-bold text-blue-600">{cvAnalysis.total_jobs_scanned || 0}</p>
                            </div>
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Education Level */}
                    <Card className="border border-gray-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600" />
                          Education Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 capitalize">
                          {cvAnalysis.education_level?.replace('_', ' ') || 'Not specified'}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Skills Found */}
                    {cvAnalysis.skills_found && cvAnalysis.skills_found.length > 0 && (
                      <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Skills Identified ({cvAnalysis.skills_found.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {cvAnalysis.skills_found.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border border-green-300 text-green-700 bg-green-50 text-xs px-2 py-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* AI Analysis View */}
                {analysisView === 'ai' && aiAnalysis?.analysis && (
                  <>
                    {/* Overall Score & Summary */}
                    <Card className="border-2 border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-blue-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-1">Overall CV Score</h3>
                            <p className="text-4xl font-bold text-purple-600">
                              {aiAnalysis.analysis.overall_score}/100
                            </p>
                          </div>
                          <Award className="w-12 h-12 text-purple-600" />
                        </div>
                        {aiAnalysis.analysis.summary && (
                          <div className="mt-4 pt-4 border-t border-purple-200">
                            <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.analysis.summary}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Experience & Education Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiAnalysis.analysis.experience_summary && (
                        <Card className="border border-gray-200 shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
                              <Briefcase className="w-5 h-5 text-blue-600" />
                              Experience Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {aiAnalysis.analysis.experience_summary}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                      {aiAnalysis.analysis.education_summary && (
                        <Card className="border border-gray-200 shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base font-semibold text-black flex items-center gap-2">
                              <Award className="w-5 h-5 text-blue-600" />
                              Education Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {aiAnalysis.analysis.education_summary}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Strengths */}
                    {aiAnalysis.analysis.strengths && aiAnalysis.analysis.strengths.length > 0 && (
                      <Card className="border border-green-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Key Strengths ({aiAnalysis.analysis.strengths.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Weaknesses */}
                    {aiAnalysis.analysis.weaknesses && aiAnalysis.analysis.weaknesses.length > 0 && (
                      <Card className="border border-orange-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            Areas to Address ({aiAnalysis.analysis.weaknesses.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Improvement Suggestions */}
                    {aiAnalysis.analysis.improvement_suggestions && aiAnalysis.analysis.improvement_suggestions.length > 0 && (
                      <Card className="border border-blue-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Detailed Improvement Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {aiAnalysis.analysis.improvement_suggestions.map((item, index) => (
                              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-black">{item.area}</h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      item.priority === 'high'
                                        ? 'border-red-300 text-red-700 bg-red-50'
                                        : item.priority === 'medium'
                                        ? 'border-orange-300 text-orange-700 bg-orange-50'
                                        : 'border-gray-300 text-gray-700 bg-gray-50'
                                    }`}
                                  >
                                    {item.priority} priority
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">Current:</span> {item.current}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                  <span className="font-medium">Suggestion:</span> {item.suggestion}
                                </p>
                                {item.example && (
                                  <div className="mt-2 p-2 bg-white rounded border border-blue-100">
                                    <p className="text-xs font-medium text-gray-600 mb-1">Example:</p>
                                    <p className="text-xs text-gray-700 whitespace-pre-line">{item.example}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Formatting Tips */}
                    {aiAnalysis.analysis.formatting_tips && aiAnalysis.analysis.formatting_tips.length > 0 && (
                      <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-600" />
                            Formatting Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.formatting_tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-gray-400">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Content Tips */}
                    {aiAnalysis.analysis.content_tips && aiAnalysis.analysis.content_tips.length > 0 && (
                      <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <Target className="w-5 h-5 text-gray-600" />
                            Content Enhancement Tips
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {aiAnalysis.analysis.content_tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-gray-400">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Detected Skills */}
                    {aiAnalysis.analysis.detected_skills && aiAnalysis.analysis.detected_skills.length > 0 && (
                      <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Detected Skills ({aiAnalysis.analysis.detected_skills.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {aiAnalysis.analysis.detected_skills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="border border-green-300 text-green-700 bg-green-50 text-xs px-2 py-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CareerTools;
