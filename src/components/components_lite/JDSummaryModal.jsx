import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown';

export default function JDSummaryModal({ jdText, onClose }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

const { user } = useSelector((store) => store.auth);
 const userId = user?.id;
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chatbot/summarize-jd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: jdText, userId: userId }),
        });
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        setSummary("Lỗi khi tóm tắt JD.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [jdText]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative shadow-xl">
        <h2 className="text-xl font-semibold mb-3">📌 Tóm tắt mô tả công việc</h2>
        {loading ? (
          <p className="text-gray-500 italic">Đang tóm tắt nội dung...</p>
        ) : (
          <p className="text-gray-800 whitespace-pre-wrap">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </p>
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
