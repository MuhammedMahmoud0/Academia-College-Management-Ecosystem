import * as React from 'react';
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

// Initial exam schedule data
const initialRows = [
  { 
    id: 1, 
    course: 'CS240', 
    exam: 'Data Structures Midterm', 
    date: '2025-10-20', 
    time: '10:00 - 12:00', 
    location: 'Hall B-201', 
    status: 'Upcoming' 
  },
  { 
    id: 2, 
    course: 'CS350', 
    exam: 'Operating Systems Midterm', 
    date: '2025-10-22', 
    time: '13:00 - 15:00', 
    location: 'Hall C-105', 
    status: 'Upcoming' 
  },
  { 
    id: 3, 
    course: 'CS101', 
    exam: 'Intro to Programming Final', 
    date: '2025-05-15', 
    time: '09:00 - 12:00', 
    location: 'Hall A-101', 
    status: 'Completed' 
  },
  { 
    id: 4, 
    course: 'MA203', 
    exam: 'Calculus II Final', 
    date: '2025-05-18', 
    time: '14:00 - 17:00', 
    location: 'Hall D-301', 
    status: 'Completed' 
  },
  { 
    id: 5, 
    course: 'PHY301', 
    exam: 'Quantum Mechanics Midterm', 
    date: '2025-10-25', 
    time: '10:00 - 12:00', 
    location: 'Hall E-202', 
    status: 'Upcoming' 
  },
  { 
    id: 6, 
    course: 'ENG201', 
    exam: 'Technical Writing Final', 
    date: '2025-10-28', 
    time: '14:00 - 16:00', 
    location: 'Hall F-101', 
    status: 'Upcoming' 
  },
  { 
    id: 7, 
    course: 'CS450', 
    exam: 'Database Systems Final', 
    date: '2025-11-05', 
    time: '09:00 - 12:00', 
    location: 'Hall B-301', 
    status: 'Upcoming' 
  },
  { 
    id: 8, 
    course: 'MA305', 
    exam: 'Linear Algebra Midterm', 
    date: '2025-11-10', 
    time: '13:00 - 15:00', 
    location: 'Hall D-201', 
    status: 'Upcoming' 
  },
];

export default function ExamScheduleTable() {
  // State for managing rows
  const [rows, setRows] = useState(initialRows);

  // Define columns with custom rendering
  const columns = useMemo(() => [
    { field: 'course', headerName: 'Course', flex: 0.8 },
    { field: 'exam', headerName: 'Exam', flex: 1.8 },
    { field: 'date', headerName: 'Date', flex: 1 },
    { field: 'time', headerName: 'Time', flex: 1.2 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            backgroundColor:
              params.value === 'Upcoming' ? '#dbeafe' :
              params.value === 'Completed' ? '#d1fae5' :
              '#f3f4f6',
            color:
              params.value === 'Upcoming' ? '#1e40af' :
              params.value === 'Completed' ? '#065f46' :
              '#374151',
            padding: '4px 12px',
            borderRadius: '6px',
            fontWeight: '500',
            fontSize: '0.875rem',
          }}
        >
          {params.value}
        </span>
      ),
    },
  ], []);

  // Handle row updates (can be extended for future functionality)
  const processRowUpdate = (newRow) => {
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  // Handle row deletion (optional feature for future use)
  const _handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Handle adding new row (optional feature for future use)
  const _handleAddRow = (newRow) => {
    const id = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { ...newRow, id }]);
  };
  return (
    <Box 
      className="bg-white p-8 rounded-2xl shadow-sm w-full" 
      sx={{ 
        height: 'auto',
        width: '100%',
        overflow: 'visible'
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdate}
        hideFooter
        autoHeight
        disableColumnMenu
        sx={{ 
          textAlign: 'left',
          border: 'none',
          minWidth: { xs: '600px', sm: '100%' },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
          
            color: '#1f2937',
            fontWeight: '400',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: 'transparent',
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
            fontWeight: '500',
            color: '#6b7280',
            minHeight: '56px !important',
            maxHeight: '56px !important',
          },
          '& .MuiDataGrid-columnHeader': {
         backgroundColor: '#f8fafc',
            padding: '16px',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '500',
            color: '#6b7280',
          },
          '& .MuiDataGrid-row': {
            marginBottom: '0px',
            borderBottom: '1px solid #f3f4f6',
            '&:last-child': {
              borderBottom: 'none',
            }
          },
          '& .MuiDataGrid-virtualScroller': {
            marginTop: '0px !important',
            backgroundColor: '#ffffff',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#f9fafb',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
