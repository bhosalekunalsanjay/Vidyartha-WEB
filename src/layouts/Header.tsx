import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useMatches } from 'react-router'
import NotificationsMenu from '../components/NotificationsMenu'
import ProfileMenu from '../components/ProfileMenu'
import { HEADER_HEIGHT } from '../layouts/layoutConstants'

interface RouteHandle {
  title?: string
}

export default function Header() {
  const matches = useMatches()
  const title = (matches.at(-1)?.handle as RouteHandle | undefined)?.title ?? 'Dashboard'

  return (
    <Box
      component="header"
      sx={{
        height: HEADER_HEIGHT,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        flexShrink: 0,
        mb: 1.5,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <NotificationsMenu />
        <ProfileMenu />
      </Box>
    </Box>
  )
}