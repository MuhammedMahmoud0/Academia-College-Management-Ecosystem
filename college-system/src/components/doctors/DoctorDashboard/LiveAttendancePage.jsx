import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { getAccessToken } from '../../../services/apiClient';
import QRCode from 'react-qr-code';
import {
    startAttendanceSession,
    endAttendanceSession,
    toggleStudentAttendance,
    getSessionDetails,
} from '../../../services/attendanceService';
import { getTeacherSchedule } from '../../../services/scheduleService';

const SOCKET_URL = 'https://college-system-backend.onrender.com';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const todayDate = () => new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
const todayName = () => DAYS[new Date().getDay()];

const toExpiryMs = (value) => {
    if (value == null) return null;
    if (typeof value === 'number') {
        // If backend sends small number, treat it as TTL seconds.
        return value > 1e12 ? value : Date.now() + value * 1000;
    }

    const asDate = Date.parse(value);
    if (!Number.isNaN(asDate)) return asDate;

    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) {
        return asNumber > 1e12 ? asNumber : Date.now() + asNumber * 1000;
    }

    return null;
};

const normalizeStudent = (student) => {
    const userId = student?.user_id ?? student?.userId ?? student?.student_user_id ?? student?.id;
    const rawStatus = String(student?.status || '').trim().toLowerCase();
    let status = rawStatus;

    if (!status) {
        if (student?.is_present === true) status = 'present';
        if (student?.is_present === false) status = 'absent';
    }

    if (status === 'attended') status = 'present';
    if (status !== 'present' && status !== 'absent') status = 'absent';

    return {
        ...student,
        user_id: userId,
        status,
    };
};

const normalizeSessionPayload = (raw) => {
    const payload = raw?.data ?? raw;
    const sessionObj = payload?.session || {};

    const studentsRaw =
        payload?.students ||
        payload?.enrolledStudents ||
        payload?.enrolled_students ||
        sessionObj?.students ||
        [];

    const students = Array.isArray(studentsRaw)
        ? studentsRaw.map(normalizeStudent).filter((student) => student.user_id != null)
        : [];

    const presentCountRaw =
        payload?.presentCount ??
        payload?.present_count ??
        sessionObj?.presentCount ??
        sessionObj?.present_count;

    const presentCount =
        presentCountRaw != null
            ? Number(presentCountRaw)
            : students.filter((student) => student.status === 'present').length;

    return {
        sessionId:
            payload?.sessionId ??
            payload?.session_id ??
            sessionObj?.id ??
            sessionObj?.session_id ??
            null,
        qrCode: payload?.qrCode ?? payload?.qr_code ?? sessionObj?.qrCode ?? sessionObj?.qr_code ?? null,
        qrExpiry: payload?.qrExpiry ?? payload?.qr_expiry ?? sessionObj?.qrExpiry ?? sessionObj?.qr_expiry ?? null,
        students,
        presentCount,
    };
};

