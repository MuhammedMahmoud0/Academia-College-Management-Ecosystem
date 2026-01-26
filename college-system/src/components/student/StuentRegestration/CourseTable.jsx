
import * as React from 'react';
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Initial course registration data
const initialRows = [
  { 
    id: 1, 
    course: 'CS240', 
    instructor: 'Dr. John Smith', 
    schedule: 'Mon, Wed 10:00-12:00', 
    credits: 3
  },
  { 
    id: 2, 
    course: 'CS350', 
    instructor: 'Dr. Sarah Johnson', 
    schedule: 'Tue, Thu 13:00-15:00', 
    credits: 4
  },
  { 
    id: 3, 
    course: 'CS101', 
    instructor: 'Dr. Michael Brown', 
    schedule: 'Mon, Wed, Fri 09:00-10:00', 
    credits: 3
  },
  { 
    id: 4, 
    course: 'MA203', 
    instructor: 'Dr. Emily Davis', 
    schedule: 'Tue, Thu 14:00-16:00', 
    credits: 3
  },
  { 
    id: 5, 
    course: 'PHY301', 
    instructor: 'Dr. Robert Wilson', 
    schedule: 'Mon, Wed 13:00-15:00', 
    credits: 4
  }
 
 
];

export default function CourseTableRegistration() {
  // State for managing rows
  const [rows, setRows] = useState(initialRows);
  
  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle row deletion
  const handleDeleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  // Define columns with custom rendering
  const columns = useMemo(() => {
    const baseColumns = [
      { 
        field: 'course', 
        headerName: 'Course', 
        flex: isMobile ? 0 : 1,
        minWidth: isMobile ? 80 : 100,
      },
      { 
        field: 'instructor', 
        headerName: 'Instructor', 
        flex: isMobile ? 0 : 1.5,
        minWidth: isMobile ? 150 : 200,
      },
      { 
        field: 'schedule', 
        headerName: 'Schedule', 
        flex: isMobile ? 0 : 1.5,
        minWidth: isMobile ? 140 : 180,
      },
      { 
        field: 'credits', 
        headerName: 'Credits', 
        flex: isMobile ? 0 : 0.8,
        minWidth: isMobile ? 80 : 100,
      },
      {
        field: 'action',
        headerName: 'Action',
        flex: isMobile ? 0 : 0.8,
        minWidth: isMobile ? 80 : 100,
        sortable: false,
        renderCell: (params) => (
          <IconButton
            onClick={() => handleDeleteRow(params.row.id)}
            sx={{
              color: '#ef4444',
              '&:hover': {
                backgroundColor: '#fee2e2',
                color: '#dc2626',
              },
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>
        ),
      },
    ];

    return baseColumns;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Handle row updates (can be extended for future functionality)
  const processRowUpdate = (newRow) => {
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    return newRow;
  };

  return (
    <Box 
      className="bg-white rounded-2xl shadow-sm w-full" 
      sx={{ 
        height: 'auto',
        width: '100%',
        overflow: 'auto',
        padding: { xs: '16px', sm: '24px', md: '32px' },
      }}
    >
        <div className='font-semibold text-xl mb-4'>Your Courses</div>
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
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            padding: { xs: '8px', sm: '12px', md: '16px' },
            color: '#1f2937',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: 'transparent',
            fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.9rem' },
            fontWeight: '500',
            color: '#6b7280',
            minHeight: { xs: '48px !important', sm: '56px !important' },
            maxHeight: { xs: '48px !important', sm: '56px !important' },
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#4076acff',
            padding: { xs: '8px', sm: '12px', md: '16px' },
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '500',
            color: '#eff1f4ff',
          },
          '& .MuiDataGrid-row': { 
            marginBottom: '0px',
            borderBottom: '1px solid #f3f4f6',
            minHeight: { xs: '48px !important', sm: '52px !important' },
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
     <div className='flex justify-end mt-7 mr-15 font-semibold text-lg '> Total Credits: {rows.reduce((total, row) => total + row.credits, 0)}</div>
    </Box>
  );
}




