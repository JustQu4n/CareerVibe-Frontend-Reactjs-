/**
 * Interview Invitation Modal
 * Popup that appears after job application when interview is required
 */
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewInvitationModal = ({
  open,
  onOpenChange,
  interviewData,
  onStartNow,
  onDoLater,
  loading = false,
}) => {
  if (!interviewData) return null;

  const {
    title,
    description,
    total_time_minutes,
    question_count,
    deadline,
  } = interviewData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto"
          >
            <Target className="w-8 h-8" />
          </motion.div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white">
              {title || 'Mời làm bài Interview'}
            </DialogTitle>
            <DialogDescription className="text-blue-50 text-center mt-2">
              Nhà tuyển dụng yêu cầu bạn hoàn thành bài đánh giá
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          {description && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-700">{description}</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">
                  Thời gian
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {total_time_minutes} phút
                </p>
              </div>
            </div>

            {/* Questions */}
            <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">Số câu hỏi</p>
                <p className="text-lg font-bold text-slate-900">
                  {question_count} câu
                </p>
              </div>
            </div>
          </div>

          {/* Deadline warning */}
          {deadline && (
            <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Hạn nộp bài
                </p>
                <p className="text-sm text-amber-700">
                  {new Date(deadline).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          )}

          {/* Important Note */}
          <div className="bg-slate-100 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              📌 Lưu ý quan trọng:
            </p>
            <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc">
              <li>Mỗi câu hỏi có thời gian giới hạn riêng</li>
              <li>Không thể quay lại câu trước đó</li>
              <li>Đảm bảo kết nối mạng ổn định</li>
              <li>Chuẩn bị sẵn môi trường làm việc yên tĩnh</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onDoLater}
              disabled={loading}
              className="flex-1 h-11"
            >
              Làm sau
            </Button>
            <Button
              onClick={onStartNow}
              disabled={loading}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tải...
                </span>
              ) : (
                'Bắt đầu ngay'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewInvitationModal;
