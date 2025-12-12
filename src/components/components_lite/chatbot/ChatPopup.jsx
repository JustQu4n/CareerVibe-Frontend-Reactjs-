import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircleMore, SendHorizontal } from 'lucide-react';
import apiClient from '@/api/client';
import { useSelector } from 'react-redux';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const CHAT_BASE = `${API_BASE}/api/ai-assistant`;

export default function ChatPopup() {
  const token = useSelector((s) => s.auth?.token);
  const user = useSelector((s) => s.auth?.user);

  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState({ configured: false, message: '' });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && token) {
      fetchStatus();
      fetchHistory();
      fetchSuggestions();
    }
  }, [open, token]);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get(`${CHAT_BASE}/status`);
      setStatus(res.data || { configured: false, message: '' });
    } catch (err) {
      console.error('Status error', err);
      setStatus({ configured: false, message: 'AI backend unavailable' });
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await apiClient.get(`${CHAT_BASE}/suggestions`);
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error('Suggestions error', err);
      setSuggestions([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get(`${CHAT_BASE}/history?limit=50`);
      const hist = res.data.history || [];
      const msgs = [];
      hist.forEach((h) => {
        msgs.push({ role: 'user', text: h.userMessage, id: h.id, ts: h.createdAt });
        msgs.push({ role: 'assistant', text: h.aiResponse, id: `ai_${h.id}`, ts: h.createdAt });
      });
      setMessages(msgs);
    } catch (err) {
      console.error('History error', err);
      setMessages([]);
    }
  };

  const deleteHistory = async () => {
    if (!confirm('Clear chat history?')) return;
    try {
      await apiClient.delete(`${CHAT_BASE}/history`);
      setMessages([]);
    } catch (err) {
      console.error('Delete history error', err);
      alert('Failed to delete history');
    }
  };

  const toggleOpen = () => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setOpen((v) => !v);
  };

  const toggleFullscreen = () => setFullscreen((v) => !v);

  const sendMessage = async (model = 'gemini-2.5-flash') => {
    if (!input.trim()) return;
    const messageToSend = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: messageToSend }]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post(`${CHAT_BASE}/chat`, { message: messageToSend, model });
      const data = res.data || {};
      // sanitize assistant response by collapsing excess newlines
      const respText = (data.response || 'No response').replace(/\n{3,}/g, '\n\n');
      setMessages((prev) => [...prev, { role: 'assistant', text: respText }]);
    } catch (err) {
      console.error('Send message error', err);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Error: unable to reach AI service' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  // Lớp CSS điều chỉnh kích thước
  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 bg-white flex flex-col rounded-none shadow-none"
    : "fixed bottom-24 right-6 w-96 max-w-full bg-white rounded-lg shadow-xl flex flex-col z-50 ";

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
        aria-label="Open chat"
      >
       <MessageCircleMore />
      </button>

      {open && (
        <div className={containerClasses}>
          <div className="px-4 py-3 bg-blue-600 text-white font-semibold flex justify-between items-center rounded-t-lg">
            <span>Chatbot Gemini</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFullscreen}
                className="hover:text-gray-300"
                title={fullscreen ? "Thu nhỏ" : "Phóng to"}
                aria-label="Toggle fullscreen"
              >
                {fullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M18 12h3m0 0v3m0-3v-3m0 3h-3m-9 6h-3m0 0v-3m0 3v3m0-3h3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-16h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleOpen}
                className="hover:text-gray-300"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="p-4 flex-grow overflow-y-auto flex flex-col space-y-4 bg-gray-50"
            style={{ minHeight: 0, maxHeight: fullscreen ? 'calc(100vh - 140px)' : '300px' }}
          >
            {messages.length === 0 && (
              <p className="text-gray-400 italic text-sm text-center">Start the conversation!</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex max-w-[90%] ${
                  msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                } items-start space-x-2`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold select-none">
                  {msg.role === 'user' ? 'U' : 'G'}
                </div>

                <div
                  className={`px-4 py-3 rounded-lg whitespace-pre-wrap break-words text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-white border border-gray-300'
                  }`}
                  style={{ maxWidth: '70%' }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex self-start items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
                <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-500">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if(!loading) sendMessage();
            }}
            className="flex items-end border-t border-gray-300 rounded-b-lg p-3 space-x-3"
          >
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className={`flex-grow p-2 resize-none border-none focus:outline-none ${fullscreen ? 'h-10' : 'h-8'}`}
              disabled={loading}
            />
            <button
              type="submit"
              className='bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50 transition-colors'
              aria-label="Send message"
              disabled={!input.trim() || loading}
            >
            <SendHorizontal  />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
