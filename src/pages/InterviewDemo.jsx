/**
 * Interview Demo Page
 * Demo và test các interview components
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewInvitationModal } from '@/components/interviews';

const InterviewDemo = () => {
  const [showModal, setShowModal] = useState(false);

  // Mock interview data
  const mockInterviewData = {
    interview_id: 'mock-interview-id',
    title: 'Backend Developer Interview',
    description: 'Đánh giá kỹ năng backend development, REST API design, và database optimization',
    total_time_minutes: 30,
    question_count: 5,
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48h from now
    has_interview: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">🎯 Interview System Demo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Demo các components của hệ thống interview. Click vào các button để test.
            </p>

            {/* Demo Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Interview Invitation Modal */}
              <Card className="border-2 hover:border-blue-500 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-bold text-lg">Interview Invitation Modal</h3>
                  <p className="text-sm text-slate-600">
                    Popup mời làm bài interview sau khi apply job
                  </p>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="w-full"
                  >
                    Xem Modal
                  </Button>
                </CardContent>
              </Card>

              {/* Interview Session */}
              <Card className="border-2 hover:border-purple-500 transition-colors">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-bold text-lg">Interview Session</h3>
                  <p className="text-sm text-slate-600">
                    Màn hình làm bài interview với timer
                  </p>
                  <Button
                    onClick={() => window.open('/interview/demo-session-id', '_blank')}
                    className="w-full"
                    variant="outline"
                  >
                    Mở Session (Demo)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features List */}
            <Card className="bg-blue-50 border-blue-200 mt-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">✨ Features</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Popup invitation đẹp với gradient và animations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Countdown timer per question với visual feedback</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Auto-submit khi hết thời gian</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Không cho quay lại câu trước</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Prevent page reload during interview</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Confetti animation khi hoàn thành</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Responsive design (mobile + desktop)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* API Integration Info */}
            <Card className="bg-slate-50 border-slate-200 mt-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">🔌 API Integration</h3>
                <div className="space-y-2 text-sm font-mono">
                  <p>POST /jobseeker/applications/submit</p>
                  <p>GET /jobseeker/interviews/preview/:id</p>
                  <p>POST /jobseeker/interviews/:id/accept</p>
                  <p>GET /jobseeker/interviews/:candidateId</p>
                  <p>POST /jobseeker/interviews/:candidateId/start</p>
                  <p>POST /jobseeker/interviews/:candidateId/submit</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Interview Modal */}
      <InterviewInvitationModal
        open={showModal}
        onOpenChange={setShowModal}
        interviewData={mockInterviewData}
        onStartNow={() => {
          alert('Chuyển đến màn hình interview...');
          setShowModal(false);
        }}
        onDoLater={() => {
          alert('Bạn có thể làm bài sau!');
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default InterviewDemo;
