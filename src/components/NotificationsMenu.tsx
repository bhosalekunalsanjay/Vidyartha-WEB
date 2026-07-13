import { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined'
import api from '../api/axiosClient'

interface InboxNotification {
  id: string
  title: string
  detail: string
}

export default function NotificationsMenu() {
  const [items, setItems] = useState<InboxNotification[]>([])
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    api
      .get<InboxNotification[]>('/notifications')
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
  }, [])

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Notifications" sx={{ bgcolor: 'action.hover' }}>
        <Badge badgeContent={items.length} color="error">
          <NotificationsIcon sx={{ fontSize: 20 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 320, mt: 1.5, borderRadius: '12px', p: 1 } } }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
        </Box>
        {items.length === 0 && (
          <MenuItem disabled sx={{ borderRadius: '8px' }}>
            No new notifications
          </MenuItem>
        )}
        {items.map((item) => (
          <MenuItem key={item.id} onClick={() => setAnchorEl(null)} sx={{ borderRadius: '8px', py: 1.25 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.detail}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}