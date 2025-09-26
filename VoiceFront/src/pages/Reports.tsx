'use client';

/* 파일 설명: 신고 관리 페이지 컴포넌트.
   - 신고 목록, 상세 모달, 상태/우선순위 배지, 필터/액션 UI 포함.
   - 상태 변경/삭제 등은 로컬 상태로 처리하며, 실제 운영에서는 API 연동으로 대체합니다. */

import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

interface Report {
  id: string;
  timestamp: Date;
  callId: string;
  phoneNumber: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      timestamp: new Date('2024-01-15T14:20:00'),
      callId: 'call-123',
      phoneNumber: '02-1234-5678',
      reason: '보이스피싱 의심',
      description: '계좌 정보를 요구하며 급하게 압박했습니다.',
      status: 'investigating',
      priority: 'high',
    },
    {
      id: '2',
      timestamp: new Date('2024-01-14T10:30:00'),
      callId: 'call-122',
      phoneNumber: '031-1234-5678',
      reason: '스팸 통화',
      description: '지속적으로 광고성 통화를 걸어왔습니다.',
      status: 'resolved',
      priority: 'medium',
    },
    {
      id: '3',
      timestamp: new Date('2024-01-13T16:45:00'),
      callId: 'call-121',
      phoneNumber: '010-9999-8888',
      reason: '사기 의심',
      description: '가짜 은행 직원을 사칭하며 개인정보를 요구했습니다.',
      status: 'pending',
      priority: 'urgent',
    },
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'investigating' | 'resolved'>('all');

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusBadge = (status: Report['status']) => {
    const statusConfig = {
      pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
      investigating: { label: '조사중', color: 'bg-blue-100 text-blue-800' },
      resolved: { label: '해결됨', color: 'bg-green-100 text-green-800' },
      dismissed: { label: '기각됨', color: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Report['priority']) => {
    const priorityConfig = {
      low: { label: '낮음', color: 'bg-gray-100 text-gray-800' },
      medium: { label: '보통', color: 'bg-blue-100 text-blue-800' },
      high: { label: '높음', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: '긴급', color: 'bg-red-100 text-red-800' },
    };
    
    const config = priorityConfig[priority];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (reportId: string, newStatus: Report['status']) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
    console.log(`Report ${reportId} status updated to ${newStatus}`);
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('이 신고를 삭제하시겠습니까?')) {
      setReports(prev => prev.filter(report => report.id !== reportId));
      console.log(`Report ${reportId} deleted`);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Layout currentPath="/reports">
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">신고 관리</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              보이스피싱 및 의심 통화 신고를 관리하세요.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" size="md">
              내보내기
            </Button>
            <Button variant="primary" size="md">
              새 신고
            </Button>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            전체 ({reports.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            대기중 ({reports.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('investigating')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'investigating'
                ? 'bg-blue-100 text-blue-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            조사중 ({reports.filter(r => r.status === 'investigating').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-green-100 text-green-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            해결됨 ({reports.filter(r => r.status === 'resolved').length})
          </button>
        </div>

        {/* 신고 목록 */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="text-center py-12">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">신고 내역이 없습니다</p>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleReportClick(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {report.phoneNumber}
                      </h3>
                      {getStatusBadge(report.status)}
                      {getPriorityBadge(report.priority)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {report.reason} • {formatDate(report.timestamp)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-200 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleReportClick(report);
                      }}
                    >
                      상세보기
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* 신고 상세 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="신고 상세 정보"
          size="lg"
        >
          {selectedReport && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">전화번호</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedReport.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">신고 시간</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(selectedReport.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">신고 사유</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">우선순위</label>
                  <div className="mt-1">
                    {getPriorityBadge(selectedReport.priority)}
                  </div>
                </div>
              </div>

              {/* 신고 내용 */}
              <div>
                <label className="text-sm font-medium text-gray-500">신고 내용</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>
              </div>

              {/* 상태 업데이트 */}
              <div>
                <label className="text-sm font-medium text-gray-500">상태 변경</label>
                <div className="mt-2 flex space-x-2">
                  <select
                    value={selectedReport.status}
                    onChange={(e) => handleStatusUpdate(selectedReport.id, e.target.value as Report['status'])}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">대기중</option>
                    <option value="investigating">조사중</option>
                    <option value="resolved">해결됨</option>
                    <option value="dismissed">기각됨</option>
                  </select>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-between">
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReport(selectedReport.id)}
                >
                  삭제
                </Button>
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    닫기
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    저장
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Reports;
