import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { ToastContext } from '../../../context/ToastContextDefinition';
import DepartmentCard from './DepartmentCard';
import DepartmentModal from './DepartmentModal';
import DeleteDepartmentModal from './DeleteDepartmentModal';
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../../services/departments';

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);



// ── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-100 rounded w-2/3" />
          <div className="h-2.5 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-100 rounded-lg w-20" />
        <div className="h-6 bg-gray-100 rounded-lg w-20" />
      </div>
    </div>
  );
}

// ── Helper: extract a user-friendly error message ────────────────────────────
function getErrorMessage(err) {
  const status = err?.response?.status;
  const serverMsg = err?.response?.data?.message || err?.response?.data?.error;

  if (serverMsg) return serverMsg;
  if (status === 401) return 'Unauthorized. Please log in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'Department not found.';
  if (status === 409) return 'A department with this name already exists.';
  if (status === 400) return 'Validation error. Please check your input.';
  if (status === 500) return 'Server error. Please try again later.';
  return err?.message || 'An unexpected error occurred.';
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function DepartmentsPrograms() {
  const toast = useContext(ToastContext);

  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | { type: 'add' | 'edit' | 'delete', dept? }

  // Debouncer ref
  const debounceTimer = useRef(null);

  // ── Fetch departments (GET /departments?search=) ───────────────────────────
  const fetchDepartments = useCallback(async (searchTerm = '') => {
    setLoading(true);
    try {
      const data = await getAllDepartments(searchTerm);
      setDepartments(data.departments ?? []);
    } catch (err) {
      toast?.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Debounced search — calls API with ?search= after 400ms idle
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchDepartments(value);
    }, 400);
  };

  // ── Create (POST /departments) — append to local state ───────────────────
  const handleCreate = async (name) => {
    setActionLoading(true);
    try {
      const created = await createDepartment(name);
      // Append the new dept; API returns { department_id, name } without _count
      setDepartments((prev) => [
        ...prev,
        { ...created, _count: { courses: 0, student_profiles: 0 } },
      ]);
      toast?.success(`Department "${name}" created successfully.`);
      setModal(null);
    } catch (err) {
      toast?.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // ── Update (PATCH /departments/:id) — patch name in local state ──────────
  const handleEdit = async (name) => {
    setActionLoading(true);
    try {
      await updateDepartment(modal.dept.department_id, name);
      setDepartments((prev) =>
        prev.map((d) =>
          d.department_id === modal.dept.department_id ? { ...d, name } : d
        )
      );
      toast?.success(`Department renamed to "${name}".`);
      setModal(null);
    } catch (err) {
      toast?.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete (DELETE /departments/:id) — remove from local state ───────────
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteDepartment(modal.dept.department_id);
      setDepartments((prev) =>
        prev.filter((d) => d.department_id !== modal.dept.department_id)
      );
      toast?.success(`Department "${modal.dept.name}" deleted.`);
      setModal(null);
    } catch (err) {
      toast?.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Filter departments by name…"
            className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition"
          />
        </div>

        <button
          id="add-department-btn"
          onClick={() => setModal({ type: 'add' })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-200 whitespace-nowrap"
        >
          <PlusIcon />
          Add Department
        </button>
      </div>

      {/* ── Summary strip ── */}
      <div className="flex flex-wrap gap-3">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-gray-500">Total Departments:</span>
          <span className="font-semibold text-gray-800">{departments.length}</span>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        // Skeleton loader
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : departments.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-full bg-gray-100 mb-4 text-gray-400">
            <BuildingIcon />
          </div>
          <p className="text-gray-600 font-medium">No departments found</p>
          <p className="text-gray-400 text-sm mt-1">
            {search
              ? `No results for "${search}"`
              : 'Click "Add Department" to get started.'}
          </p>
        </div>
      ) : (
        // Cards grid
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.department_id}
              dept={dept}
              onEdit={() => setModal({ type: 'edit', dept })}
              onDelete={() => setModal({ type: 'delete', dept })}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {modal?.type === 'add' && (
        <DepartmentModal
          mode="add"
          loading={actionLoading}
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
        />
      )}
      {modal?.type === 'edit' && (
        <DepartmentModal
          mode="edit"
          department={modal.dept}
          loading={actionLoading}
          onClose={() => setModal(null)}
          onSubmit={handleEdit}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteDepartmentModal
          department={modal.dept}
          loading={actionLoading}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
