import { Card, CardContent, Typography } from "@mui/material";

export default function AttendanceSummaryCards({
  totalSessions,
  presentCount,
  attendancePercentage,
  absentCount,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Sessions
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {totalSessions}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Present Sessions
          </Typography>
          <Typography variant="h4" fontWeight={700} color="success.main">
            {presentCount}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Absent Sessions
          </Typography>
          <Typography variant="h4" fontWeight={700} color="error.main">
            {absentCount}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Attendance Rate
          </Typography>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            {attendancePercentage}%
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
