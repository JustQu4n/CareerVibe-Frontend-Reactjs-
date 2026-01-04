import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircle, Send, Minimize2, Maximize2, X, Sparkles, Bot } from 'lucide-react';
import apiClient from '@/api/client';
import { useSelector } from 'react-redux';

const WELCOME_MESSAGE = `Hello! 👋 Welcome to CareerVibe AI Assistant!

I'm here to help you with:
• Job search and recommendations
• Career advice and guidance  
• Interview preparation tips
• Resume and cover letter assistance

How can I assist you today?`;

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

  // Add welcome message when opening chat for first time
  useEffect(() => {
    if (open && messages.length === 0 && !loading) {
      setTimeout(() => {
        setMessages([{ role: 'assistant', text: WELCOME_MESSAGE }]);
      }, 300);
    }
  }, [open]);

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
    ? "fixed inset-0 z-50 bg-white flex flex-col"
    : "fixed bottom-6 right-6 w-[380px] h-[500px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200";

  return (
    <>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {open && (
        <div className={containerClasses}>
          <div className="px-4 py-2 bg-blue-500 text-white flex justify-between items-center rounded-t-2xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI CareerVibe</h3>
                <p className="text-xs text-blue-100">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                aria-label="Toggle fullscreen"
              >
                {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleOpen}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 animate-fadeIn ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}
                >
                  {msg.role === 'user' ? 'You' : 'AI'}
                </div>

                <div
                  className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  <div
                    className={`text-sm leading-relaxed ${
                      msg.role === 'assistant' ? 'prose prose-sm max-w-none' : ''
                    }`}
                  >
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                  AI
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-5 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if(!loading) sendMessage();
              }}
              className="flex items-end gap-3"
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                disabled={loading}
                style={{ maxHeight: '120px' }}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 hover:shadow-lg transform hover:scale-105"
                aria-label="Send message"
                disabled={!input.trim() || loading}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
