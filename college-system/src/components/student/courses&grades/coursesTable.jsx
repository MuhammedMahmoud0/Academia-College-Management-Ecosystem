import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'courseCode', headerName: 'Course Code', flex: 1 },
  { field: 'courseName', headerName: 'Course Name', flex: 1 },
  { field: 'credits', headerName: 'Credits', flex: 1},
  { field: 'semester', headerName: 'Semester', flex: 1 },
  {
    field: 'grade',
    headerName: 'Grade',
    flex: 1,
    renderCell: (params) => (
      <span
        style={{
          backgroundColor:
            params.value === 'A' || params.value === 'A-' ? '#d9fdd3' :
            params.value === 'B+' || params.value === 'B' ? '#d3e3fd' :
            '#f3f3f3',
          color: '#222',
          padding: '4px 10px',
          borderRadius: '12px',
          fontWeight: '600',
        }}
      >
        {params.value}
      </span>
    ),
  },
];

const rows = [
  { id: 1, courseCode: 'CS101', courseName: 'Introduction to Programming', credits: 3, semester: 'Fall 2024', grade: 'A' },
  { id: 2, courseCode: 'MA203', courseName: 'Calculus II', credits: 4, semester: 'Fall 2024', grade: 'B+' },
  { id: 3, courseCode: 'PHY201', courseName: 'General Physics I', credits: 4, semester: 'Fall 2024', grade: 'A-' },
  { id: 4, courseCode: 'CS240', courseName: 'Data Structures & Algorithms', credits: 3, semester: 'Spring 2025', grade: 'A' },
  { id: 5, courseCode: 'CS350', courseName: 'Operating Systems', credits: 3, semester: 'Spring 2025', grade: 'B' },
  { id: 6, courseCode: 'EE200', courseName: 'Digital Logic Design', credits: 3, semester: 'Spring 2025', grade: 'A-' },
];


export default function GradesTable() {
  return (
    <Box 
      className="bg-white p-4 rounded-lg shadow-md w-full" 
      sx={{ 
        height: { xs: 500, sm: 450, md: 450 },
        width: '100%',
        overflow: 'auto'
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        sx={{ 
          textAlign: 'left',
          border: 'none',
          minWidth: { xs: '600px', sm: '100%' },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: 'none',
            backgroundColor: '#f8fafc',
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f8fafc',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
