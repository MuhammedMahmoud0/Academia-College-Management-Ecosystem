import { useState, useEffect, useCallback } from 'react';
import { getFinancials, createFinancial, updateFinancial, deleteFinancial } from '../../../services/financialManagement';
import { getAllDepartments } from '../../../services/departments';
import CreateFinancialModal from './CreateFinancialModal';
import EditTuitionModal from './EditTuitionModal';

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr className="border-b border-gray-100">
        {[1, 2, 3, 4].map(i => (
            <td key={i} className="py-4 px-2 md:px-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded-md" style={{ width: i === 1 ? '60%' : i === 4 ? '40%' : '50%' }} />
            </td>
        ))}
    </tr>
);

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
const DeleteConfirmDialog = ({ record, onConfirm, onCancel, deleting }) => {
    if (!record) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Delete Financial Record?</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            This will permanently delete the credit-hour pricing for <span className="font-semibold text-gray-800">{record.departments?.name}</span>.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium text-sm">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={deleting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function FeesManagement() {
    const [financials, setFinancials]               = useState([]);
    const [departments, setDepartments]             = useState([]);
    const [loading, setLoading]                     = useState(true);
    const [error, setError]                         = useState(null);
    const [filterDeptId, setFilterDeptId]           = useState('');

    // Modals
    const [showCreate, setShowCreate]               = useState(false);
    const [showEdit, setShowEdit]                   = useState(false);
    const [editingRecord, setEditingRecord]         = useState(null);
    const [deleteRecord, setDeleteRecord]           = useState(null);

    // Mutation states
    const [submitting, setSubmitting]               = useState(false);
    const [deleting, setDeleting]                   = useState(false);
    const [mutationError, setMutationError]         = useState(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchFinancials = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFinancials(filterDeptId || undefined);
            setFinancials(data.financials || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Failed to load financial records.');
        } finally {
            setLoading(false);
        }
    }, [filterDeptId]);

    const fetchDepartments = useCallback(async () => {
        try {
            const data = await getAllDepartments();
            setDepartments(data.departments || []);
        } catch {
            /* non-critical */
        }
    }, []);

    useEffect(() => { fetchFinancials(); }, [fetchFinancials]);
    useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

    // ── Create ─────────────────────────────────────────────────────────────────
    const handleCreate = async (payload) => {
        try {
            setSubmitting(true);
            setMutationError(null);
            await createFinancial(payload);
            setShowCreate(false);
            fetchFinancials();
        } catch (e) {
            setMutationError(e?.response?.data?.message || 'Failed to create record.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Edit ───────────────────────────────────────────────────────────────────
    const handleEdit = (record) => {
        setEditingRecord(record);
        setShowEdit(true);
        setMutationError(null);
    };

    const handleUpdate = async (creditPrice) => {
        try {
            setSubmitting(true);
            setMutationError(null);
            await updateFinancial(editingRecord.id, creditPrice);
            setShowEdit(false);
            setEditingRecord(null);
            fetchFinancials();
        } catch (e) {
            setMutationError(e?.response?.data?.message || 'Failed to update record.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteRecord) return;
        try {
            setDeleting(true);
            await deleteFinancial(deleteRecord.id);
            setDeleteRecord(null);
            fetchFinancials();
        } catch (e) {
            setMutationError(e?.response?.data?.message || 'Failed to delete record.');
            setDeleteRecord(null);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* ── Mutation Error Banner ── */}
            {mutationError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <span>{mutationError}</span>
                    <button onClick={() => setMutationError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
                </div>
            )}

            {/* ── Main Card ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 md:p-6">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Department Credit-Hour Pricing</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Manage credit-hour prices per department</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Department filter */}
                            <select
                                value={filterDeptId}
                                onChange={e => setFilterDeptId(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 min-w-[180px]"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dep => (
                                    <option key={dep.department_id} value={dep.department_id}>{dep.name}</option>
                                ))}
                            </select>

                            {/* Add button */}
                            <button
                                onClick={() => { setShowCreate(true); setMutationError(null); }}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm whitespace-nowrap"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Record
                            </button>
                        </div>
                    </div>

                    {/* Loading error */}
                    {error && !loading && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                            <button onClick={fetchFinancials} className="ml-auto text-indigo-600 hover:underline font-medium">Retry</button>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">#</th>
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Department</th>
                                    <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Credit-Hour Price</th>
                                    <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <>
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                    </>
                                ) : financials.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                                            <div className="flex flex-col items-center gap-2">
                                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                No pricing records found.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    financials.map((record, idx) => (
                                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-2 md:px-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                                            <td className="py-4 px-2 md:px-4 text-sm md:text-base font-medium text-gray-900">
                                                {record.departments?.name || '—'}
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-sm md:text-base">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    EGP {Number(record.credit_price).toLocaleString()} / credit hr
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 md:px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(record)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                                                        title="Edit credit price"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteRecord(record); setMutationError(null); }}
                                                        className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                                                        title="Delete record"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    {!loading && !error && financials.length > 0 && (
                        <p className="text-xs text-gray-400 mt-4">
                            Showing {financials.length} record{financials.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────── */}
            <CreateFinancialModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                onSubmit={handleCreate}
                departments={departments}
                submitting={submitting}
            />

            <EditTuitionModal
                isOpen={showEdit}
                onClose={() => { setShowEdit(false); setEditingRecord(null); }}
                onSubmit={handleUpdate}
                record={editingRecord}
                submitting={submitting}
            />

            <DeleteConfirmDialog
                record={deleteRecord}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteRecord(null)}
                deleting={deleting}
            />
        </div>
    );
}