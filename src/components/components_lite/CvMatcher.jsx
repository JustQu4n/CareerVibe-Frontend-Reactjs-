import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function CVUploadPage() {
  const [file, setFile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/match-cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center p-8">
        <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Upload Your CV</h1>
          <div className="flex flex-col gap-4 items-center">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Analyzing CV..." : "Find Matching Jobs"}
            </button>
          </div>
        </div>

        {matches.length > 0 && (
          <div className="mt-10 w-full max-w-5xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Matching Job Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((job) => (
                <div
                  onClick={() => window.location.href = `/view-job-detail/${job.job_id}`}
                  key={job.job_id}
                  className="bg-white p-6 rounded-2xl shadow-xl border hover:border-blue-600 transition cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-blue-700 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-1">Matching Score: <span className="font-bold">{(job.score * 100).toFixed(0)}%</span></p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Skill Match: {(job.skill_match * 100).toFixed(0)}%</p>
                    <p>Experience Match: {(job.experience_match * 100).toFixed(0)}%</p>
                    <p>Industry Match: {(job.industry_match * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}