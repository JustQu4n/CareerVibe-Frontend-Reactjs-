/**
 * Question Card Component
 * Displays single question with answer textarea
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  onAutoSubmit,
  isLastQuestion = false,
}) => {
  const [answer, setAnswer] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmitAnswer(answer, elapsedSeconds);
    setIsSubmitting(false);
  };

  const handleTimeUp = async () => {
    // Auto-submit when time's up
    await onAutoSubmit(answer, elapsedSeconds);
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            Câu {questionNumber} / {totalQuestions}
          </Badge>
          {question.max_score && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {question.max_score} điểm
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center space-x-2">
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-medium text-slate-600">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
      </div>

      {/* Timer Card */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-6">
          <CountdownTimer
            timeLimit={question.time_limit_seconds}
            onTimeUp={handleTimeUp}
            onTick={setElapsedSeconds}
            autoStart={true}
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-start space-x-3">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
              {questionNumber}
            </span>
            <span className="leading-relaxed">{question.question_text}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Answer Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">
                Câu trả lời của bạn
              </label>
              <span className="text-xs text-slate-500">
                {answer.length} ký tự
              </span>
            </div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Nhập câu trả lời của bạn tại đây..."
              className="min-h-[300px] text-base resize-none focus:ring-2 focus:ring-blue-500 border-2"
              autoFocus
            />
          </div>

          {/* Helper Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-blue-900">💡 Gợi ý:</p>
            <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
              <li>Trả lời rõ ràng, súc tích và đầy đủ</li>
              <li>Sử dụng ví dụ cụ thể nếu có thể</li>
              <li>Kiểm tra lại chính tả trước khi nộp</li>
              <li>
                <strong>Lưu ý:</strong> Không thể quay lại sau khi nộp câu này
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Đang xử lý...
                </span>
              ) : isLastQuestion ? (
                <span className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Nộp bài
                </span>
              ) : (
                <span className="flex items-center">
                  Câu tiếp theo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>
            
            {!answer.trim() && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                ⚠️ Vui lòng nhập câu trả lời để tiếp tục
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800 font-medium text-center">
          ⚠️ Bạn sẽ không thể quay lại câu hỏi này sau khi nhấn "
          {isLastQuestion ? 'Nộp bài' : 'Câu tiếp theo'}"
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;
