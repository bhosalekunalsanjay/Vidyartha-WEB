import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PersonIcon from '@mui/icons-material/PersonOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import ExitToAppIcon from '@mui/icons-material/ExitToAppOutlined'
import { useAuth } from '../context/AuthContext'

function getInitials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <>
      <Box
        onClick={(e: MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', p: 0.5, borderRadius: '50px' }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
          {getInitials(user.name)}
        </Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: '0.85rem' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
            {user.email}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 240, mt: 1.5, borderRadius: '12px', p: 1 } } }}
      >
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: '8px', py: 1.25 }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ borderRadius: '8px', py: 1.25 }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', py: 1.25, color: 'error.main' }}>
          <ListItemIcon><ExitToAppIcon sx={{ color: 'error.main' }} /></ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  )
}