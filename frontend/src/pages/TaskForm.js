import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from '../config';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  dueDate: Yup.date().nullable(),
  status: Yup.string().oneOf(['pending', 'completed']).default('pending'),
});

const TaskForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: null,
      status: 'pending',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        const taskData = {
          ...values,
          dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        };

        if (isEditing) {
          await axios.put(`${config.apiBaseUrl}/tasks/${id}`, taskData);
        } else {
          await axios.post(`${config.apiBaseUrl}/tasks`, taskData);
        }
        
        navigate('/');
      } catch (err) {
        console.error('Error saving task:', err);
        setError(err.response?.data?.message || 'Failed to save task');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      if (!isEditing) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${config.apiBaseUrl}/tasks/${id}`);
        const task = response.data;
        
        formik.setValues({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          status: task.status || 'pending',
        });
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </Typography>
        
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="normal"
            disabled={loading}
          />
          
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
            disabled={loading}
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Due Date"
              value={formik.values.dueDate}
              onChange={(date) => formik.setFieldValue('dueDate', date, true)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  disabled={loading}
                />
              )}
            />
          </LocalizationProvider>
          
          {isEditing && (
            <Box mt={2} mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.status === 'completed'}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'status',
                        e.target.checked ? 'completed' : 'pending'
                      )
                    }
                    disabled={loading}
                  />
                }
                label="Mark as completed"
              />
              {formik.touched.status && formik.errors.status && (
                <FormHelperText error>{formik.errors.status}</FormHelperText>
              )}
            </Box>
          )}
          
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !formik.isValid}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isEditing ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default TaskForm;
