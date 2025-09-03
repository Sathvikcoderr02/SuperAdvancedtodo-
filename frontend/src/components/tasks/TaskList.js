import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  Tooltip,
  Zoom,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import config from '../../config';

const TaskList = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const url = `${config.apiBaseUrl}/tasks${filter !== 'all' ? `?status=${filter}` : ''}`;
        console.log('Fetching tasks from:', url);
        const response = await axios.get(url);
        
        // Log the raw response data
        console.log('Tasks API response:', response.data);
        
        // Normalize task data to ensure consistent ID field
        const normalizedTasks = response.data.map(task => ({
          ...task,
          _id: task._id || task.id // Use _id if available, otherwise use id
        }));
        
        console.log('Normalized tasks:', normalizedTasks);
        setTasks(normalizedTasks);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch tasks';
        setError(errorMessage);
        console.error('Error fetching tasks:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filter]);

  const handleToggleStatus = async (taskId, currentStatus, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!taskId) {
      console.error('No task ID provided');
      setError('Invalid task ID');
      return;
    }
    
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    console.log('Toggling task status:', { taskId, currentStatus, newStatus });
    
    try {
      
      const response = await axios.patch(`${config.apiBaseUrl}/tasks/${taskId}/toggle`);
      
      setTasks(tasks.map(task => 
        task._id === taskId 
          ? { ...task, status: response.data.status || newStatus } 
          : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${config.apiBaseUrl}/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2} mb={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: 2,
        background: theme.palette.mode === 'dark' 
          ? alpha(theme.palette.background.paper, 0.8) 
          : theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            background: theme.palette.mode === 'dark' 
              ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
              : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          My Tasks
        </Typography>
        <Button 
          component={Link} 
          to="/tasks/new" 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Add New Task
        </Button>
      </Box>
      
      <Box mb={3}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <FilterListIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
            Filter by:
          </Typography>
          <Chip
            label="All"
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            variant={filter === 'all' ? 'filled' : 'outlined'}
            clickable
            sx={{ borderRadius: 1, fontWeight: 500 }}
          />
          <Chip
            label="Pending"
            onClick={() => setFilter('pending')}
            color={filter === 'pending' ? 'warning' : 'default'}
            variant={filter === 'pending' ? 'filled' : 'outlined'}
            icon={<PendingIcon />}
            clickable
            sx={{ borderRadius: 1, fontWeight: 500 }}
          />
          <Chip
            label="Completed"
            onClick={() => setFilter('completed')}
            color={filter === 'completed' ? 'success' : 'default'}
            variant={filter === 'completed' ? 'filled' : 'outlined'}
            icon={<CheckCircleIcon />}
            clickable
            sx={{ borderRadius: 1, fontWeight: 500 }}
          />
        </Stack>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {tasks.length === 0 ? (
        <Box 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.background.default, 0.5)
              : alpha(theme.palette.grey[100], 0.8),
            border: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by creating your first task
          </Typography>
          <Button 
            component={Link} 
            to="/tasks/new" 
            variant="outlined" 
            color="primary"
            startIcon={<AddIcon />}
            size="small"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Create Task
          </Button>
        </Box>
      ) : (
        <List disablePadding>
          {tasks.map((task) => {
            if (!task._id) {
              console.warn('Task missing _id:', task);
              return null; // Skip rendering tasks without an ID
            }
            return (
              <ListItem 
                key={`task-${task._id}`} 
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.6)
                    : theme.palette.background.paper,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
                    backgroundColor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : theme.palette.grey[50],
                  },
                  '&:last-child': {
                    mb: 0
                  }
                }}
              >
                <Checkbox
                  edge="start"
                  checked={task.status === 'completed'}
                  tabIndex={-1}
                  disableRipple
                  onChange={(e) => handleToggleStatus(task._id, task.status, e)}
                  onClick={(e) => e.stopPropagation()}
                  color="primary"
                  sx={{
                    p: 1,
                    mr: 1.5,
                    '& .MuiSvgIcon-root': {
                      width: 28,
                      height: 28,
                    },
                    '&.Mui-checked': {
                      color: theme.palette.success.main,
                    },
                  }}
                />
                <Box sx={{ flexGrow: 1, overflow: 'hidden', mr: 2 }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        fontWeight: 600,
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.status === 'completed' ? (
                      <Chip 
                        label="Completed" 
                        size="small" 
                        color="success"
                        icon={<CheckCircleIcon fontSize="small" />}
                        sx={{ ml: 1.5, borderRadius: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    ) : (
                      <Chip 
                        label="Pending" 
                        size="small" 
                        color="warning"
                        icon={<PendingIcon fontSize="small" />}
                        sx={{ ml: 1.5, borderRadius: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  
                  {task.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  
                  {task.dueDate && (
                    <Box 
                      display="flex" 
                      alignItems="center" 
                      sx={{ 
                        mt: 0.5,
                        color: theme.palette.text.secondary,
                        '& svg': {
                          fontSize: '1rem',
                          mr: 0.5,
                          color: theme.palette.text.secondary,
                        }
                      }}
                    >
                      <CalendarIcon fontSize="inherit" />
                      <Typography variant="caption" component="span">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <ListItemSecondaryAction>
                  <Tooltip 
                    title="Edit task" 
                    arrow 
                    TransitionComponent={Zoom}
                    enterDelay={300}
                    leaveDelay={200}
                  >
                    <IconButton 
                      edge="end" 
                      aria-label="edit" 
                      component={Link}
                      to={`/tasks/${task._id}/edit`}
                      sx={{ 
                        mr: 1,
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip 
                    title="Delete task" 
                    arrow 
                    TransitionComponent={Zoom}
                    enterDelay={300}
                    leaveDelay={200}
                  >
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDelete(task._id)}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default TaskList;
