import { Outlet, useNavigate, useLocation } from 'react-router'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../theme/ColorModeContext'

// Icons
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeIcon from '@mui/icons-material/LightModeOutlined'
import LogoutIcon from '@mui/icons-material/LogoutOutlined'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get first letter of username for Avatar representation
  const getInitials = () => {
    if (!user?.name) return 'A'
    return user.name.charAt(0).toUpperCase()
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      {/* Floating Navigation Header */}
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(16px)',
            bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.8)',
            px: { xs: 1, sm: 2 },
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
            {/* Logo Brand / Workspace Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px rgba(99, 102, 241, ${mode === 'dark' ? 0.35 : 0.15})`,
                }}
              >
                <DashboardIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: mode === 'dark'
                    ? 'linear-gradient(90deg, #818cf8 0%, #c084fc 100%)'
                    : 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Vidyartha
              </Typography>
            </Box>

            {/* Navigation Options */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                startIcon={<DashboardIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1,
                  bgcolor: location.pathname === '/' ? 'action.selected' : 'transparent',
                  color: location.pathname === '/' ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Dashboard
              </Button>

              {/* Theme Toggle */}
              <IconButton
                onClick={toggleColorMode}
                color="inherit"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  p: 1.25,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* User Avatar & Name */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  pl: { xs: 0.5, sm: 1.5 },
                  borderLeft: { xs: 'none', sm: '1px solid' },
                  borderColor: 'divider',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    bgcolor: 'secondary.main',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(168, 85, 247, 0.25)',
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    display: { xs: 'none', md: 'block' },
                    color: 'text.primary',
                  }}
                >
                  {user?.name || 'Admin'}
                </Typography>

                {/* Logout Button */}
                <IconButton
                  onClick={handleLogout}
                  color="error"
                  sx={{
                    borderRadius: '12px',
                    p: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'error.lighter',
                      borderColor: 'error.main',
                    },
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Container>

      {/* Main Content Body */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}