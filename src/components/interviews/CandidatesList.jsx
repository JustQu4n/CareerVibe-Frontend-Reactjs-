/**
 * Candidates List Component
 * Hiển thị danh sách ứng viên đã làm interview
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Filter,
  SortAsc,
  Download,
  Loader2 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getCandidates } from '@/services/employerInterviewService';
import CandidateCard from './CandidateCard';
import { motion } from 'framer-motion';

const CandidatesList = ({ interviewId, onViewCandidate }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadCandidates();
  }, [interviewId]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidates(interviewId);
      setCandidates(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search
  const filteredCandidates = candidates.filter(item => {
    const matchSearch = 
      item.candidate?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidate?.phone?.includes(searchTerm);
    
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchSearch && matchStatus;
  });

  // Sort
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.candidate?.full_name?.localeCompare(b.candidate?.full_name);
      case 'score':
        return (b.total_score || 0) - (a.total_score || 0);
      case 'date':
        return new Date(b.submitted_at || b.assigned_at) - new Date(a.submitted_at || a.assigned_at);
      default:
        return 0;
    }
  });

  // Statistics
  const stats = {
    total: candidates.length,
    submitted: candidates.filter(c => c.status === 'submitted').length,
    inProgress: candidates.filter(c => c.status === 'in_progress').length,
    notStarted: candidates.filter(c => c.status === 'assigned').length,
  };

  const exportToCSV = () => {
    const csv = [
      ['Tên', 'Email', 'Phone', 'Trạng thái', 'Điểm'],
      ...sortedCandidates.map(item => [
        item.candidate?.full_name,
        item.candidate?.email,
        item.candidate?.phone,
        item.status,
        item.total_score || 'N/A',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${interviewId}.csv`;
    a.click();
    toast.success('Đã export danh sách');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <CardTitle>Danh sách ứng viên ({candidates.length})</CardTitle>
            </div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Tổng số</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Đã nộp</p>
              <p className="text-2xl font-bold text-green-900">{stats.submitted}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-600 font-medium">Đang làm</p>
              <p className="text-2xl font-bold text-amber-900">{stats.inProgress}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 font-medium">Chưa làm</p>
              <p className="text-2xl font-bold text-slate-900">{stats.notStarted}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="assigned">Chưa làm</option>
              <option value="in_progress">Đang làm</option>
              <option value="submitted">Đã nộp</option>
              <option value="completed">Hoàn thành</option>
              <option value="timeout">Hết hạn</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="score">Sắp xếp theo điểm</option>
              <option value="date">Sắp xếp theo ngày</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      {sortedCandidates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Không tìm thấy ứng viên phù hợp'
                : 'Chưa có ứng viên nào'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCandidates.map((item, index) => (
            <motion.div
              key={item.candidate_interview_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CandidateCard
                candidate={item.candidate}
                status={item.status}
                score={item.total_score}
                onViewDetails={() => onViewCandidate(item)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
