import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function CourseCard({ course, onAction }) {
  const isRegistered = course.registered >= course.capacity;
  const canRemove = course.isEnrolled;

  return (
    <Card 
      sx={{ 
        minWidth: 280,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        borderRadius: '12px',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }
      }}
    >
      <CardContent sx={{ padding: '24px' }}>
        {/* Course Header */}
        <div className="flex justify-between items-start mb-3">
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              fontWeight: 600,
              fontSize: '1.125rem',
              color: '#1f2937',
              lineHeight: 1.3
            }}
          >
            {course.name}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: '#6366f1',
              fontWeight: 600,
              backgroundColor: '#eef2ff',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {course.code}
          </Typography>
        </div>

        {/* Instructor */}
        <Typography 
          sx={{ 
            color: '#6b7280',
            fontSize: '0.875rem',
            marginBottom: '12px'
          }}
        >
          with {course.instructor}
        </Typography>

        {/* Schedule */}
        <div className="flex items-center gap-2 mb-3">
          <AccessTimeIcon sx={{ fontSize: '18px', color: '#6b7280' }} />
          <Typography sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {course.schedule}
          </Typography>
        </div>

        {/* Credits and Registration Status */}
        <div className="flex justify-between items-center mb-4">
          <Typography sx={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: 500 }}>
            {course.credits} Credits
          </Typography>
          <Typography 
            sx={{ 
              fontSize: '0.875rem',
              color: isRegistered ? '#dc2626' : '#6b7280',
              fontWeight: 500
            }}
          >
            {course.registered}/{course.capacity} Registered
          </Typography>
        </div>

        {/* Action Button */}
        <Button
          fullWidth
          variant={canRemove ? 'outlined' : 'contained'}
          disabled={!canRemove && isRegistered}
          onClick={() => onAction(course.id, canRemove)}
          startIcon={canRemove ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            padding: '10px 16px',
            borderRadius: '8px',
            ...(canRemove ? {
              color: '#dc2626',
              borderColor: '#fecaca',
              backgroundColor: '#fef2f2',
              '&:hover': {
                backgroundColor: '#fee2e2',
                borderColor: '#fca5a5',
              }
            } : {
              backgroundColor: isRegistered ? '#e5e7eb' : '#6366f1',
              color: isRegistered ? '#9ca3af' : '#ffffff',
              border: 'none',
              '&:hover': {
                backgroundColor: isRegistered ? '#e5e7eb' : '#4f46e5',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e5e7eb',
                color: '#9ca3af',
              }
            })
          }}
        >
          {canRemove ? 'Remove Course' : 'Add Course'}
        </Button>
      </CardContent>
    </Card>
  );
}
