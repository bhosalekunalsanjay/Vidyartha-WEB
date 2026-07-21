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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { format } from 'date-fns'
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

interface ActiveSession {
  tokenId: string
  deviceInfo: string
  expiresAt: string
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

  // Session conflicts state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
  const [terminatingId, setTerminatingId] = useState<string | null>(null)

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
        navigate('/', { replace: true })
      }, 1000)
    } catch (err: any) {
      const errData = err.response?.data
      if (err.response?.status === 409 && errData?.message === 'MAX_LOGINS_REACHED') {
        setActiveSessions(errData.errors || [])
        setDialogOpen(true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleTerminateAndLogin = async (tokenId: string) => {
    setTerminatingId(tokenId)
    try {
      await login(username, password, tokenId)
      setDialogOpen(false)
      notify.success('Logged in successfully after terminating session.')
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 1000)
    } catch (err: any) {
      console.error(err)
    } finally {
      setTerminatingId(null)
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

      {/* Session Limit Exceeded Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              p: 1.5,
              bgcolor: 'background.paper',
            }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Concurrent Login Limit Reached
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You are currently logged in on 3 other devices. Choose an active session to terminate and log in here:
          </DialogContentText>
          <List sx={{ pt: 0 }}>
            {activeSessions.map((session, index) => (
              <Box key={session.tokenId}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 1.5, px: 0 }}>
                  <ListItemText
                    primary={
                      session.deviceInfo && session.deviceInfo.includes('Chrome') && session.deviceInfo.includes('Windows')
                        ? 'Chrome on Windows'
                        : session.deviceInfo && session.deviceInfo.includes('Firefox')
                        ? 'Firefox Browser'
                        : session.deviceInfo && session.deviceInfo.includes('Safari') && !session.deviceInfo.includes('Chrome')
                        ? 'Safari Browser'
                        : session.deviceInfo && (session.deviceInfo.includes('Mobile') || session.deviceInfo.includes('Android') || session.deviceInfo.includes('iPhone'))
                        ? 'Mobile Device'
                        : session.deviceInfo && session.deviceInfo.length > 50
                        ? session.deviceInfo.substring(0, 47) + '...'
                        : session.deviceInfo || 'Unknown Device'
                    }
                    secondary={`Expires: ${
                      (() => {
                        try {
                          const d = new Date(session.expiresAt)
                          if (isNaN(d.getTime())) return ''
                          return format(d, 'MMM d, yyyy h:mm a')
                        } catch {
                          return ''
                        }
                      })()
                    }`}
                    slotProps={{
                      primary: { sx: { fontWeight: 700, fontSize: '0.9rem' } },
                      secondary: { sx: { fontSize: '0.8rem' } },
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      disabled={terminatingId !== null}
                      onClick={() => handleTerminateAndLogin(session.tokenId)}
                      sx={{ textTransform: 'none', borderRadius: '6px', fontWeight: 700 }}
                    >
                      {terminatingId === session.tokenId ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        'Terminate & Login'
                      )}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="text"
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
