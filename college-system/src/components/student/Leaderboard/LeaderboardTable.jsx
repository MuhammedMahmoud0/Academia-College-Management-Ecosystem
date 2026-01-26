import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Generate student data
const generateStudents = () => {
  const students = [];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const avatarColors = [
    '#c7d2fe', '#ddd6fe', '#fae8ff', '#fce7f3', '#ffe4e6',
    '#fed7aa', '#fef3c7', '#d9f99d', '#bbf7d0', '#a7f3d0',
    '#99f6e4', '#a5f3fc', '#bae6fd', '#bfdbfe', '#dbeafe'
  ];
  
  for (let i = 0; i < 100; i++) {
    const letter = letters[i % 26];
    const gpa = (4.0 - (i * 0.015)).toFixed(2);
    students.push({
      id: i + 1,
      rank: i + 1,
      name: `Student ${letter}${Math.floor(i / 26) || ''}${i}`,
      studentId: `AC-123${456 + i}`,
      year: (i % 4) + 1,
      gpa: parseFloat(gpa),
      avatar: letter,
      avatarColor: avatarColors[i % avatarColors.length]
    });
  }
  return students;
};

const initialRows = generateStudents();

export default function LeaderboardTable({ selectedYear }) {
  const [rows] = useState(initialRows);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Filter rows based on selected year and re-rank
  const filteredRows = useMemo(() => {
    if (selectedYear === 'all') return rows;
    const filtered = rows.filter(row => row.year === parseInt(selectedYear));
    // Re-rank the filtered results
    return filtered.map((row, index) => ({
      ...row,
      rank: index + 1
    }));
  }, [rows, selectedYear]);

 const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'rank',
        headerName: 'Rank',
        flex: isMobile ? 0 : 0.5,
        minWidth: isMobile ? 50 : 70,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
          const rank = params.value;
          let icon = null;
          let color = '#6b7280';
          const iconSize = isMobile ? '16px' : '20px';

          if (rank === 1) {
            icon = <EmojiEventsIcon sx={{ fontSize: iconSize, color: '#f59e0b' }} />;
            color = '#f59e0b';
          } else if (rank === 2) {
            icon = <EmojiEventsIcon sx={{ fontSize: iconSize, color: '#9ca3af' }} />;
            color = '#6b7280';
          } else if (rank === 3) {
            icon = <EmojiEventsIcon sx={{ fontSize: iconSize, color: '#cd7f32' }} />;
            color = '#cd7f32';
          }

          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px', fontWeight: rank <= 3 ? '600' : '400', color }}>
              {icon}
              <span style={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>{rank}</span>
            </div>
          );
        },
      },
      {
        field: 'name',
        headerName: 'Student',
        flex: isMobile ? 0 : 0.8,
        minWidth: isMobile ? 140 : 200,
        align: 'left',       // Changed: Left align looks better for names
        headerAlign: 'left', // Changed: Match header to content
        renderCell: (params) => (
          // align-items center keeps it vertically centered, but we remove justify-center
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', gap: isMobile ? '8px' : '12px' }}>
            <Avatar
              sx={{
                backgroundColor: params.row.avatarColor,
                color: '#5b21b6',
                width: isMobile ? 28 : 36,
                height: isMobile ? 28 : 36,
                fontSize: isMobile ? '0.75rem' : '1rem',
                fontWeight: 600,
                borderRadius: '50%'
              }}
            >
              {params.row.avatar}
            </Avatar>
            <span style={{ fontWeight: 500, fontSize: isMobile ? '0.8rem' : '0.875rem' }}>{params.value}</span>
          </div>
        ),
      },
      {
        field: 'studentId',
        headerName: 'ID',
        flex: isMobile ? 0 : 1.2,
        minWidth: isMobile ? 90 : 120,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{params.value}</span>
        )
      },
      {
        field: 'year',
        headerName: 'Year',
        flex: isMobile ? 0 : 0.6,
        minWidth: isMobile ? 50 : 80,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'gpa',
        headerName: 'GPA',
        flex: isMobile ? 0 : 0.8,
        minWidth: isMobile ? 70 : 90,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <span style={{ fontWeight: 700, color: '#111827' }}>{params.value.toFixed(2)}</span>
        ),
      },
    ];

    return baseColumns;
  }, [isMobile]);
  const processRowUpdate = (newRow) => {
    return newRow;
  };

  return (
    <Box
      className="bg-white rounded-2xl shadow-sm w-full"
      sx={{
        height: 'auto',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'visible',
        padding: { xs: '12px', sm: '20px', md: '32px' },
      }}
    >
      <DataGrid
        rows={filteredRows}
        columns={columns}
        processRowUpdate={processRowUpdate}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[20, 50, 100]}
        autoHeight
        disableColumnMenu
        disableRowSelectionOnClick
        rowCount={filteredRows.length}
        getRowHeight={() => 'auto'}
        sx={{
          textAlign: 'left',
          border: 'none',
          minWidth: '100%',
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
            padding: { xs: '10px 6px', sm: '14px 10px', md: '16px' },
            color: '#1f2937',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
          },

          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            fontWeight: '600',
            color: '#6b7280',
            minHeight: { xs: '48px !important', sm: '56px !important' },
            maxHeight: { xs: '48px !important', sm: '56px !important' },
          },
          '& .MuiDataGrid-columnHeader': {
            padding: { xs: '8px', sm: '12px', md: '16px' },
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '600',
            color: '#6b7280',
          },
          '& .MuiDataGrid-row': {
            marginBottom: '0px',
            borderBottom: '1px solid #f3f4f6',
            minHeight: { xs: '52px !important', sm: '60px !important', md: '64px !important' },
            '&:last-child': {
              borderBottom: 'none',
            },
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
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e5e7eb',
            marginTop: '16px',
            paddingTop: '16px',
          },
          '& .MuiTablePagination-root': {
            color: '#6b7280',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: '#6b7280',
          },
          '& .MuiTablePagination-select': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          },
        }}
      />
    </Box>
  );
}
