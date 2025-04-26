import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

const levels = ["intern", "junior", "mid", "senior", "lead"];
const genders = ["male", "female", "any"];
const jobTypes = ["full_time", "part_time", "remote", "hybrid"];
const statuses = ["active", "hidden"];
const popularSkills = ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Java", "Python", "AWS", "Git", "SQL", "MongoDB"];

export default function EditJobModal({ isOpen, onClose, job, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (job) {
      setFormData(job || {});
      setSkills(job.skills || []);
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeSkill = (indexToRemove) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    setSkills(updatedSkills);
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      setFormData(prev => ({ ...prev, skills: updatedSkills }));
      setSkillInput("");
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const addPopularSkill = (skill) => {
    if (!skills.includes(skill)) {
      addSkill(skill);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <Dialog.Title className="text-xl font-semibold mb-4">Edit Job Post</Dialog.Title>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="Job Title"
              className="col-span-2 border px-3 py-2 rounded"
              required
            />

            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Location"
              className="border px-3 py-2 rounded"
              required
            />

            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="border px-3 py-2 rounded"
              required
            />

            <input
              type="text"
              name="experience"
              value={formData.experience || ""}
              onChange={handleChange}
              placeholder="Experience (e.g., 2+ years)"
              className="border px-3 py-2 rounded"
              required
            />

            <select
              name="level"
              value={formData.level || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Select Level</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>

            <input
              type="number"
              name="salary"
              value={formData.salary || ""}
              onChange={handleChange}
              placeholder="Salary (Optional)"
              className="border px-3 py-2 rounded"
            />

            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Gender Preference</option>
              {genders.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              name="job_type"
              value={formData.job_type || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Job Type</option>
              {jobTypes.map((jt) => (
                <option key={jt} value={jt}>{jt.replace("_", " ")}</option>
              ))}
            </select>

            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <input
              type="date"
              name="expires_at"
              value={formData.expires_at?.split("T")[0] || ""}
              onChange={handleChange}
              className="border px-3 py-2 rounded"
              required
            />

            {/* New Skills Input UI */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required</label>
              <div className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus-within:outline-none focus-within:border-gray-400 focus-within:bg-white flex flex-wrap gap-2 min-h-[48px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-indigo-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-2 text-gray-600 hover:text-red-600"
                      onClick={() => removeSkill(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  className="flex-grow bg-transparent outline-none text-sm px-2 py-1"
                  type="text"
                  placeholder="Type and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>

              {/* Gợi ý kỹ năng phổ biến */}
              <div className="flex flex-wrap gap-2 mt-2">
                {popularSkills.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    className="px-3 py-1 text-xs bg-gray-200 hover:bg-indigo-400 hover:text-white rounded-full"
                    onClick={() => addPopularSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Job Description"
              className="col-span-2 border px-3 py-2 rounded h-28 resize-none"
              required
            />

            <div className="col-span-2 flex justify-end gap-2 mt-2">
              <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}