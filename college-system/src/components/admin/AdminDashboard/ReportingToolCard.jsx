import React, { useState } from 'react';
import { Download, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { generateReport } from '../../../services/adminDashboard';

// Utility: flatten a plain (non-array) object — recurse into nested objects only
const flattenPlain = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}_${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(acc, flattenPlain(val, fullKey));
    } else if (Array.isArray(val)) {
      // Primitive arrays → join; object arrays → skip here (handled by expandRows)
      const isObjArray = val.length > 0 && typeof val[0] === 'object' && val[0] !== null;
      acc[fullKey] = isObjArray ? '__EXPAND__' : val.join('; ');
    } else {
      acc[fullKey] = val ?? '';
    }
    return acc;
  }, {});
};

/**
 * expandRows: for each top-level record, if it contains an array-of-objects field,
 * expand it into N child rows (one per child), repeating the parent scalars.
 * If the array is empty, still emit one row with blank child columns.
 */
const expandRows = (records) => {
  const result = [];

  records.forEach(record => {
    // Separate scalar/nested-object fields from array-of-objects fields
    const scalarPart = {};
    const arrayFields = {}  ;

    Object.keys(record).forEach(key => {
      const val = record[key];
      if (
        Array.isArray(val) &&
        val.length > 0 &&
        typeof val[0] === 'object' &&
        val[0] !== null
      ) {
        arrayFields[key] = val;
      } else {
        scalarPart[key] = val;
      }
    });

    const flatScalar = flattenPlain(scalarPart);

    if (Object.keys(arrayFields).length === 0) {
      // No array-of-objects → single row
      result.push(flatScalar);
    } else {
      // For each array-of-objects field, expand
      // (handle first array field found; multiple array fields are merged column-wise)
      const firstKey = Object.keys(arrayFields)[0];
      const children = arrayFields[firstKey];

      if (children.length === 0) {
        // Empty array → one row with blank child columns
        // We need to know child keys — skip, just push scalar row
        result.push(flatScalar);
      } else {
        children.forEach(child => {
          const flatChild = flattenPlain(child, firstKey);
          result.push({ ...flatScalar, ...flatChild });
        });
      }
    }
  });

  return result;
};

// Utility: convert JSON array to CSV string (handles nested arrays of objects)
const jsonToCSV = (data) => {
  if (!data) return '';
  // Normalize: some endpoints (e.g. academic-transcript) return a single object, not an array
  const normalized = Array.isArray(data) ? data : [data];
  if (normalized.length === 0) return '';
  const rows = expandRows(normalized);
  const headers = [...new Set(rows.flatMap(r => Object.keys(r)))];
  const escape = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h] ?? '')).join(','))
  ];
  return lines.join('\n');
};

// Utility: trigger browser download
const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Report-specific filter configs
const REPORT_FILTERS = {
  'student-reports': [
    { key: 'department_id', label: 'Department', type: 'department_select', placeholder: 'Select a department' },
    { key: 'limit', label: 'Limit', type: 'number', placeholder: '100' },
  ],
  'academic-transcript': [
    { key: 'student_id', label: 'Student ID', type: 'text', placeholder: 'e.g. S2025101', required: true },
  ],
  'revenue': [
    { key: 'limit', label: 'Limit', type: 'number', placeholder: '100' },
  ],
  'retention': [
    { key: 'department_id', label: 'Department', type: 'department_select', placeholder: 'All Departments' },
    { key: 'limit', label: 'Limit', type: 'number', placeholder: '100' },
  ],
  'faculty-workload': [
    { key: 'department_id', label: 'Department', type: 'department_select', placeholder: 'All Departments' },
    { key: 'limit', label: 'Limit', type: 'number', placeholder: '100' },
  ],
  'course-popularity': [
    { key: 'limit', label: 'Limit', type: 'number', placeholder: '100' },
  ],
};

const ReportingToolCard = ({ icon, title, description, reportType, departments = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  const filters = REPORT_FILTERS[reportType] || [];

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const buildBody = () => {
    const body = {};
    filters.forEach(f => {
      const val = filterValues[f.key];
      if (val !== undefined && val !== '') {
        body[f.key] = f.type === 'number' ? Number(val) : val;
      }
    });
    return body;
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const body = buildBody();
      const result = await generateReport(reportType, body);
      const rows = result.data || [];
      if (rows.length === 0) {
        setError('No data returned for this report.');
        return;
      }
      const csv = jsonToCSV(rows);
      const timestamp = (result.generated_at || new Date().toISOString()).replace(/[: ]/g, '-');
      downloadCSV(csv, `${reportType}-${timestamp}.csv`);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to generate report.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Filters Toggle */}
      {filters.length > 0 && (
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
        >
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showFilters ? 'Hide filters' : 'Add filters'}
        </button>
      )}

      {/* Filter Inputs */}
      {showFilters && filters.length > 0 && (
        <div className="space-y-2 bg-gray-50 rounded-lg p-3">
          {filters.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                {f.label}
                {f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {f.type === 'department_select' ? (
                <select
                  value={filterValues[f.key] || ''}
                  onChange={e => handleFilterChange(f.key, e.target.value)}
                  className="text-xs border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                >
                  <option value="">{f.placeholder || 'Select Department'}</option>
                  {departments.map(dept => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder || ''}
                  value={filterValues[f.key] || ''}
                  onChange={e => handleFilterChange(f.key, e.target.value)}
                  className="text-xs border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-md px-3 py-1.5">{error}</p>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-auto"
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {loading ? 'Generating...' : 'Generate & Download'}
      </button>
    </div>
  );
};

export default ReportingToolCard;
