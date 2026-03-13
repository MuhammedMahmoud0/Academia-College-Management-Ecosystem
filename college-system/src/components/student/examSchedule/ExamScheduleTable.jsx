import * as React from 'react';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function formatDate(dateValue) {
  if (!dateValue) {
    return '-';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-GB');
}

function formatTime(timeValue) {
  if (!timeValue) {
    return '-';
  }

  return String(timeValue).slice(0, 5);
}

function deriveStatus(examDate) {
  if (!examDate) {
    return 'Upcoming';
  }

  const date = new Date(examDate);
  if (Number.isNaN(date.getTime())) {
    return 'Upcoming';
  }

  const examDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  return examDay < todayOnly ? 'Completed' : 'Upcoming';
}

export default function ExamScheduleTable({ rows = [], isLoading = false }) {
  
  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tableRows = useMemo(() => {
    return (rows || []).map((exam) => ({
      id: exam.exam_id,
      course: exam.course_code,
      exam: `${exam.course_name} ${exam.exam_type}`,
      date: formatDate(exam.exam_date),
      time: `${formatTime(exam.start_time)} - ${formatTime(exam.end_time)}`,
      location: exam.location || '-',
      status: deriveStatus(exam.exam_date),
    }));
  }, [rows]);

  // Define columns with custom rendering
  const columns = useMemo(() => {
    // Helper to get colors based on status
    const getStatusColor = (status) => {
      switch (status) {
        case 'Upcoming':
          return { bg: '#DBEAFE', text: '#1E40AF' }; // Blue-100 bg, Blue-800 text
        case 'Completed':
          return { bg: '#D1FAE5', text: '#065F46' }; // Green-100 bg, Green-800 text
        default:
          return { bg: '#F3F4F6', text: '#374151' }; // Gray default
      }
    };

    const baseColumns = [
      { 
        field: 'course', 
        headerName: 'Course', 
        flex: isMobile ? 0 : 0.8,
        minWidth: isMobile ? 80 : 100,
      },
      { 
        field: 'exam', 
        headerName: 'Exam', 
        flex: isMobile ? 0 : 1.8,
        minWidth: isMobile ? 150 : 200,
      },
      { 
        field: 'date', 
        headerName: 'Date', 
        flex: isMobile ? 0 : 1,
        minWidth: isMobile ? 100 : 120,
      },
      { 
        field: 'time', 
        headerName: 'Time', 
        flex: isMobile ? 0 : 1.2,
        minWidth: isMobile ? 110 : 130,
      },
      { 
        field: 'location', 
        headerName: 'Location', 
        flex: isMobile ? 0 : 1,
        minWidth: isMobile ? 100 : 120,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: isMobile ? 0 : 1,
        minWidth: isMobile ? 100 : 120,
        align: 'center',       // Aligns the cell content container
        headerAlign: 'center', // Aligns the header title
        renderCell: (params) => {
          const styles = getStatusColor(params.value);
          
          return (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: '100%', 
              height: '100%' 
            }}>
              <span
                style={{
                  backgroundColor: styles.bg,
                  color: styles.text,
                  padding: isMobile ? '4px 12px' : '6px 16px',
                  borderRadius: '9999px',
                  fontWeight: '600',
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  lineHeight: 1, // Ensures text is vertically centered in the pill
                  whiteSpace: 'nowrap',
                }}
              >
                {params.value}
              </span>
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, [isMobile]);

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
      <DataGrid
        rows={tableRows}
        columns={columns}
        loading={isLoading}
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
            backgroundColor: '#f8fafc',
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
            color: '#6b7280',
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
    </Box>
  );
}
