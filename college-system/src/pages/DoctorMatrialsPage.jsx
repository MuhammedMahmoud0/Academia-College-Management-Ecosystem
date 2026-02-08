import LecturesMatrial from "../components/doctors/Doctor Matrials/LecturesMatrial";
import ExternalResourses from '../components/doctors/Doctor Matrials/ExternalResourses';
import AddMaterialModal from '../components/doctors/Doctor Matrials/AddMaterialModal';
import EditMaterialModal from '../components/doctors/Doctor Matrials/EditMaterialModal';
import { Search } from '@mui/icons-material';
import { useState } from "react";
export default function DoctorMaterialsPage () {
   const [selectedCourse, setSelectedCourse] = useState('CS462');
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingMaterial, setEditingMaterial] = useState(null);
   
     const lectures = [
       {
         id: 1,
         title: 'Lecture 1 - Intro to ML.pdf',
         uploadDate: '2025-09-05',
       },
       {
         id: 2,
         title: 'Lecture 2 - Supervised Learning.pdf',
         uploadDate: '2025-09-12',
       },
     ];
   
     const externalResources = [
       {
         id: 1,
         title: 'Google AI Blog',
         uploadDate: '2025-09-15',
         url: 'https://ai.googleblog.com',
       },
     ];

     const handleAddMaterial = (data) => {
       console.log('Adding material:', data);
       // Add your logic to save the material
     };

     const handleEditMaterial = (data) => {
       console.log('Editing material:', data);
       // Add your logic to update the material
     };

     const handleOpenEdit = (material) => {
       setEditingMaterial(material);
       setIsEditModalOpen(true);
     };

     const handleDelete = (id) => {
       console.log('Deleting material:', id);
       // Add your logic to delete the material
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
               value={selectedCourse}
               onChange={(e) => setSelectedCourse(e.target.value)}
               className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
             >
               <option value="CS462">CS462: Machine Learning</option>
               <option value="CS101">CS101: Introduction to Programming</option>
               <option value="CS201">CS201: Data Structures</option>
               <option value="CS301">CS301: Algorithms</option>
             </select>
           </div>
   
           {/* Search Bar */}
           <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search materials..."
                 className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
               />
             </div>
           </div>
           {/* add material button */}
              <div className=" rounded-lg p-3 sm:p-4  flex items-center justify-center">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium py-2 sm:py-2.5 md:py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
                >
                  + Add Material
                </button>
              </div>
         </div>
   
         {/* Lecture Materials Section */}
         <div className="mb-6 sm:mb-8">
           <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
             Lecture Materials
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
             {lectures.map((lecture) => (
               <LecturesMatrial 
                 key={lecture.id} 
                 lecture={lecture} 
                 onEdit={() => handleOpenEdit({ ...lecture, section: 'Lecture Materials', type: 'file' })}
                 onDelete={() => handleDelete(lecture.id)}
               />
             ))}
           </div>
         </div>
   
         {/* External Resources Section */}
         <div>
           <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
             External Resources
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
             {externalResources.map((resource) => (
               <ExternalResourses 
                 key={resource.id} 
                 resource={resource} 
                 onEdit={() => handleOpenEdit({ ...resource, section: 'External Resources', type: 'link' })}
                 onDelete={() => handleDelete(resource.id)}
               />
             ))}
           </div>
         </div>

         {/* Modals */}
         <AddMaterialModal 
           isOpen={isAddModalOpen}
           onClose={() => setIsAddModalOpen(false)}
           onSave={handleAddMaterial}
         />
         <EditMaterialModal 
           isOpen={isEditModalOpen}
           onClose={() => setIsEditModalOpen(false)}
           onSave={handleEditMaterial}
           material={editingMaterial}
         />
       </div>
    );

}