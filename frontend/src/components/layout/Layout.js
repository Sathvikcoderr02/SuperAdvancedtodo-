import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Avatar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Logout as LogoutIcon, 
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{
          background: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8) 
            : theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: 'text.primary',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <TaskIcon 
                sx={{ 
                  mr: 1, 
                  color: 'primary.main',
                  fontSize: 32 
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                component={RouterLink}
                to="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'primary.main',
                  textDecoration: 'none',
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`
                    : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                TaskFlow
              </Typography>
            </Box>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : <AccountIcon />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem component={RouterLink} to="/" onClick={handleClose}>
                    <DashboardIcon sx={{ mr: 1.5 }} fontSize="small" />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5 }} fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  component={RouterLink} 
                  to="/login" 
                  variant="outlined" 
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/register" 
                  variant="contained" 
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: theme.shadows[2],
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography 
                component="a" 
                href="#" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Privacy
              </Typography>
              <Typography 
                component="a" 
                href="#" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Terms
              </Typography>
              <Typography 
                component="a" 
                href="#" 
                variant="body2" 
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Contact
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
