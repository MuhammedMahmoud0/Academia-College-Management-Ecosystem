import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { AlertCircle, ArrowLeft, Building2, Mail, MapPin, Phone, RefreshCw, UserRound } from 'lucide-react';
import {
  getManagedDoctorCourses,
  getManagedDoctorProfile,
  getManagedTeachingAssistantCourses,
  getManagedTeachingAssistantProfile,
} from '../../../services/userManagementProfiles';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ROLE_CONFIG = {
  doctor: {
    label: 'Doctor',
    profile: getManagedDoctorProfile,
    courses: getManagedDoctorCourses,
    accent: 'from-sky-50 to-indigo-50 text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
  },
  teaching_assistant: {
    label: 'Teaching Assistant',
    profile: getManagedTeachingAssistantProfile,
    courses: getManagedTeachingAssistantCourses,
    accent: 'from-emerald-50 to-teal-50 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
  },
};

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return '-';
  }

  const text = String(value).trim();
  return text ? text : '-';
};

const getInitials = (name) => {
  const parts = String(name || '').trim().split(' ').filter(Boolean);
  if (!parts.length) {
    return 'ST';
  }

  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join('');
};

const normalizeRoleHint = (role) => {
  return role === 'doctor' || role === 'teaching_assistant' ? role : '';
};

const normalizeStaffProfile = (response, resolvedRole, fallbackId) => {
  const raw =
    response?.doctor
    || response?.teaching_assistant
    || response?.staff
    || {};

  return {
    name: raw?.name || raw?.full_name || 'Unknown Staff Member',
    id: raw?.id || fallbackId,
    avatar_url: raw?.avatar_url || '',
    email: raw?.email || '',
    phone: raw?.phone || '',
    address: raw?.address || '',
    department: raw?.department || '',
    role: resolvedRole,
  };
};

const getSlotIdentifier = (slot) => {
  return slot?.lectureId || slot?.tutorialLabId || slot?.id || `${slot?.courseCode || 'slot'}-${slot?.startTime || ''}`;
};

const getSlotTypeStyles = (type) => {
  if (String(type || '').toLowerCase() === 'lab') {
    return {
      card: 'from-emerald-50 to-teal-50 border-emerald-500',
      badge: 'bg-emerald-600',
      type: 'bg-emerald-100 text-emerald-700',
    };
  }

  return {
    card: 'from-sky-50 to-indigo-50 border-sky-500',
    badge: 'bg-sky-600',
    type: 'bg-sky-100 text-sky-700',
  };
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="break-words text-sm font-medium text-slate-800">{normalizeText(value)}</p>
  </div>
);

