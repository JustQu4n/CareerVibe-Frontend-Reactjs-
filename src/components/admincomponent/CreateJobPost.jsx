import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "../../redux/jobPostSlice";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";

export default function CreateJobPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.jobPosts);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    company_id: user?.company?.id || "",
    title: "",
    industries: "",
    description: "",
    location: "",
    address: "",
    skills: [],
    experience: "",
    level: "",
    salary: "",
    gender: "any",
    job_type: "full_time",
    status: "active",
    expires_at: "",
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

      setFormData({
        ...formData,
        title: "",
        industries: "",
        description: "",
        location: "",
        address: "",
        skills: [],
        experience: "",
        level: "",
        salary: "",
        expires_at: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // error handled by redux
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-14  p-10 rounded-3xl shadow-2xl border border-blue-100 relative">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full shadow hover:bg-blue-50 transition text-blue-600 font-semibold"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-700 tracking-tight">Post a Job</h1>
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center font-medium shadow">
          Job post created successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center font-medium shadow">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-7">
        <div>
          <label className="block text-base font-semibold text-blue-800 mb-1">Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Add job title, role..."
            className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-blue-800 mb-1">
            Skills <span className="font-normal text-gray-500">(comma separated)</span>
          </label>
          <input
            name="skills"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="e.g. React, Node.js, AWS"
            className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-base font-semibold text-blue-800 mb-1">Industries</label>
          <input
            name="industries"
            placeholder="e.g. Technology, Finance"
            value={formData.industries}
            onChange={handleChange}
            className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Experience</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 4+ years"
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Level</label>
            <input
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="e.g. Senior"
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Salary (USD)</label>
            <input
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-blue-800 mb-1">Expires At</label>
            <input
              name="expires_at"
              type="date"
              value={formData.expires_at.split("T")[0]}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-blue-800 mb-2">Description</label>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
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
                placeholder: "Add your job description...",
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData({ ...formData, description: data });
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

        <div>
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              <>Post Job <span className="ml-1">→</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
