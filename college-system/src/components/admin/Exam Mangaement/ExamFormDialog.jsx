import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';

const defaultFormValues = {
  offering_id: '',
  exam_type: 'Midterm',
  exam_date: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  location: '',
};

function getDayOfWeek(dateValue) {
  if (!dateValue) {
    return '';
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function normalizeValues(values) {
  if (!values) {
    return defaultFormValues;
  }

  const normalizedExamDate = values.exam_date ? String(values.exam_date).split('T')[0] : '';

  return {
    ...defaultFormValues,
    ...values,
    exam_date: normalizedExamDate,
    day_of_week: getDayOfWeek(normalizedExamDate) || values.day_of_week || '',
    start_time: values.start_time ? String(values.start_time).slice(0, 5) : '',
    end_time: values.end_time ? String(values.end_time).slice(0, 5) : '',
  };
}

export default function ExamFormDialog({
  open,
  mode,
  initialValues,
  activeOfferings,
  isLoadingOfferings,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [formValues, setFormValues] = useState(defaultFormValues);

  useEffect(() => {
    if (open) {
      setFormValues(normalizeValues(initialValues));
    }
  }, [open, initialValues]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setFormValues((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'exam_date' ? { day_of_week: getDayOfWeek(value) } : {}),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...(mode === 'create' ? { offering_id: Number(formValues.offering_id) } : {}),
      exam_type: formValues.exam_type,
      day_of_week: getDayOfWeek(formValues.exam_date),
      exam_date: formValues.exam_date || '',
      start_time: formValues.start_time ? `${formValues.start_time}:00` : '',
      end_time: formValues.end_time ? `${formValues.end_time}:00` : '',
      location: formValues.location,
    });
  };

  const title = mode === 'edit' ? 'Edit Exam' : 'Create Exam';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mt: 0.5,
            }}
          >
            {mode === 'create' && (
              <TextField
                select
                label="Course Offering"
                value={formValues.offering_id}
                onChange={handleChange('offering_id')}
                required
                disabled={isSubmitting || isLoadingOfferings}
                helperText={
                  isLoadingOfferings
                    ? 'Loading available courses...'
                    : 'Select a course offering for this exam'
                }
              >
                <MenuItem value="">Select course offering</MenuItem>
                {(activeOfferings || []).map((offering) => (
                  <MenuItem key={offering.offering_id} value={offering.offering_id}>
                    {offering.course_name} ({offering.course_code}) - {offering.semester} {offering.year}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              select
              label="Exam Type"
              value={formValues.exam_type}
              onChange={handleChange('exam_type')}
              required
              disabled={isSubmitting}
            >
              <MenuItem value="Midterm">Midterm</MenuItem>
              <MenuItem value="Final">Final</MenuItem>
              <MenuItem value="Quiz">Quiz</MenuItem>
              <MenuItem value="Practical">Practical</MenuItem>
            </TextField>
            <TextField
              label="Exam Date"
              type="date"
              value={formValues.exam_date}
              onChange={handleChange('exam_date')}
              InputLabelProps={{ shrink: true }}
              required
              disabled={isSubmitting}
            />
            <TextField
              label="Start Time"
              type="time"
              value={formValues.start_time}
              onChange={handleChange('start_time')}
              InputLabelProps={{ shrink: true }}
              required
              disabled={isSubmitting}
            />
            <TextField
              label="End Time"
              type="time"
              value={formValues.end_time}
              onChange={handleChange('end_time')}
              InputLabelProps={{ shrink: true }}
              required
              disabled={isSubmitting}
            />
            <TextField
              label="Location"
              value={formValues.location}
              onChange={handleChange('location')}
              required
              disabled={isSubmitting}
            />
            <TextField
              label="Day Of Week"
              value={formValues.day_of_week || ''}
              disabled
              helperText="Auto-filled from exam date"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Exam'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
