import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../theme/ColorModeContext'

// MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Fade from '@mui/material/Fade'
// Icons
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeIcon from '@mui/icons-material/LightModeOutlined'

import InfoTooltip from '../components/InfoTooltip'
import LoginSkeleton from '../components/LoginSkeleton'
import { notify } from '../store/notification.store'

interface LocationState {
  from?: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()

  // Skeletons / Initial page loading
  const [pageLoading, setPageLoading] = useState(true)

  // Form Fields State
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Redirection target
  const state = location.state as LocationState | null
  const from = state?.from || '/'

  // Simulate initial loading to demonstrate beautiful skeleton transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Client-side validations
    if (!username.trim() && !password.trim()) {
      notify.error('Please enter your username and password.')
      return
    }
    if (!username.trim()) {
      notify.error('Username field is required.')
      return
    }
    if (!password.trim()) {
      notify.error('Password field is required.')
      return
    }

    setSubmitting(true)
    try {
      await login(username, password)
      
      // Open success popup and redirect
      notify.success('You have successfully signed in.')
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1000)
    } catch (err: any) {
    } finally {
      setSubmitting(false)
    }
  }

  if (pageLoading) {
    return <LoginSkeleton />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
        background:
          mode === 'dark'
            ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 13, 22, 0.2) 90.1%)'
            : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, rgba(248, 250, 252, 0.2) 90.1%)',
      }}
    >
      {/* Absolute Header with Theme Toggler */}
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <IconButton
          onClick={toggleColorMode}
          color="inherit"
          sx={{
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'rotate(15deg) scale(1.08)',
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      {/* Login Card */}
      <Fade in={!pageLoading} timeout={600}>
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            p: 4,
            borderRadius: 6,
            backdropFilter: 'blur(20px)',
            backgroundColor: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.75)',
            position: 'relative',
          }}
        >
          {/* Logo Brand Symbol */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: `0 8px 24px rgba(99, 102, 241, ${mode === 'dark' ? 0.4 : 0.2})`,
            }}
          >
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" color="text.primary" sx={{ mb: 1, fontWeight: 800 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access the workspace.
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <Box sx={{ mb: 2.5 }}>
              <TextField
                fullWidth
                label="Username"
                placeholder="Enter your username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ color: 'text.secondary', opacity: 0.8 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <InfoTooltip title="Please enter your registered username." />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Password Input */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'text.secondary', opacity: 0.8 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end" sx={{ gap: 0.5 }}>
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary', opacity: 0.8 }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <InfoTooltip title="Password must contain at least 8 characters." />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Action Button */}
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                background:
                  mode === 'dark'
                    ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                    : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                '&:hover': {
                  background:
                    mode === 'dark'
                      ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                      : 'linear-gradient(135deg, #3730a3 0%, #6b21a8 100%)',
                },
              }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </Fade>
    </Box>
  )
}
