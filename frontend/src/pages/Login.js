import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { 
  LockOutlined as LockIcon, 
  EmailOutlined as EmailIcon, 
  Visibility, 
  VisibilityOff,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      setLoading(true);
      // Use demo credentials
      await login('demo@example.com', 'password123');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Failed to log in with demo account. Please try again.');
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Container 
      component="main" 
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 500,
          position: 'relative',
        }}
      >
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            left: -80,
            top: 20,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
            [theme.breakpoints.down('md')]: {
              left: 0,
              top: -50,
            },
          }}
        >
          Back
        </Button>
        
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <LockIcon 
            sx={{
              fontSize: 50,
              color: 'primary.main',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '50%',
              p: 1,
              mb: 2,
            }}
          />
          <Typography component="h1" variant="h4" fontWeight={700} gutterBottom>
            Welcome back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/register" 
              color="primary"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography component="h2" variant="h6" fontWeight={600} mb={3} textAlign="center">
            Sign in to your account
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 1,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* You can add a "Remember me" checkbox here if needed */}
              </Box>
              <Link 
                href="#" 
                variant="body2" 
                component={RouterLink} 
                to="/forgot-password"
                sx={{ 
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {loading || isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                disabled={loading || isSubmitting}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.text.primary, 0.02),
                  },
                }}
                onClick={() => {
                  // Handle Google login
                  console.log('Google login clicked');
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHubIcon />}
                disabled={loading || isSubmitting}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: theme.palette.text.primary,
                    backgroundColor: alpha(theme.palette.text.primary, 0.02),
                  },
                }}
                onClick={() => {
                  // Handle GitHub login
                  console.log('GitHub login clicked');
                }}
              >
                GitHub
              </Button>
            </Box>
            
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handleDemoLogin}
              disabled={loading || isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: theme.palette.divider,
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                },
              }}
            >
              Try Demo Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
