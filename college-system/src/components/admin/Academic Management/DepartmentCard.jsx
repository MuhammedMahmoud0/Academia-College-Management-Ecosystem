// ── Icons ────────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

// ── Stat Badge ───────────────────────────────────────────────────────────────
function StatBadge({ icon, value, label, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${colors[color]}`}>
      {icon}
      <span>{value} {label}</span>
    </div>
  );
}

// ── Department Card ──────────────────────────────────────────────────────────
export default function DepartmentCard({ dept, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <BuildingIcon />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-800 text-sm leading-snug truncate">
              {dept.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
              {dept.department_id.slice(0, 18)}…
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-dept-${dept.department_id}`}
            onClick={onEdit}
            title="Edit department"
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <EditIcon />
          </button>
          <button
            id={`delete-dept-${dept.department_id}`}
            onClick={onDelete}
            title="Delete department"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        <StatBadge
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          value={dept._count?.courses ?? 0}
          label="Courses"
          color="indigo"
        />
        <StatBadge
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          value={dept._count?.student_profiles ?? 0}
          label="Students"
          color="emerald"
        />
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
