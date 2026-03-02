import LecturesMatrial from "../components/doctors/Doctor Matrials/LecturesMatrial";
import ExternalResourses from '../components/doctors/Doctor Matrials/ExternalResourses';
import AddMaterialModal from '../components/doctors/Doctor Matrials/AddMaterialModal';
import EditMaterialModal from '../components/doctors/Doctor Matrials/EditMaterialModal';
import DeleteConfirmationModal from '../components/doctors/Doctor Matrials/DeleteConfirmationModal';
import { Search } from '@mui/icons-material';
import { useState, useEffect } from "react";
import { getMaterials, getMaterialsForCourse, createMaterial, updateMaterial, deleteMaterial } from '../services/materialService';
import { getTeacherSchedule, extractCoursesFromSchedule } from '../services/scheduleService';
import { useToast } from '../hooks/useToast';

export default function DoctorMaterialsPage () {
   const toast = useToast();
   const [selectedCourse, setSelectedCourse] = useState(null); // Will be set after fetching schedule
   const [courses, setCourses] = useState([]); // Available courses from teacher schedule
   const [searchQuery, setSearchQuery] = useState('');
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [editingMaterial, setEditingMaterial] = useState(null);
   const [materialToDelete, setMaterialToDelete] = useState(null);
   const [materials, setMaterials] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingSchedule, setLoadingSchedule] = useState(true);
   const [error, setError] = useState(null);

   // Fetch teacher schedule on mount
   useEffect(() => {
     fetchTeacherSchedule();
   }, []);

   // Fetch materials when course changes
   useEffect(() => {
     if (selectedCourse && selectedCourse.lectureIds.length > 0) {
       fetchMaterials();
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedCourse]);

   const fetchTeacherSchedule = async () => {
     try {
       setLoadingSchedule(true);
       setError(null);
       const scheduleData = await getTeacherSchedule();
       
       const extractedCourses = extractCoursesFromSchedule(scheduleData);
       
       setCourses(extractedCourses);
       
       // Set first course as default selected
       if (extractedCourses.length > 0) {
         setSelectedCourse(extractedCourses[0]);
       }
     } catch (err) {
       console.error('Error fetching teacher schedule:', err);
       setError('Failed to load your course schedule. Please try again.');
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

   const handleAddMaterial = async (data) => {
     try {
       setLoading(true);
       setError(null);
       
       if (!selectedCourse || !selectedCourse.lectureIds || selectedCourse.lectureIds.length === 0) {
         toast.warning('Please select a course first.');
         return;
       }

       // Use the first lecture ID of the selected course
       // If a course has multiple lectures, materials will be associated with the primary lecture
       const lectureId = selectedCourse.lectureIds[0];
       
       const materialData = {
         type: data.type,
         lecture_id: lectureId,
       };

       if (data.type === 'file' && data.file) {
         materialData.title = data.fileTitle; // Uses custom title or filename
         materialData.file = data.file;
       } else if (data.type === 'link' && data.link) {
         materialData.title = data.linkTitle;
         materialData.url = data.link;
       }

       console.log('Creating material:', materialData);
       const result = await createMaterial(materialData);
       console.log('Material created:', result);
       await fetchMaterials(); // Refresh the list
       toast.success('Material added successfully!');
     } catch (err) {
       console.error('Error adding material:', err);
       setError('Failed to add material. Please try again.');
       toast.error('Failed to add material. Please try again.');
     } finally {
       setLoading(false);
     }
   };

   const handleEditMaterial = async (data) => {
     try {
       setLoading(true);
       setError(null);
       
       // Only links can be edited (title and URL)
       if (data.type === 'link') {
         await updateMaterial(data.id, {
           title: data.link,
           url: data.link,
         });
         await fetchMaterials(); // Refresh the list
         toast.success('Material updated successfully!');
       } else {
         toast.info('Only link materials can be edited. For files, please delete and re-upload.');
       }
     } catch (err) {
       console.error('Error updating material:', err);
       setError('Failed to update material. Please try again.');
       toast.error('Failed to update material. Please try again.');
     } finally {
       setLoading(false);
     }
   };

   const handleOpenEdit = (material) => {
     setEditingMaterial(material);
     setIsEditModalOpen(true);
   };

   const handleOpenDelete = (material) => {
     setMaterialToDelete(material);
     setIsDeleteModalOpen(true);
   };

   const handleConfirmDelete = async () => {
     if (!materialToDelete) return;
     
     try {
       setLoading(true);
       setError(null);
       await deleteMaterial(materialToDelete.id);
       await fetchMaterials(); // Refresh the list
       toast.success('Material deleted successfully!');
     } catch (err) {
       console.error('Error deleting material:', err);
       setError('Failed to delete material. Please try again.');
       toast.error('Failed to delete material. Please try again.');
     } finally {
       setLoading(false);
       setMaterialToDelete(null);
     }
   };
   
     return (
       <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
         <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Course Materials
        </h1>
          
         </div>
          
   
         {/* Course Selection and Search */}
         <div className="grid grid-cols-1 lg:grid-cols-[4fr_2fr_1fr] gap-3 sm:gap-4 mb-6 sm:mb-8">
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
           {/* add material button */}
              <div className=" rounded-lg p-3 sm:p-4  flex items-center justify-center">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  disabled={loading || loadingSchedule || !selectedCourse}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-400 text-white font-medium py-2 sm:py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
                >
                  + Add Material
                </button>
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
             <p className="text-gray-500 text-lg">No courses assigned to you yet.</p>
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
                     <LecturesMatrial 
                       key={lecture.id} 
                       lecture={lecture} 
                       onEdit={() => handleOpenEdit({ ...lecture, section: 'Lecture Materials', type: 'file' })}
                       onDelete={() => handleOpenDelete(lecture)}
                     />
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
                     <ExternalResourses 
                       key={resource.id} 
                       resource={resource} 
                       onEdit={() => handleOpenEdit({ ...resource, section: 'External Resources', type: 'link' })}
                       onDelete={() => handleOpenDelete(resource)}
                     />
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-500 text-center py-8">No external resources found.</p>
               )}
             </div>
           </>
         )}

         {/* Modals */}
         <AddMaterialModal 
           isOpen={isAddModalOpen}
           onClose={() => setIsAddModalOpen(false)}
           onSave={handleAddMaterial}
           selectedCourse={selectedCourse}
         />
         <EditMaterialModal 
           isOpen={isEditModalOpen}
           onClose={() => setIsEditModalOpen(false)}
           onSave={handleEditMaterial}
           material={editingMaterial}
         />
         <DeleteConfirmationModal 
           isOpen={isDeleteModalOpen}
           onClose={() => {
             setIsDeleteModalOpen(false);
             setMaterialToDelete(null);
           }}
           onConfirm={handleConfirmDelete}
           materialTitle={materialToDelete?.title}
         />
       </div>
    );

}