/**
 * BehaviorLogsPanel Component
 * Displays candidate behavior tracking logs for employers
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Copy,
  ClipboardPaste,
  Trash2,
  Zap,
  ExternalLink,
  Eye,
  Clock,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const BehaviorLogsPanel = ({ behaviorLogs = [], candidateName = 'Candidate', loading = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug logging
  console.log('BehaviorLogsPanel - Received logs:', behaviorLogs);
  console.log('BehaviorLogsPanel - Logs count:', behaviorLogs.length);
  console.log('BehaviorLogsPanel - Loading:', loading);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading behavior logs...</span>
        </div>
      </div>
    );
  }

  // Calculate behavior summary
  const summary = behaviorLogs.reduce((acc, log) => {
    const type = log.type || log.behavior_type;
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});

  // Calculate risk score
  const calculateRiskScore = () => {
    const weights = {
      PASTE: 15,
      COPY: 5,
      LARGE_DELETION: 10,
      TAB_SWITCH: 12,
      FOCUS_LOSS: 8,
    };

    let score = 0;
    behaviorLogs.forEach(log => {
      const type = log.type || log.behavior_type;
      score += weights[type] || 0;
    });

    return Math.min(score, 100);
  };

  const riskScore = calculateRiskScore();
  const isHighRisk = riskScore > 50;
  const isMediumRisk = riskScore > 25 && riskScore <= 50;

  // Behavior type metadata
  const behaviorTypes = {
    PASTE: {
      icon: ClipboardPaste,
      label: 'Copy-Paste',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Pasted text from clipboard',
    },
    COPY: {
      icon: Copy,
      label: 'Copy',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Copied text to clipboard',
    },
    LARGE_DELETION: {
      icon: Trash2,
      label: 'Large Deletion',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      description: 'Deleted significant text (rethinking)',
    },
    TAB_SWITCH: {
      icon: ExternalLink,
      label: 'Tab Switch',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      description: 'Switched to another tab/window',
    },
    FOCUS_LOSS: {
      icon: Eye,
      label: 'Focus Loss',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Interview window lost focus',
    },
  };

  if (!behaviorLogs || behaviorLogs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Behavior Tracking Status</h3>
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-800 font-medium mb-1">
                  ✅ Scenario 1: Clean Session
                </p>
                <p className="text-xs text-green-700">
                  No suspicious behavior detected during this interview session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Risk Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg p-4 border ${
          isHighRisk
            ? 'bg-red-50 border-red-300'
            : isMediumRisk
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-blue-50 border-blue-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                isHighRisk
                  ? 'bg-red-100'
                  : isMediumRisk
                  ? 'bg-yellow-100'
                  : 'bg-blue-100'
              }`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${
                  isHighRisk
                    ? 'text-red-700'
                    : isMediumRisk
                    ? 'text-yellow-700'
                    : 'text-blue-700'
                }`}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Behavior Risk Score</h3>
              <p className="text-xs text-gray-600">{candidateName}</p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${
                isHighRisk
                  ? 'text-red-700'
                  : isMediumRisk
                  ? 'text-yellow-700'
                  : 'text-blue-700'
              }`}
            >
              {riskScore}
            </div>
            <p className="text-sm text-gray-600">/ 100</p>
          </div>
        </div>

        {/* Risk Level Indicator */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                isHighRisk
                  ? 'bg-red-600'
                  : isMediumRisk
                  ? 'bg-yellow-600'
                  : 'bg-blue-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span
            className={`text-sm font-semibold ${
              isHighRisk
                ? 'text-red-800'
                : isMediumRisk
                ? 'text-yellow-800'
                : 'text-blue-800'
            }`}
          >
            {isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}
          </span>
        </div>
      </motion.div>

      {/* Behavior Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Behavior Summary
          </h4>
          <span className="text-sm text-gray-600">
            {behaviorLogs.length} events detected
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(summary).map(([type, count]) => {
            const meta = behaviorTypes[type];
            if (!meta) return null;

            const Icon = meta.icon;

            return (
              <div
                key={type}
                className={`${meta.bgColor} ${meta.borderColor} border rounded-lg p-2`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${meta.color}`} />
                  <span className="text-xs font-semibold text-gray-700">
                    {meta.label}
                  </span>
                </div>
                <p className={`text-xl font-bold ${meta.color}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Logs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            Detailed Activity Log
          </h4>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {behaviorLogs.map((log, index) => {
              const type = log.type || log.behavior_type;
              const meta = behaviorTypes[type];
              if (!meta) return null;

              const Icon = meta.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`h-8 w-8 rounded-lg ${meta.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900">
                          {meta.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{log.description}</p>
                      {((log.data && Object.keys(log.data).length > 0) || (log.metadata && Object.keys(log.metadata).length > 0)) && (
                        <div className="mt-1.5 space-y-1">
                          {(() => {
                            const data = log.data || log.metadata;
                            const type = log.type || log.behavior_type;
                            
                            if (type === 'PASTE' && data.length) {
                              return (
                                <div className="text-xs bg-red-50 border border-red-200 rounded px-2 py-1">
                                  <span className="font-semibold text-red-700"> {data.length} characters pasted</span>
                                  {data.preview && (
                                    <div className="mt-1 text-red-600 italic line-clamp-2">
                                      "{data.preview}"
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            
                            if (type === 'COPY' && data.length) {
                              return (
                                <div className="text-xs bg-orange-50 border border-orange-200 rounded px-2 py-1">
                                  <span className="font-semibold text-orange-700">📄 {data.length} characters copied</span>
                                </div>
                              );
                            }
                            
                            if (type === 'LARGE_DELETION' && data.deleted_chars) {
                              return (
                                <div className="text-xs bg-yellow-50 border border-yellow-200 rounded px-2 py-1 space-y-0.5">
                                  <div className="font-semibold text-yellow-700">Deleted {data.deleted_chars} characters</div>
                                  <div className="text-yellow-600">
                                    Length changed: {data.previous_length} → {data.new_length}
                                  </div>
                                </div>
                              );
                            }
                            
                            return null;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorLogsPanel;
