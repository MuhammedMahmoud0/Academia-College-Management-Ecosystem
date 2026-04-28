import React, { useEffect, useState } from 'react';
import StudentManagement from '../components/admin/User Managment/StudentManagement';
import DoctorsManagement from '../components/admin/User Managment/DoctorsManagement';
import AdminManagement from '../components/admin/User Managment/AdminManagement';
import CreateStudentModal from '../components/admin/User Managment/CreateStudentModal';
import ImportStudentsModal from '../components/admin/User Managment/ImportStudentsModal';
import CreateStaffUserModal from '../components/admin/User Managment/CreateStaffUserModal';
import ImportStaffModal from '../components/admin/User Managment/ImportStaffModal';
import CreateAdminModal from '../components/admin/User Managment/CreateAdminModal';
import {
  createNonStudentUser,
  createStudentUser,
  getDepartments,
  uploadNonStudentsExcelFile,
  uploadStudentsExcelFile,
} from '../services/userManagement';
import { createManagedAdmin } from '../services/userManagementProfiles';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import * as XLSX from 'xlsx';

import excelimage from '../assets/icons/xls.png';
export default function UserManagementPage() { 
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin';
    const [activeTab, setActiveTab] = useState('students');
    const [isCreateStudentModalOpen, setIsCreateStudentModalOpen] = useState(false);
    const [isImportStudentsModalOpen, setIsImportStudentsModalOpen] = useState(false);
    const [isCreateStaffModalOpen, setIsCreateStaffModalOpen] = useState(false);
    const [isImportStaffModalOpen, setIsImportStaffModalOpen] = useState(false);
    const [isCreateAdminModalOpen, setIsCreateAdminModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [isSubmittingImport, setIsSubmittingImport] = useState(false);
    const [isSubmittingStaffCreate, setIsSubmittingStaffCreate] = useState(false);
    const [isSubmittingStaffImport, setIsSubmittingStaffImport] = useState(false);
    const [isSubmittingAdminCreate, setIsSubmittingAdminCreate] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [studentsRefreshToken, setStudentsRefreshToken] = useState(0);
    const [doctorsRefreshToken, setDoctorsRefreshToken] = useState(0);
    const [adminsRefreshToken, setAdminsRefreshToken] = useState(0);
    const toast = useToast();

    useEffect(() => {
      if (!isSuperAdmin && activeTab === 'admins') {
        setActiveTab('students');
      }
    }, [activeTab, isSuperAdmin]);

    const normalizeEmailColumnInExcel = async (file) => {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames?.[0];

      if (!firstSheetName) {
        return file;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');

      let emailColumn = -1;
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        const headerAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const headerValue = String(sheet[headerAddress]?.v || '').trim().toLowerCase();
        if (headerValue === 'email') {
          emailColumn = col;
          break;
        }
      }

      if (emailColumn === -1) {
        return file;
      }

      for (let row = range.s.r + 1; row <= range.e.r; row += 1) {
        const address = XLSX.utils.encode_cell({ r: row, c: emailColumn });
        const cell = sheet[address];
        if (!cell) {
          continue;
        }

        let normalized = '';
        if (typeof cell.v === 'object' && cell.v !== null) {
          normalized = String(cell.v?.text || cell.v?.value || '').trim();
        } else {
          normalized = String(cell.v || '').trim();
        }

        if (!normalized && cell.l?.Target) {
          normalized = String(cell.l.Target).replace(/^mailto:/i, '').trim();
        }

        if (!normalized && typeof cell.f === 'string') {
          const formulaMatch = cell.f.match(/"([^"@\s]+@[^"\s]+)"/);
          normalized = formulaMatch?.[1] || '';
        }

        sheet[address] = { t: 's', v: normalized };
      }

      const normalizedWorkbook = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      return new File(
        [normalizedWorkbook],
        file.name.replace(/\.xlsx?$/i, '') + '-normalized.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
    };

    const handleCreateUserClick = async () => {
      if (activeTab === 'admins') {
        setIsCreateAdminModalOpen(true);
        return;
      }

      if (activeTab === 'doctors-faculty') {
        setIsCreateStaffModalOpen(true);
        return;
      }

      try {
        const response = await getDepartments();
        const departmentsList = response?.departments || response?.data || [];
        const normalizedDepartments = departmentsList
          .map((department) => ({
            department_id: department?.department_id || department?.id || '',
            name: department?.name || department?.department_name || '',
          }))
          .filter((department) => department.department_id && department.name);

        setDepartments(normalizedDepartments);

        if (!normalizedDepartments.length) {
          toast.error('No departments found. Please add departments first.');
          return;
        }

        setIsCreateStudentModalOpen(true);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load departments.';
        toast.error(message);
      }
    };

    const handleImportClick = () => {
      if (activeTab === 'doctors-faculty') {
        setIsImportStaffModalOpen(true);
        return;
      }

      setIsImportStudentsModalOpen(true);
    };

    const handleCreateAdmin = async (formData) => {
      try {
        setIsSubmittingAdminCreate(true);
        const payload = {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          password: formData.password,
        };

        await createManagedAdmin(payload);
        toast.success('Admin created successfully.');
        setIsCreateAdminModalOpen(false);
        setAdminsRefreshToken(Date.now());
        return true;
      } catch (error) {
        const details = error?.response?.data?.details;
        const detailsText = Array.isArray(details)
          ? details[0]?.message || details[0]
          : '';
        const message =
          error?.response?.data?.message
          || error?.response?.data?.error
          || detailsText
          || error?.message
          || 'Failed to create admin.';
        toast.error(message);
        return false;
      } finally {
        setIsSubmittingAdminCreate(false);
      }
    };

    const handleCreateStudent = async (formData) => {
      try {
        setIsSubmittingCreate(true);
        const payload = {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          national_id: formData.national_id?.trim(),
          student_id: formData.student_id?.trim(),
          department_id: formData.department_id,
        };

        await createStudentUser(payload);
        toast.success('Student created successfully.');
        setIsCreateStudentModalOpen(false);
        setStudentsRefreshToken(Date.now());
        return true;
      } catch (error) {
        const details = error?.response?.data?.details;
        const detailsText = Array.isArray(details)
          ? details[0]?.message || details[0]
          : '';
        const message =
          error?.response?.data?.message
          || error?.response?.data?.error
          || detailsText
          || error?.message
          || 'Failed to create student.';
        toast.error(message);
        return false;
      } finally {
        setIsSubmittingCreate(false);
      }
    };

    const handleCreateStaffUser = async (formData) => {
      try {
        setIsSubmittingStaffCreate(true);
        const payload = {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          password: formData.password,
          role: formData.role,
        };

        await createNonStudentUser(payload);
        toast.success('Doctor/Teaching Assistant created successfully.');
        setIsCreateStaffModalOpen(false);
        setDoctorsRefreshToken(Date.now());
        return true;
      } catch (error) {
        const details = error?.response?.data?.details;
        const detailsText = Array.isArray(details)
          ? details[0]?.message || details[0]
          : '';
        const message =
          error?.response?.data?.message
          || error?.response?.data?.error
          || detailsText
          || error?.message
          || 'Failed to create doctor/teaching assistant.';
        toast.error(message);
        return false;
      } finally {
        setIsSubmittingStaffCreate(false);
      }
    };

    const handleImportStaff = async (file) => {
      try {
        setIsSubmittingStaffImport(true);
        const normalizedFile = await normalizeEmailColumnInExcel(file);
        const response = await uploadNonStudentsExcelFile(normalizedFile);

        if (response?.queued) {
          toast.success(`Import queued successfully. Job ID: ${response.jobId || '-'}`);
        } else {
          const inserted =
            response?.insertedCount
            ?? response?.insertCount
            ?? response?.createdCount
            ?? 0;
          const skipped =
            response?.skippedDueToValidation
            ?? response?.skippedCount
            ?? (Array.isArray(response?.errors) ? response.errors.length : 0)
            ?? 0;

          toast.success(`Import completed. Inserted: ${inserted}, Skipped: ${skipped}.`);

          if (Array.isArray(response?.errors) && response.errors.length > 0) {
            const firstError = typeof response.errors[0] === 'string'
              ? response.errors[0]
              : response.errors[0]?.message || JSON.stringify(response.errors[0]);
            toast.warning(`Some rows were skipped: ${firstError}`);
          }
        }

        setIsImportStaffModalOpen(false);
        setDoctorsRefreshToken(Date.now());
        return true;
      } catch (error) {
        const message = error?.response?.data?.message || error?.response?.data?.error || 'Failed to import doctors/teaching assistants file.';
        toast.error(message);
        return false;
      } finally {
        setIsSubmittingStaffImport(false);
      }
    };

    const handleImportStudents = async (file) => {
      try {
        setIsSubmittingImport(true);
        const response = await uploadStudentsExcelFile(file);
        const inserted = response?.insertedCount ?? 0;
        const skipped = response?.skippedDueToValidation ?? 0;

        toast.success(`Import completed. Inserted: ${inserted}, Skipped: ${skipped}.`);
        setIsImportStudentsModalOpen(false);
        setStudentsRefreshToken((prev) => prev + 1);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to import students file.';
        toast.error(message);
      } finally {
        setIsSubmittingImport(false);
      }
    };

    return (

       <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-900 mb-6">User Management</h1>
      {/* Tabs and Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'students'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('doctors-faculty')}
            className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'doctors-faculty'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Doctors & Faculty
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                activeTab === 'admins'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admins
            </button>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleCreateUserClick}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap flex-1 sm:flex-none"
          >
            <span className="text-xl">+</span>
            Create New User
          </button>
          {activeTab !== 'admins' && (
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap flex-1 sm:flex-none"
            >
              <img src={excelimage} alt="Excel Icon" className="w-5 h-5" />
              Import Excel File
            </button>
          )}
        </div>
      </div>
      <hr className='text-gray-300 mb-4'/>
        {/* Content */}
        {activeTab === 'students' && <StudentManagement refreshToken={studentsRefreshToken} />}
        {activeTab === 'doctors-faculty' && <DoctorsManagement refreshToken={doctorsRefreshToken} />}
        {activeTab === 'admins' && isSuperAdmin && <AdminManagement refreshToken={adminsRefreshToken} />}

        <CreateStudentModal
          isOpen={isCreateStudentModalOpen}
          isSubmitting={isSubmittingCreate}
          departments={departments}
          onClose={() => setIsCreateStudentModalOpen(false)}
          onSubmit={handleCreateStudent}
        />

        <ImportStudentsModal
          isOpen={isImportStudentsModalOpen}
          isSubmitting={isSubmittingImport}
          onClose={() => setIsImportStudentsModalOpen(false)}
          onSubmit={handleImportStudents}
        />

        <CreateStaffUserModal
          isOpen={isCreateStaffModalOpen}
          isSubmitting={isSubmittingStaffCreate}
          onClose={() => setIsCreateStaffModalOpen(false)}
          onSubmit={handleCreateStaffUser}
        />

        <CreateAdminModal
          isOpen={isCreateAdminModalOpen}
          isSubmitting={isSubmittingAdminCreate}
          onClose={() => setIsCreateAdminModalOpen(false)}
          onSubmit={handleCreateAdmin}
        />

        <ImportStaffModal
          isOpen={isImportStaffModalOpen}
          isSubmitting={isSubmittingStaffImport}
          onClose={() => setIsImportStaffModalOpen(false)}
          onSubmit={handleImportStaff}
        />
</div>
    );
}
