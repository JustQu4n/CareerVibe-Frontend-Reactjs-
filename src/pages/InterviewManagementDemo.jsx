/**
 * Interview Management Demo
 * Demo page for employer interview management
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CandidatesList, 
  CandidateAnswersView,
  CandidateCard 
} from '@/components/interviews';

const InterviewManagementDemo = () => {
  const [selectedView, setSelectedView] = useState('list');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Mock data
  const mockInterviewId = '1e7ac840-b8c6-44a3-a9c4-94c199b0b865';
  const mockCandidateInterviewId = 'candidate-interview-123';

  const mockCandidate = {
    user_id: 'e7b086da-881e-4a64-b71c-b980f141e635',
    full_name: 'Nguyen Anh Quan',
    email: 'nguyenanhquan01102002@gmail.com',
    phone: '0826206226',
    avatar_url: 'https://res.cloudinary.com/dpnjm82op/image/upload/v1765534853/avatars/1765534853040-f29d1b8a-ebd6-477e-bf86-0a7aa297a7b3.jpg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              🎯 Interview Management - Demo
            </CardTitle>
            <p className="text-slate-600">
              Demo các components quản lý interview và xem câu trả lời ứng viên
            </p>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">Danh sách ứng viên</TabsTrigger>
            <TabsTrigger value="card">Candidate Card</TabsTrigger>
            <TabsTrigger value="answers">Xem câu trả lời</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardContent className="p-6">
                <CandidatesList
                  interviewId={mockInterviewId}
                  onViewCandidate={(candidate) => {
                    setSelectedCandidate(candidate);
                    setSelectedView('answers');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Card Demo */}
          <TabsContent value="card">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Card Component</CardTitle>
                  <p className="text-sm text-slate-600">
                    Component hiển thị thông tin ứng viên với avatar, contact info, status và điểm
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Different states */}
                    <CandidateCard
                      candidate={mockCandidate}
                      status="submitted"
                      score={85}
                      onViewDetails={() => alert('View details')}
                    />
                    <CandidateCard
                      candidate={mockCandidate}
                      status="in_progress"
                      onViewDetails={() => alert('View details')}
                    />
                    <CandidateCard
                      candidate={mockCandidate}
                      status="assigned"
                      onViewDetails={() => alert('View details')}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Hiển thị avatar (fallback nếu không có)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Email, phone, user ID</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Status badge với color coding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Score với progress bar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Hover effects & animations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Answers View */}
          <TabsContent value="answers">
            <Card>
              <CardContent className="p-6">
                <CandidateAnswersView
                  interviewId={mockInterviewId}
                  candidateInterviewId={mockCandidateInterviewId}
                  onBack={() => setSelectedView('list')}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">📚 Components Created</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-900 mb-2">CandidateCard</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Avatar display</li>
                  <li>• Contact info</li>
                  <li>• Status badge</li>
                  <li>• Score meter</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-2">CandidatesList</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Search & filter</li>
                  <li>• Statistics</li>
                  <li>• Sort options</li>
                  <li>• Export CSV</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-2">CandidateAnswersView</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Full candidate info</li>
                  <li>• All answers</li>
                  <li>• Grading interface</li>
                  <li>• Save scores</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewManagementDemo;
