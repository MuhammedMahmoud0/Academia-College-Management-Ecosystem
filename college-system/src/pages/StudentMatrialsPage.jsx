import { useState, useEffect } from 'react';
import LecturesMatrial from '../components/student/Student Matrials/LecturesMatrial';
import ExternalResourses from '../components/student/Student Matrials/ExternalResourses';
import { Search } from '@mui/icons-material';
import { getMaterials, getMaterialsForCourse } from '../services/materialService';
import { getStudentCourses } from '../services/registrationService';

export default function StudentMatrialsPage() {
  const [selectedCourse, setSelectedCourse] = useState(null); // Will be set after fetching schedule
  const [courses, setCourses] = useState([]); // Available courses from student schedule
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student schedule on mount
  useEffect(() => {
    fetchStudentSchedule();
  }, []);

  // Fetch materials when course changes
  useEffect(() => {
    if (selectedCourse && selectedCourse.lectureIds.length > 0) {
      fetchMaterials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const fetchStudentSchedule = async () => {
    try {
      setLoadingSchedule(true);
      setError(null);
      const data = await getStudentCourses();
      
      // Map enrolled courses to the format the page expects
      const extractedCourses = (data?.courses || []).map(course => ({
        courseCode: course.code,
        courseName: course.name,
        lectureIds: [course.id],
      }));
      
      setCourses(extractedCourses);
      
      // Set first course as default selected
      if (extractedCourses.length > 0) {
        setSelectedCourse(extractedCourses[0]);
      }
    } catch (err) {
      console.error('Error fetching student courses:', err);
      setError('Failed to load your courses. Please try again.');
    } finally {
      setLoadingSchedule(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch materials for all lecture IDs of the selected course
      const data = await getMaterialsForCourse(selectedCourse.lectureIds);
      
      // Handle both array and object responses
      const materialsArray = Array.isArray(data) ? data : (data?.materials || []);
      setMaterials(materialsArray);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to load materials. Please try again.');
      setMaterials([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Separate materials into lectures and external resources
  // If url is null/empty, it's a file material; otherwise it's a link
  const lectures = materials.filter(m => !m.url);
  const externalResources = materials.filter(m => m.url);

  // Filter materials based on search query
  const filteredLectures = lectures.filter(lecture =>
    lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredResources = externalResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
         <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Course Materials
        </h1>
       
      </div>
       

      {/* Course Selection and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Course Dropdown */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <select
            value={selectedCourse ? selectedCourse.courseCode : ''}
            onChange={(e) => {
              const course = courses.find(c => c.courseCode === e.target.value);
              setSelectedCourse(course);
            }}
            disabled={loadingSchedule || courses.length === 0}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {loadingSchedule ? (
              <option>Loading courses...</option>
            ) : courses.length === 0 ? (
              <option>No courses found</option>
            ) : (
              courses.map((course) => (
                <option key={course.courseCode} value={course.courseCode}>
                  {course.courseCode}: {course.courseName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loadingSchedule || !selectedCourse}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {(loading || loadingSchedule) ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : !selectedCourse ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses enrolled yet.</p>
        </div>
      ) : (
        <>
          {/* Lecture Materials Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Lecture Materials
            </h2>
            {filteredLectures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredLectures.map((lecture) => (
                  <LecturesMatrial key={lecture.id} lecture={lecture} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No lecture materials found.</p>
            )}
          </div>

          {/* External Resources Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              External Resources
            </h2>
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {filteredResources.map((resource) => (
                  <ExternalResourses key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No external resources found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}