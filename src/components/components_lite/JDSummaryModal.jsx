import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function JDSummaryModal({ jdText, onClose }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((store) => store.auth?.token);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!jdText || !token) {
        setSummary("Vui lòng đăng nhập để sử dụng tính năng này.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${API_BASE}/api/ai-assistant/summarize-jd`,
          { jobDescription: jdText },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log("JD Summary Response:", res.data);
        setSummary(res.data?.summary || res.data?.response || "Không có nội dung tóm tắt.");
      } catch (err) {
        console.error("Summarize error:", err);
        setError("Không thể tóm tắt JD. Vui lòng thử lại.");
        setSummary("Lỗi khi tóm tắt JD.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [jdText, token]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-3">📌 Tóm tắt mô tả công việc</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 italic ml-3">Đang tóm tắt nội dung...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="text-gray-800 whitespace-pre-wrap prose prose-sm max-w-none">
            {/* <ReactMarkdown>{summary}</ReactMarkdown> */}
            {summary}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-black text-2xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
