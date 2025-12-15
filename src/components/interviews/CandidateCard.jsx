/**
 * Candidate Card Component
 * Hiển thị thông tin ứng viên với avatar, tên, email, phone
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, User, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateCard = ({ 
  candidate, 
  status, 
  score,
  onViewDetails,
  showActions = true 
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      assigned: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Chưa làm' },
      in_progress: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Đang làm' },
      submitted: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Đã nộp' },
      completed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Hoàn thành' },
      timeout: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Hết hạn' },
    };

    const config = statusConfig[status] || statusConfig.assigned;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-2 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {candidate.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.full_name)}&background=random&size=128`;
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {candidate.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 truncate">
                    {candidate.full_name}
                  </h3>
                  <p className="text-sm text-slate-500">ID: {candidate.user_id?.slice(0, 8)}...</p>
                </div>
                {status && getStatusBadge(status)}
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5">
                {candidate.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{candidate.email}</span>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
              </div>

              {/* Score if available */}
              {score !== undefined && score !== null && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Điểm số:</span>
                    <span className={`text-lg font-bold ${
                      score >= 80 ? 'text-green-600' :
                      score >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        score >= 80 ? 'bg-green-500' :
                        score >= 60 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              )}

              {/* View Details Button */}
              {showActions && onViewDetails && (
                <button
                  onClick={onViewDetails}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CandidateCard;
