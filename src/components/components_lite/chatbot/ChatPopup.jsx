import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageCircleMore, SendHorizontal } from 'lucide-react'; // Assuming you have this icon installed

const API_URL = 'http://localhost:5000/api/chatbot/chat';
const API_HISTORY_URL = 'http://localhost:5000/api/chatbot/history'; 

export default function ChatPopup({ userId }) {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);  // trạng thái fullscreen
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('chatSessionId') || `sess_${Date.now()}`;
  });
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      fetchChatHistory();
    }
  }, [open]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${API_HISTORY_URL}?sessionId=${sessionId}&userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setMessages(data.history || []);
    } catch (error) {
      setMessages([]);
      console.error('Error loading chat history:', error);
    }
  };

  const toggleOpen = () => setOpen(!open);

  const toggleFullscreen = () => setFullscreen(!fullscreen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
          userId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const assistantReply = { role: 'assistant', text: data.reply };
        setMessages((prev) => [...prev, assistantReply]);
      } else {
        const errorReply = { role: 'assistant', text: data.error || 'Error from server' };
        setMessages((prev) => [...prev, errorReply]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if(!loading) sendMessage();
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
            className="flex border-t border-gray-300 rounded-b-lg  p-3 space-x-3"
          >
            <textarea
              rows={fullscreen ? 4 : 2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-grow p-3 resize-none border-none focus:outline-none"
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
