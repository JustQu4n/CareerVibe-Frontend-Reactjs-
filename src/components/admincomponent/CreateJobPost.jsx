import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "../../redux/jobPostSlice";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function CreateJobPost() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.jobPosts);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    company_id: user?.company?.id || "",
    title: "",
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
  console.log("User ID:", user?.id);
  console.log("Company ID:", user?.company?.id);

  console.log("Form Data:", formData);
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
      const resultAction = await dispatch(createJobPost(formData)).unwrap();
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        ...formData,
        title: "",
        description: "",
        location: "",
        address: "",
        skills: [],
        experience: "",
        level: "",
        salary: "",
        expires_at: "",
      });

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to create job post:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Post a Job</h1>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          Job post created successfully! Redirecting to jobs list...
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Add job title, role..."
            className="mt-1 w-full border rounded-xl p-3"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Skills (comma separated)
          </label>
          <input
            name="skills"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            placeholder="e.g. React, Node.js, AWS"
            className="mt-1 w-full border rounded-xl p-3"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Experience</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 4+ years"
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Level</label>
            <input
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="e.g. Senior"
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Salary (USD)</label>
            <input
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 120000"
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Expires At</label>
            <input
              name="expires_at"
              type="date"
              value={formData.expires_at.split("T")[0]}
              onChange={handleChange}
              className="mt-1 w-full border rounded-xl p-3"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
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
              // You can customize the editor on initialization here if needed
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

        <div>
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
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
              <>Post Job →</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
