import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Users, DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import NeedsAttentionCard from '../components/admin/AdminDashboard/NeedsAttentionCard';
import RecentActivityCard from '../components/admin/AdminDashboard/RecentActivityCard';
import EnrollmentTrendsChart from '../components/admin/AdminDashboard/EnrollmentTrendsChart';
import PaymentAgingChart from '../components/admin/AdminDashboard/PaymentAgingChart';
import ReportingToolCard from '../components/admin/AdminDashboard/ReportingToolCard';
import {
  getAdminAlerts,
  getAdminActivity,
  getEnrollmentTrends,
  getPaymentAging,
} from '../services/adminDashboard';
import { getAllDepartments } from '../services/departments';

const CURRENT_YEAR = new Date().getFullYear();

// Reporting tool definitions — titles match exact API report types
const REPORTING_TOOLS = [
  {
    reportType: 'student-reports',
    icon: <Users className="w-4 h-4 text-indigo-600" />,
    title: 'Student Reports',
    description: 'Generate enrollment status and student profile reports for administrative needs.',
  },
  {
    reportType: 'academic-transcript',
    icon: <FileText className="w-4 h-4 text-indigo-600" />,
    title: 'Academic Transcript',
    description: 'Generate academic transcripts with grades and credit history for a student.',
  },
  {
    reportType: 'revenue',
    icon: <DollarSign className="w-4 h-4 text-indigo-600" />,
    title: 'Revenue',
    description: 'View and download revenue data including invoice statuses and payment totals.',
  },
  {
    reportType: 'retention',
    icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
    title: 'Retention',
    description: 'Analyze student retention and attrition rates across departments.',
  },
  {
    reportType: 'faculty-workload',
    icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
    title: 'Faculty Workload',
    description: 'Review faculty teaching loads, course assignments, and availability.',
  },
  {
    reportType: 'course-popularity',
    icon: <Calendar className="w-4 h-4 text-indigo-600" />,
    title: 'Course Popularity',
    description: 'Track enrollment trends, course demand, and dropout rates.',
  },
];

const AdminDashboard = () => {
  // --- Alerts State ---
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  // --- Activity State ---
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // --- Enrollment Trends State ---
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [fromYear, setFromYear] = useState(2021);
  const [toYear, setToYear] = useState(CURRENT_YEAR);

  // --- Payment Aging State ---
  const [paymentAgingData, setPaymentAgingData] = useState([]);
  const [totalOverdue, setTotalOverdue] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

  // --- Departments State ---
  const [departments, setDepartments] = useState([]);

  // Fetch alerts
  useEffect(() => {
    setAlertsLoading(true);
    getAdminAlerts()
      .then(res => setAlerts(res.data || []))
      .catch(() => setAlerts([]))
      .finally(() => setAlertsLoading(false));
  }, []);

  // Fetch activity
  useEffect(() => {
    setActivitiesLoading(true);
    getAdminActivity(10)
      .then(res => setActivities(res.data || []))
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false));
  }, []);

  // Fetch enrollment trends (refetch when year range changes)
  const fetchEnrollmentTrends = useCallback(() => {
    setEnrollmentLoading(true);
    getEnrollmentTrends(fromYear, toYear)
      .then(res => setEnrollmentData(res.data || []))
      .catch(() => setEnrollmentData([]))
      .finally(() => setEnrollmentLoading(false));
  }, [fromYear, toYear]);

  useEffect(() => {
    fetchEnrollmentTrends();
  }, [fetchEnrollmentTrends]);

  useEffect(() => {
    setPaymentLoading(true);
    getPaymentAging()
      .then(res => {
        setPaymentAgingData(res.data || []);
        setTotalOverdue(res.total_overdue_students ?? null);
      })
      .catch(() => setPaymentAgingData([]))
      .finally(() => setPaymentLoading(false));
  }, []);

  // Fetch departments for filters
  useEffect(() => {
    getAllDepartments()
      .then(res => setDepartments(res.departments || []))
      .catch(err => console.error("Failed to fetch departments", err));
  }, []);

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
      </div>

      {/* Top Section - Needs Attention & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <NeedsAttentionCard items={alerts} loading={alertsLoading} />
        <RecentActivityCard activities={activities} loading={activitiesLoading} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <EnrollmentTrendsChart
          data={enrollmentData}
          fromYear={fromYear}
          toYear={toYear}
          onFromYearChange={setFromYear}
          onToYearChange={setToYear}
          loading={enrollmentLoading}
        />
        <PaymentAgingChart
          data={paymentAgingData}
          totalOverdue={totalOverdue}
          loading={paymentLoading}
        />
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
          {REPORTING_TOOLS.map((tool) => (
            <ReportingToolCard
              key={tool.reportType}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              reportType={tool.reportType}
              departments={departments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
