import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { AlertCircle, ArrowLeft, BookOpen, GraduationCap, Mail, MapPin, Phone, RefreshCw, UserRound } from 'lucide-react';
import {
  getManagedStudentGradesHistory,
  getManagedStudentProfile,
} from '../../../services/userManagementProfiles';

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }

  const text = String(value).trim();
  return text ? text : '-';
};

const formatCgpa = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : '-';
};

const formatYear = (value) => {
  const year = Number(value);
  return Number.isFinite(year) && year > 0 ? `${year}` : '-';
};

const getInitials = (name) => {
  const parts = String(name || '').trim().split(' ').filter(Boolean);
  if (!parts.length) {
    return 'ST';
  }

  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
};

const summaryCards = (student) => [
  {
    label: 'Academic Year',
    value: formatYear(student.year),
    icon: GraduationCap,
    tone: 'from-sky-50 to-blue-50 text-sky-700',
  },
  {
    label: 'Cumulative GPA',
    value: formatCgpa(student.cgpa),
    icon: BookOpen,
    tone: 'from-emerald-50 to-teal-50 text-emerald-700',
  },
];

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="break-words text-sm font-medium text-slate-800">{normalizeText(value)}</p>
  </div>
);

export default function ManagementStudentProfile() {
  const { studentId } = useParams();
  const [profile, setProfile] = useState(null);
  const [gradesHistory, setGradesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudentProfileData = async () => {
    if (!studentId) {
      setError('Missing student ID in route.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const [profileResponse, gradesResponse] = await Promise.all([
        getManagedStudentProfile(studentId),
        getManagedStudentGradesHistory(studentId),
      ]);

      const student = profileResponse?.student || {};
      setProfile({
        name: student?.name || student?.full_name || 'Unknown Student',
        student_id: student?.student_id || studentId,
        avatar_url: student?.avatar_url || '',
        email: student?.email || '',
        phone: student?.phone || '',
        address: student?.address || '',
        department: student?.department || '',
        year: student?.year,
        cgpa: student?.cgpa,
      });
      setGradesHistory(Array.isArray(gradesResponse?.grades_history) ? gradesResponse.grades_history : []);
    } catch (requestError) {
      setProfile(null);
      setGradesHistory([]);
      setError(
        requestError?.response?.data?.message
          || requestError?.response?.data?.error
          || 'Failed to load student profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfileData();
  }, [studentId]);

  const cards = useMemo(() => summaryCards(profile || {}), [profile]);

  if (loading) {
    return (
      <div className="max-w-8xl rounded-2xl bg-slate-50 px-4 py-6 sm:px-6 md:px-8">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading student profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-8xl rounded-2xl bg-slate-50 px-4 py-6 sm:px-6 md:px-8">
        <Link
          to="/dashboard/user-management"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User Management
        </Link>

        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Couldn&apos;t load this profile</h1>
            <p className="mb-6 text-sm text-slate-600">{error}</p>
            <button
              onClick={fetchStudentProfileData}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-8xl rounded-2xl bg-slate-50 px-4 py-6 sm:px-6 md:px-8">
      <Link
        to="/dashboard/user-management"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Management
      </Link>

      <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar
                src={profile.avatar_url || undefined}
                alt={profile.name}
                sx={{ width: 92, height: 92, fontSize: 32, bgcolor: '#1e3a8a' }}
              >
                {getInitials(profile.name)}
              </Avatar>
              <div>
                <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100">
                  Student Profile
                </div>
                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  <span className="rounded-full bg-white/10 px-3 py-1">ID: {normalizeText(profile.student_id)}</span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-200">
                    {normalizeText(profile.department)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {cards.map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className={`min-w-[170px] rounded-2xl bg-gradient-to-br p-4 ${tone}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Contact & Details</h2>
            <p className="mt-1 text-sm text-slate-500">Core profile information returned by the management APIs.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <DetailItem icon={Mail} label="Email" value={profile.email} />
            <DetailItem icon={Phone} label="Phone" value={profile.phone} />
            <DetailItem icon={MapPin} label="Address" value={profile.address} />
            <DetailItem icon={UserRound} label="Department" value={profile.department} />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">Grade History</h2>
            <p className="mt-1 text-sm text-slate-500">Course results grouped by semester and year.</p>
          </div>

          {gradesHistory.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center text-slate-500">
              <BookOpen className="mb-4 h-10 w-10 text-slate-300" />
              <p className="text-base font-medium text-slate-700">No grade history found</p>
              <p className="mt-1 text-sm">This student does not have any recorded grade entries yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Course Code</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Course Name</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Semester</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Year</th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {gradesHistory.map((entry, index) => (
                    <tr key={`${entry?.course_code || 'course'}-${entry?.semester || 'sem'}-${entry?.year || index}`} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{normalizeText(entry?.course_code)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{normalizeText(entry?.course_name)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{normalizeText(entry?.semester)}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{normalizeText(entry?.year)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {normalizeText(entry?.grade)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
