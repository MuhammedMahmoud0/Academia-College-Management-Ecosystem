import { useState } from 'react';

export default function DepartmentsPrograms() {
  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: 'Computer Science',
      programs: [
        { id: 1, name: 'B.Sc. in CS' },
        { id: 2, name: 'M.Sc. in AI' },
      ],
    },
    {
      id: 2,
      name: 'Engineering',
      programs: [
        { id: 3, name: 'B.Sc. in Electrical Engineering' },
      ],
    },
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);

  const handleAddDepartment = () => {
    const name = prompt('Enter department name:');
    if (name) {
      const newDepartment = {
        id: departments.length + 1,
        name: name,
        programs: [],
      };
      setDepartments([...departments, newDepartment]);
    }
  };

  const handleAddProgram = () => {
    const name = prompt('Enter program name:');
    if (name && selectedDepartment) {
      const updatedDepartments = departments.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            programs: [
              ...dept.programs,
              { id: Date.now(), name: name }
            ],
          };
        }
        return dept;
      });
      setDepartments(updatedDepartments);
      setSelectedDepartment(updatedDepartments.find(d => d.id === selectedDepartment.id));
    }
  };

  const handleEditProgram = (programId) => {
    console.log('Edit program:', programId);
  };

  const handleDeleteProgram = (programId) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      const updatedDepartments = departments.map(dept => {
        if (dept.id === selectedDepartment.id) {
          return {
            ...dept,
            programs: dept.programs.filter(p => p.id !== programId),
          };
        }
        return dept;
      });
      setDepartments(updatedDepartments);
      setSelectedDepartment(updatedDepartments.find(d => d.id === selectedDepartment.id));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
      {/* Left Sidebar - Departments */}
      <div className="w-full lg:w-80 xl:w-96">
        <div className="bg-white rounded-lg shadow p-4">
          <button
            onClick={handleAddDepartment}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-indigo-700 transition-colors mb-3 md:mb-4 text-sm md:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Department
          </button>

          <div className="space-y-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept)}
                className={`w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                  selectedDepartment?.id === dept.id
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Programs */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-xl font-semibold text-gray-800">
              {selectedDepartment?.name} - Degree Programs
            </h2>
            <button
              onClick={handleAddProgram}
              className="flex items-center justify-center gap-2 bg-gray-700 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Program
            </button>
          </div>

          {/* Programs List */}
          <div className="p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {selectedDepartment?.programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm md:text-base text-gray-800 font-medium">{program.name}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditProgram(program.id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {selectedDepartment?.programs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No programs added yet. Click "Add Program" to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
