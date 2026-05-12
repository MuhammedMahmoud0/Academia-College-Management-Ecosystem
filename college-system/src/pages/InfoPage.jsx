import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoCard from '../components/student/info page/InfoCard';
import { getStudentProfile } from '../services/userProfile';
import Avatar from '@mui/material/Avatar';

export default function Info() {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudentProfile();
    }, []);

    const fetchStudentProfile = async () => {
        try {
            setLoading(true);
            const response = await getStudentProfile();
            const profile = response.studentProfile;
            console.log(response.data);
            // Transform API data to match component structure
            const transformedData = {
                name: profile.full_name || 'N/A',
                major: profile.student_profiles?.departments?.name || 'N/A',
                studentId: profile.student_profiles?.student_id || 'N/A',
                national_id: profile.national_id || 'N/A',
                year: profile.student_profiles?.year_level ? `${profile.student_profiles.year_level}${getYearSuffix(profile.student_profiles.year_level)} Year` : 'N/A',
                gpa: profile.student_profiles?.cgpa ? profile.student_profiles?.cgpa.toFixed(2) : 'N/A',
                total_credits: profile.student_profiles?.total_credits || 0,
                email: profile.email || 'N/A',
                phone: profile.phone || 'N/A',
                address: profile.address || 'N/A',
                avatar_url: profile.avatar_url || null
            };
            
            setStudentData(transformedData);
            setError(null);
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Your account cannot access student profile data.');
                return;
            }
            console.error('Error fetching student profile:', err);
            setError(err.response?.data?.message || 'Failed to load student information');
        } finally {
            setLoading(false);
        }
    };

    const getYearSuffix = (year) => {
        if (year === 1) return 'st';
        if (year === 2) return 'nd';
        if (year === 3) return 'rd';
        return 'th';
    };

    if (loading) {
        return (
            <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button 
                        onClick={fetchStudentProfile}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!studentData) {
        return null;
    }

    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Student Information</h1>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <div className="w-40 h-40 rounded-full flex items-center justify-center">
                            <Avatar
                                alt={studentData.name}
                                src={studentData.avatar_url || "/static/images/avatar/1.jpg"}
                                sx={{ width: 150, height: 150 }}
                            />
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                {studentData.name}
                            </h2>
                            <p className="text-lg text-indigo-600 font-semibold">
                                {studentData.major}
                            </p>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoCard 
                                label="Student ID"
                                value={studentData.studentId}
                            />
                            <InfoCard 
                                label="National ID"
                                value={studentData.national_id}
                            />
                            <InfoCard 
                                label="Year"
                                value={studentData.year}
                            />
                            <InfoCard 
                                label="Cumulative GPA"
                                value={studentData.gpa}
                            />
                            <InfoCard 
                                label="Total Credits"
                                value={studentData.total_credits}
                            />
                            <InfoCard 
                                label="Email Address"
                                value={studentData.email}
                            />
                            <InfoCard 
                                label="Phone"
                                value={studentData.phone}
                            />
                        </div>

                        {/* Address - Full Width */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <InfoCard 
                                label="Address"
                                value={studentData.address}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
