import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import TaskList from '../components/tasks/TaskList';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Dashboard
        </Typography>
        <TaskList />
      </Box>
    </Container>
  );
};

export default Dashboard;
