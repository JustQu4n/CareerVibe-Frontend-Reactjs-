/**
 * Interview Complete Component
 * Success screen after completing interview
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Briefcase, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const InterviewComplete = ({ interviewData }) => {
  const navigate = useNavigate();

  // Trigger confetti on mount
  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Hoàn thành xuất sắc! 🎉
              </h1>
              <p className="text-green-50 text-lg">
                Bạn đã nộp bài interview thành công
              </p>
            </motion.div>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center"
            >
              <p className="text-lg font-semibold text-green-900 mb-2">
                ✅ Bài làm của bạn đã được ghi nhận
              </p>
              <p className="text-sm text-green-700">
                Nhà tuyển dụng sẽ xem xét và phản hồi trong thời gian sớm nhất
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-slate-900">
                  {interviewData?.questions?.length || 0}
                </p>
                <p className="text-xs text-slate-600">Câu hoàn thành</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-slate-900">
                  {Math.floor(
                    (interviewData?.questions?.reduce(
                      (sum, q) => sum + q.time_limit_seconds,
                      0
                    ) || 0) / 60
                  )}
                </p>
                <p className="text-xs text-slate-600">Phút đã sử dụng</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Briefcase className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-600">Hoàn thành</p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-50 rounded-xl p-6 space-y-3"
            >
              <h3 className="font-semibold text-slate-900 flex items-center">
                <span className="text-xl mr-2">🚀</span>
                Các bước tiếp theo
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Nhà tuyển dụng sẽ xem xét câu trả lời của bạn</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Bạn sẽ nhận được thông báo qua email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Theo dõi trạng thái ứng tuyển trong Dashboard</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <Button
                onClick={() => navigate('/jobseeker-applications')}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Xem đơn ứng tuyển
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 h-12"
              >
                <Home className="w-5 h-5 mr-2" />
                Về trang chủ
              </Button>
            </motion.div>

            {/* Note */}
            <p className="text-xs text-center text-slate-500 pt-2">
              💡 Bạn có thể tiếp tục tìm kiếm và ứng tuyển các công việc khác
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InterviewComplete;