const SlotCard = ({ slot }) => {
  const styles = getSlotTypeStyles(slot?.type);

  return (
    <div className={`rounded-2xl border-l-4 bg-gradient-to-br p-4 shadow-sm ${styles.card}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white ${styles.badge}`}>
          {normalizeText(slot?.startTime)} - {normalizeText(slot?.endTime)}
        </span>
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${styles.type}`}>
          {normalizeText(slot?.type)}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-900">{normalizeText(slot?.courseName)}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {normalizeText(slot?.courseCode)}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
        <MapPin className="h-3.5 w-3.5" />
        {normalizeText(slot?.location)}
      </div>
    </div>
  );
};

const fetchByRole = async (userId, role) => {
  const config = ROLE_CONFIG[role];
  const [profileResponse, coursesResponse] = await Promise.all([
    config.profile(userId),
    config.courses(userId),
  ]);

  return {
    resolvedRole: role,
    profileResponse,
    coursesResponse,
  };
};

export default function ManagementDoctorsProfile() {
  const { userId } = useParams();
  const location = useLocation();
  const initialRoleHint = normalizeRoleHint(location.state?.userRole);

  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [resolvedRole, setResolvedRole] = useState(initialRoleHint);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStaffProfileData = async () => {
    if (!userId) {
      setError('Missing staff user ID in route.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      let result;
      const roleHint = normalizeRoleHint(location.state?.userRole) || resolvedRole;

      if (roleHint) {
        try {
          result = await fetchByRole(userId, roleHint);
        } catch (roleError) {
          if (roleError?.response?.status !== 404) {
            throw roleError;
          }

          const fallbackRole = roleHint === 'doctor' ? 'teaching_assistant' : 'doctor';
          result = await fetchByRole(userId, fallbackRole);
        }
      } else {
        try {
          result = await fetchByRole(userId, 'doctor');
        } catch (doctorError) {
          if (doctorError?.response?.status !== 404) {
            throw doctorError;
          }
          result = await fetchByRole(userId, 'teaching_assistant');
        }
      }

      const nextRole = result?.resolvedRole || 'doctor';
      setResolvedRole(nextRole);
      setProfile(normalizeStaffProfile(result.profileResponse, nextRole, userId));
      setSchedule(Array.isArray(result?.coursesResponse?.schedule) ? result.coursesResponse.schedule : []);
    } catch (requestError) {
      setProfile(null);
      setSchedule([]);
      setError(
        requestError?.response?.data?.message
          || requestError?.response?.data?.error
          || 'Failed to load staff profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffProfileData();
  }, [userId]);

  const scheduleByDay = useMemo(() => {
    const mapped = new Map(DAYS.map((day) => [day, []]));

    schedule.forEach((dayEntry) => {
      mapped.set(dayEntry?.day, Array.isArray(dayEntry?.slots) ? dayEntry.slots : []);
    });

    return mapped;
  }, [schedule]);

  const totalSlots = useMemo(() => {
    return schedule.reduce((sum, dayEntry) => sum + (Array.isArray(dayEntry?.slots) ? dayEntry.slots.length : 0), 0);
  }, [schedule]);

  const roleConfig = ROLE_CONFIG[resolvedRole] || ROLE_CONFIG.doctor;

  if (loading) {
    return (
      <div className="max-w-8xl rounded-2xl bg-slate-50 px-4 py-6 sm:px-6 md:px-8">
        <div className="flex min-h-[320px] items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <RefreshCw className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading staff profile...</p>
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
              onClick={fetchStaffProfileData}
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
                sx={{ width: 92, height: 92, fontSize: 32, bgcolor: '#0f766e' }}
              >
                {getInitials(profile.name)}
              </Avatar>
              <div>
                <div className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${roleConfig.badge}`}>
                  {roleConfig.label} Profile
                </div>
                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                  <span className="rounded-full bg-white/10 px-3 py-1">User ID: {normalizeText(profile.id)}</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">{normalizeText(profile.department)}</span>
                </div>
              </div>
            </div>

            <div className={`min-w-[200px] rounded-2xl bg-gradient-to-br p-5 ${roleConfig.accent}`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">Weekly Sessions</span>
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{totalSlots}</p>
              <p className="mt-1 text-sm text-slate-700">Total scheduled lectures and labs this week.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-[1fr_1.55fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Contact & Details</h2>
            <p className="mt-1 text-sm text-slate-500">Core information returned by the management staff profile API.</p>
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
            <h2 className="text-xl font-bold text-slate-900">Weekly Schedule</h2>
            <p className="mt-1 text-sm text-slate-500">Schedule data shown in the same day-by-day format used across teacher pages.</p>
          </div>

          {totalSlots === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center text-slate-500">
              <Building2 className="mb-4 h-10 w-10 text-slate-300" />
              <p className="text-base font-medium text-slate-700">No sessions scheduled</p>
              <p className="mt-1 text-sm">This staff member does not have any lectures or labs assigned this week.</p>
            </div>
          ) : (
            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              {DAYS.map((day) => {
                const daySlots = scheduleByDay.get(day) || [];

                return (
                  <div key={day} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">{day}</h3>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                        {daySlots.length} {daySlots.length === 1 ? 'slot' : 'slots'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {daySlots.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-400">
                          Free day
                        </div>
                      ) : (
                        daySlots.map((slot) => (
                          <SlotCard key={getSlotIdentifier(slot)} slot={slot} />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
