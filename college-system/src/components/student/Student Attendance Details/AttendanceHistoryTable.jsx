import { useMemo, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

function AttendanceToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 1, justifyContent: "space-between" }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Attendance Sessions
      </Typography>
      <GridToolbarQuickFilter placeholder="Search course, date, location..." />
    </GridToolbarContainer>
  );
}

export default function AttendanceHistoryTable({ rows }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") {
      return rows;
    }
    return rows.filter((row) => row.status === statusFilter);
  }, [rows, statusFilter]);

  const columns = [
    { field: "date", headerName: "Date", minWidth: 120, flex: 0.8 },
    { field: "course", headerName: "Course", minWidth: 160, flex: 1.2 },
    { field: "courseCode", headerName: "Code", minWidth: 110, flex: 0.8 },
    { field: "group", headerName: "Group", minWidth: 90, flex: 0.5 },
    { field: "sessionType", headerName: "Type", minWidth: 110, flex: 0.8 },
    { field: "day", headerName: "Day", minWidth: 120, flex: 0.8 },
    { field: "location", headerName: "Location", minWidth: 130, flex: 1 },
    { field: "startTime", headerName: "Start", minWidth: 95, flex: 0.7 },
    { field: "endTime", headerName: "End", minWidth: 95, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === "present" ? "success" : "error"}
          variant="outlined"
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
        />
      ),
    },
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: 2,
            pt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Session History
          </Typography>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="status-filter-label">Status Filter</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status Filter"
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: "100%", mt: 1 }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            slots={{
              toolbar: AttendanceToolbar,
            }}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#F8FAFC",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
