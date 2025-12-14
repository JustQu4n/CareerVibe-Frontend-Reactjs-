/**
 * InterviewManagement Component
 * Main page for managing interviews with tabs
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Plus,
  FileQuestion,
  Users,
  MessageSquare,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import InterviewSessions from './InterviewSessions';
import InterviewQuestions from './InterviewQuestions';
import InterviewAssignments from './InterviewAssignments';
import InterviewAnswers from './InterviewAnswers';
import CandidateAnswers from './CandidateAnswers';

export default function InterviewManagement() {
  const [activeTab, setActiveTab] = useState('sessions');
  const [selectedInterview, setSelectedInterview] = useState(null);

  const tabs = [
    {
      id: 'sessions',
      label: 'Interview Sessions',
      icon: Video,
      component: InterviewSessions
    },
    {
      id: 'questions',
      label: 'Questions',
      icon: FileQuestion,
      component: InterviewQuestions,
      requiresSelection: true
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: Users,
      component: InterviewAssignments,
      requiresSelection: true
    },
    {
      id: 'candidate-answers',
      label: 'Answers',
      icon: MessageSquare,
      component: CandidateAnswers,
      requiresSelection: true
    },
    {
      id: 'grading',
      label: 'Grading',
      icon: FileQuestion,
      component: InterviewAnswers,
      requiresSelection: true
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  const handleTabChange = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.requiresSelection && !selectedInterview) {
      toast.warning('Please select an interview session first');
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage interview sessions, questions, and candidate assessments
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isDisabled = tab.requiresSelection && !selectedInterview;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={isDisabled}
                  className={`
                    relative px-6 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap
                    flex items-center gap-2
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : isDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Interview Info */}
      {selectedInterview && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selected Interview Session</p>
                <p className="font-semibold text-gray-900">{selectedInterview.title}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedInterview(null);
                setActiveTab('sessions');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Change Session
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {ActiveComponent && (
              <ActiveComponent
                selectedInterview={selectedInterview}
                onSelectInterview={setSelectedInterview}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
