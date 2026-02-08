import React, { useState } from 'react';
import { ChevronDown, FileText, Users, DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import NeedsAttentionCard from '../components/admin/AdminDashboard/NeedsAttentionCard';
import RecentActivityCard from '../components/admin/AdminDashboard/RecentActivityCard';
import EnrollmentTrendsChart from '../components/admin/AdminDashboard/EnrollmentTrendsChart';
import PaymentAgingChart from '../components/admin/AdminDashboard/PaymentAgingChart';
import ReportingToolCard from '../components/admin/AdminDashboard/ReportingToolCard';

const AdminDashboard = () => {
  
  const [selectedSemester] = useState('This Semester');

  // Needs Attention Data
  const needsAttentionItems = [
    {
      type: 'error',
      message: '15 Students have payments overdue by 30+ days.'
    },
    {
      type: 'warning',
      message: 'Course CS462 is at 98% capacity.'
    },
    {
      type: 'info',
      message: '3 New Faculty accounts need activation.'
    }
  ];

  // Recent Activity Data
  const recentActivities = [
    {
      description: 'Payment of $2,150.00 received from student John Doe.',
      time: 'Just now'
    },
    {
      description: 'Dr. Smith added new materials to Machine Learning.',
      time: '2 hours ago'
    },
    {
      description: '18 new students enrolled in Computer Design.',
      time: '3 hours ago'
    },
    {
      description: 'System maintenance scheduled for Oct 25, 2 AM.',
      time: 'Yesterday'
    }
  ];

  // Enrollment Trends Data
  const enrollmentData = [
    { label: '2021', value: 1800 },
    { label: '2022', value: 2400 },
    { label: '2023', value: 2600 },
    { label: '2024', value: 2900 },
    { label: '2025', value: 3200 }
  ];

  // Payment Aging Data
  const paymentAgingData = [
    { category: '0-30 Days', value: 3000 },
    { category: '31-60 Days', value: 4000 },
    { category: '60+ Days', value: 3000 }
  ];

  // Reporting Tools Data (only 6 cards)
  const reportingTools = [
    {
      icon: <FileText className="w-4 h-4 text-indigo-600" />,
      title: 'Student Reports',
      description: 'Generate enrollment status reports for various administrative needs.'
    },
    {
      icon: <DollarSign className="w-4 h-4 text-indigo-600" />,
      title: 'Academic Transcript',
      description: 'Generate academic transcripts for students.'
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
      title: 'Revenue Demographics',
      description: 'View and download revenue data by demographics.'
    },
    {
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      title: 'Retention & Attrition',
      description: 'Analyze student retention and attrition rates.'
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
      title: 'Faculty Workload',
      description: 'Review faculty teaching load and availability.'
    },
    {
      icon: <Calendar className="w-4 h-4 text-indigo-600" />,
      title: 'Course Popularity',
      description: 'Track enrollment trends and course demand.'
    }
  ];

  return (
  <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <span className="text-sm text-gray-700">{selectedSemester}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Top Section - Needs Attention & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NeedsAttentionCard items={needsAttentionItems} />
        <RecentActivityCard activities={recentActivities} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EnrollmentTrendsChart data={enrollmentData} />
        <PaymentAgingChart data={paymentAgingData} />
      </div>

      {/* Reporting Tools Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Reporting Tools</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate and export detailed reports for various administrative needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportingTools.map((tool, index) => (
            <ReportingToolCard
              key={index}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
