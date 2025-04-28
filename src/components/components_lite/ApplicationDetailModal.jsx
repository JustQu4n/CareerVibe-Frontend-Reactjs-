// src/components/ApplicationDetailModal.jsx
import React from 'react';

const ApplicationDetailModal = ({ application, onClose }) => {
  const { job, cover_letter, cv_url, applied_at, status } = application;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
        <p className="text-gray-600 mb-2"><strong>Location:</strong> {job.location}</p>
        <p className="text-gray-600 mb-2"><strong>Experience:</strong> {job.experience}</p>
        <p className="text-gray-600 mb-2"><strong>Salary:</strong> ${job.salary.toLocaleString()}</p>
        <p className="text-gray-600 mb-2"><strong>Skills:</strong> {job.skills.join(', ')}</p>
        <p className="text-gray-600 mb-2"><strong>Status:</strong> 
          <span className={`ml-2 px-3 py-1 rounded-full text-sm ${status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </span>
        </p>
        <p className="mt-4 text-gray-700"><strong>Cover Letter:</strong></p>
        <p className="text-gray-500 mb-4">{cover_letter}</p>

        <a
          href={`http://localhost:5000/${cv_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          View CV
        </a>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
