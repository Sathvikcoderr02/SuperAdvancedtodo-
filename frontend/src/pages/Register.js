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
  alpha,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  PersonOutline as PersonIcon,
  EmailOutlined as EmailIcon, 
  LockOutlined as LockIcon,
  Visibility, 
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  CheckCircleOutline as CheckCircleIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon
} from '@mui/icons-material';

const Register = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
    return strength;
  };

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      return setError('You must accept the terms and conditions');
    }
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords don't match");
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const strengthText = [
      'Very Weak',
      'Weak',
      'Fair',
      'Good',
      'Strong',
      'Very Strong'
    ][passwordStrength] || '';
    
    const strengthColor = [
      'error',
      'error',
      'warning',
      'info',
      'success',
      'success'
    ][passwordStrength] || 'inherit';
    
    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Password strength:
          </Typography>
          <Typography variant="caption" fontWeight={600} color={`${strengthColor}.main`}>
            {strengthText}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, height: 4, borderRadius: 2, overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box 
              key={i}
              sx={{
                flex: 1,
                backgroundColor: i <= passwordStrength 
                  ? `${theme.palette[strengthColor].main}` 
                  : theme.palette.divider,
                borderRadius: 1,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Password requirements checklist
  const renderPasswordRequirements = () => {
    const requirements = [
      { 
        text: 'At least 8 characters', 
        valid: formData.password.length >= 8 
      },
      { 
        text: 'At least one lowercase letter', 
        valid: /[a-z]/.test(formData.password) 
      },
      { 
        text: 'At least one uppercase letter', 
        valid: /[A-Z]/.test(formData.password) 
      },
      { 
        text: 'At least one number', 
        valid: /[0-9]/.test(formData.password) 
      },
      { 
        text: 'At least one special character', 
        valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) 
      },
    ];

    return (
      <Box sx={{ mt: 1, mb: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Password must contain:
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0, '& li': { listStyle: 'none' } }}>
          {requirements.map((req, index) => (
            <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CheckCircleIcon 
                fontSize="small" 
                sx={{ 
                  mr: 1, 
                  color: req.valid ? 'success.main' : 'action.disabled',
                  fontSize: '1rem'
                }} 
              />
              <Typography 
                variant="caption" 
                color={req.valid ? 'text.primary' : 'text.secondary'}
                sx={{ textDecoration: req.valid ? 'none' : 'line-through' }}
              >
                {req.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
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
          maxWidth: 600,
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
          <PersonIcon 
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
            Create an account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Already have an account?{' '}
            <Link 
              component={RouterLink} 
              to="/login" 
              color="primary"
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign in
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              disabled={loading || isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
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
              sx={{ mb: 0 }}
            />
            
            {renderPasswordStrength()}
            {renderPasswordRequirements()}
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                      aria-label="toggle confirm password visibility"
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  color="primary"
                  disabled={loading || isSubmitting}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" color="primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 3, alignItems: 'flex-start' }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || isSubmitting || !acceptedTerms}
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
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              {loading || isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Account'
              )}
            </Button>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
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
                  // Handle Google signup
                  console.log('Google signup clicked');
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
                  // Handle GitHub signup
                  console.log('GitHub signup clicked');
                }}
              >
                GitHub
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