export default function LiveAttendancePage() {
    const { courseId } = useParams();
    const location = useLocation();
    // courseName can be passed via navigation state from CourseDetailPage
    const courseName = location.state?.courseName || courseId;
    const routeLectureId = location.state?.lectureId ?? location.state?.lecture_id ?? null;
    const routeTutorialLabId = location.state?.tutorialLabId ?? location.state?.tutorial_lab_id ?? null;
    const routeSessionType = String(location.state?.sessionType || location.state?.slotType || '').trim().toLowerCase();

    // ── Today's slots for this course (fetched on mount) ──────────────────────
    const [todaySlots, setTodaySlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [slotsLoading, setSlotsLoading] = useState(true);

    // ── Session state ─────────────────────────────────────────────────────────
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [countdown, setCountdown] = useState(null);

    // ── Students state ────────────────────────────────────────────────────────
    const [students, setStudents] = useState([]);
    const [presentCount, setPresentCount] = useState(0);

    // ── UI state ──────────────────────────────────────────────────────────────
    const [starting, setStarting] = useState(false);
    const [ending, setEnding] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [error, setError] = useState(null);

    // ── Refs ──────────────────────────────────────────────────────────────────
    const socketRef = useRef(null);
    const countdownRef = useRef(null);
    const qrExpiryRef = useRef(null);
    const pollRef = useRef(null);
    const sessionIdRef = useRef(null);

    // ── Fetch today's schedule slots for this course on mount ─────────────────
    useEffect(() => {
        const fetchSlots = async () => {
            setSlotsLoading(true);
            try {
                const data = await getTeacherSchedule();
                const today = todayName();
                const dayEntry = (data.schedule || []).find(d => d.day === today);
                const slots = (dayEntry?.slots || []).filter(
                    s => s.courseCode === courseId
                );
                setTodaySlots(slots);

                const explicitMatchedSlot = slots.find((slot) => {
                    const slotLectureId = slot?.lectureId ?? slot?.lecture_id;
                    const slotTutorialLabId = slot?.tutorialLabId ?? slot?.tutorial_lab_id;

                    if (routeTutorialLabId != null && String(slotTutorialLabId) === String(routeTutorialLabId)) {
                        return true;
                    }

                    if (routeLectureId != null && String(slotLectureId) === String(routeLectureId)) {
                        return true;
                    }

                    return false;
                });

                if (explicitMatchedSlot) {
                    setSelectedSlot(explicitMatchedSlot);
                } else if (slots.length === 1 && routeLectureId == null && routeTutorialLabId == null) {
                    setSelectedSlot(slots[0]);
                }
            } catch {
                // Non-critical – doctor can still try to start
            } finally {
                setSlotsLoading(false);
            }
        };
        fetchSlots();
    }, [courseId, routeLectureId, routeTutorialLabId]);

    // ── QR countdown ─────────────────────────────────────────────────────────
    const startCountdown = useCallback((expiryValue) => {
        const expiryMs = toExpiryMs(expiryValue);
        if (!expiryMs) return;

        qrExpiryRef.current = expiryMs;
        if (countdownRef.current) clearInterval(countdownRef.current);
        const tick = () => {
            const remaining = Math.max(0, Math.floor((qrExpiryRef.current - Date.now()) / 1000));
            setCountdown(remaining);
        };
        tick();
        countdownRef.current = setInterval(tick, 1000);
    }, []);

    // ── Apply a full session snapshot (used by both socket and polling) ────────
    const applySnapshot = useCallback((rawData) => {
        const data = normalizeSessionPayload(rawData);

        if (Array.isArray(data.students)) setStudents(data.students);
        if (data.presentCount != null && !Number.isNaN(data.presentCount)) setPresentCount(data.presentCount);
        if (data.qrCode) setQrCode(data.qrCode);
        if (data.qrExpiry) startCountdown(data.qrExpiry);
    }, [startCountdown]);

    // ── Polling fallback: re-fetches session state every 3 s ─────────────────
    const startPolling = useCallback((sid) => {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
            try {
                const data = await getSessionDetails(sid);
                applySnapshot(data);
            } catch {
                // Silently ignore poll errors
            }
        }, 3000);
    }, [applySnapshot]);

    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    // ── Socket.io setup ───────────────────────────────────────────────────────
    const setupSocket = useCallback((sid) => {
        const socket = io(SOCKET_URL, {
            auth: { token: getAccessToken() },
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            socket.emit('join_session', { sessionId: sid });
        });

        // Handle attendance update — try several common backend event names
        const handleAttendanceEvent = (data) => {
            // Full snapshot response (has students array)
            if (Array.isArray(data?.students)) {
                applySnapshot(data);
                return;
            }
            // Single-student update
            if (data?.student) {
                setStudents(prev =>
                    prev.map(s =>
                        s.user_id === data.student.user_id
                            ? { ...s, status: data.student.status }
                            : s
                    )
                );
                if (data.presentCount != null) setPresentCount(data.presentCount);
            }
        };

        // Register every plausible event name the backend may emit
        [
            'attendance_update',
            'attendance_updated',
            'student_attended',
            'student_marked',
            'attendance_marked',
            'session_update',
        ].forEach(evt => socket.on(evt, handleAttendanceEvent));

        // Backend rotates QR code before it expires
        const handleQrEvent = (data) => {
            if (data?.qrCode) setQrCode(data.qrCode);
            if (data?.qrExpiry) startCountdown(data.qrExpiry);
        };
        ['qr_update', 'qr_updated', 'new_qr'].forEach(evt => socket.on(evt, handleQrEvent));

        socket.on('connect_error', (err) => {
            console.warn('Socket connection error:', err.message);
        });

        socketRef.current = socket;
    }, [startCountdown, applySnapshot]);

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            if (countdownRef.current) clearInterval(countdownRef.current);
            stopPolling();
        };
    }, [stopPolling]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleStartSession = async () => {
        setStarting(true);
        setError(null);
        try {
            const payload = {
                session_date: todayDate(),
                isLive: true,
            };

            const selectedSlotType = String(selectedSlot?.type || '').toLowerCase();
            const selectedLectureId = selectedSlot?.lectureId ?? selectedSlot?.lecture_id;
            const selectedTutorialLabId = selectedSlot?.tutorialLabId ?? selectedSlot?.tutorial_lab_id;

            const isRouteTutorialLike = routeSessionType === 'tutorial' || routeSessionType === 'lab' || routeSessionType === 'tutorial_lab';

            if (routeTutorialLabId != null || (isRouteTutorialLike && routeLectureId != null)) {
                // Explicit route id wins to avoid starting session for a different slot of the same course.
                payload.tutorial_lab_id = routeTutorialLabId ?? routeLectureId;
            } else if (routeLectureId != null) {
                // Explicit lecture id from navigation state.
                payload.lecture_id = routeLectureId;
            } else if (selectedSlot) {
                if (selectedSlotType === 'lecture' && selectedLectureId) {
                    payload.lecture_id = selectedLectureId;
                } else if (selectedTutorialLabId) {
                    payload.tutorial_lab_id = selectedTutorialLabId;
                } else if (selectedLectureId) {
                    payload.lecture_id = selectedLectureId;
                }
            }

            const startRes = await startAttendanceSession(payload);
            const startData = normalizeSessionPayload(startRes);
            const nextSessionId = startData.sessionId;

            if (!nextSessionId) {
                throw new Error('Session started but session id is missing in the response.');
            }

            setSessionId(nextSessionId);
            sessionIdRef.current = nextSessionId;

            if (startData.qrCode) setQrCode(startData.qrCode);
            if (startData.qrExpiry) startCountdown(startData.qrExpiry);

            if (startData.students.length > 0) {
                setStudents(startData.students);
                setPresentCount(startData.presentCount);
            } else {
                // Ensure roster appears even if start endpoint omits enrolled students.
                try {
                    const detailsData = await getSessionDetails(nextSessionId);
                    applySnapshot(detailsData);
                } catch {
                    setStudents([]);
                    setPresentCount(0);
                }
            }

            setSessionStarted(true);
            setupSocket(nextSessionId);
            startPolling(nextSessionId);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to start session.');
        } finally {
            setStarting(false);
        }
    };

    const handleEndSession = async () => {
        if (!sessionId) return;
        setEnding(true);
        setError(null);
        try {
            await endAttendanceSession(sessionId);
            socketRef.current?.disconnect();
            if (countdownRef.current) clearInterval(countdownRef.current);
            stopPolling();
            setSessionStarted(false);
            setSessionId(null);
            sessionIdRef.current = null;
            setQrCode(null);
            setStudents([]);
            setPresentCount(0);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to end session.');
        } finally {
            setEnding(false);
        }
    };

    const handleToggle = async (studentUserId) => {
        if (!sessionId || togglingId) return;
        setTogglingId(studentUserId);
        setError(null);
        try {
            const data = await toggleStudentAttendance(sessionId, studentUserId);
            if (data?.student) {
                setStudents(prev =>
                    prev.map(s =>
                        s.user_id === data.student.user_id
                            ? { ...s, status: data.student.status }
                            : s
                    )
                );
            }
            if (data?.presentCount != null) setPresentCount(data.presentCount);
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to update attendance.');
        } finally {
            setTogglingId(null);
        }
    };

    const presentStudents = students.filter(s => s.status === 'present');
    const absentStudents = students.filter(s => s.status === 'absent');

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to={`/dashboard/doctor/course/${courseId}`}
                    state={{ 
                        courseCode: location.state?.courseCode || courseId, 
                        courseName, 
                        lectureId: routeLectureId,
                        tutorialLabId: routeTutorialLabId,
                        sessionType: routeSessionType,
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 w-fit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Course</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Live Attendance</h1>
                <p className="text-indigo-600 font-medium">{courseName}</p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Pre-session state ───────────────────────────────────────────── */}
            {!sessionStarted && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-lg mx-auto text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Take Attendance?</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        {slotsLoading
                            ? 'Loading today\'s schedule…'
                            : todaySlots.length === 0
                                ? `No sessions scheduled for ${courseId} today. You can still start a manual session.`
                                : `Session for ${todayDate()}`}
                    </p>

                    {/* Slot picker when multiple slots today */}
                    {!slotsLoading && todaySlots.length > 1 && (
                        <div className="mb-6 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select today's session
                            </label>
                            <div className="space-y-2">
                                {todaySlots.map((slot, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                                            selectedSlot === slot
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="font-medium text-gray-900 capitalize">{slot.type}</span>
                                        <span className="text-gray-500 text-sm ml-2">
                                            {slot.startTime} – {slot.endTime} · {slot.location}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleStartSession}
                        disabled={starting || slotsLoading || (todaySlots.length > 1 && !selectedSlot)}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {starting ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Starting…
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Session
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* ── Active session ──────────────────────────────────────────────── */}
            {sessionStarted && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* QR Code Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan to Mark Attendance</h2>
                        <div className="flex flex-col items-center flex-1 mb-6">
                            {qrCode ? (
                                <>
                                    <div className="p-4 bg-white border-4 border-gray-900 rounded-lg mb-4">
                                        <QRCode
                                            value={qrCode}
                                            size={220}
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                            level="M"
                                        />
                                    </div>
                                    {countdown != null && (
                                        <p className="text-sm text-gray-500">
                                            New QR code in{' '}
                                            <span className={`font-semibold ${countdown <= 10 ? 'text-red-500' : ''}`}>
                                                {countdown}s
                                            </span>
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="w-[220px] h-[220px] bg-gray-100 rounded-lg animate-pulse" />
                            )}
                        </div>
                        <button
                            onClick={handleEndSession}
                            disabled={ending}
                            className="cursor-pointer w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {ending ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Ending…
                                </>
                            ) : 'End Session'}
                        </button>
                    </div>

                    {/* Student Roster */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Student Roster ({presentCount} / {students.length})
                        </h2>

                        {students.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm">Waiting for students to join…</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Present */}
                                <div>
                                    <h3 className="text-sm font-semibold text-green-600 mb-3">
                                        Present ({presentStudents.length})
                                    </h3>
                                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                        {presentStudents.map((student) => (
                                            <div
                                                key={student.user_id}
                                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-gray-700 truncate">
                                                        {student.full_name || student.student_id || student.user_id}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleToggle(student.user_id)}
                                                    disabled={togglingId === student.user_id}
                                                    className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-2 shrink-0 disabled:opacity-50"
                                                >
                                                    {togglingId === student.user_id ? '…' : 'Mark Absent'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Absent */}
                                <div>
                                    <h3 className="text-sm font-semibold text-red-600 mb-3">
                                        Absent ({absentStudents.length})
                                    </h3>
                                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                        {absentStudents.map((student) => (
                                            <div
                                                key={student.user_id}
                                                className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm text-gray-700 truncate">
                                                        {student.full_name || student.student_id || student.user_id}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleToggle(student.user_id)}
                                                    disabled={togglingId === student.user_id}
                                                    className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-2 shrink-0 disabled:opacity-50"
                                                >
                                                    {togglingId === student.user_id ? '…' : 'Mark Present'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
