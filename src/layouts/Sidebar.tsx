import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SchoolIcon from '@mui/icons-material/SchoolOutlined'
import { navConfig, isGroup, type NavItem } from '../routes/navConfig'
import { useAuth } from '../context/AuthContext'
import { checkUserRole } from '../utils/roleCheck'
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  HEADER_HEIGHT,
  NAV_ITEM_HEIGHT,
  NAV_SUBITEM_HEIGHT,
} from '../layouts/layoutConstants'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

function useIsActive() {
  const location = useLocation()
  return (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))
}

function NavRow({
  item,
  collapsed,
  expandedMenus,
  onToggleGroup,
}: {
  item: NavItem
  collapsed: boolean
  expandedMenus: Record<string, boolean>
  onToggleGroup: (label: string) => void
}) {
  const navigate = useNavigate()
  const isActivePath = useIsActive()
  const Icon = item.icon

  if (isGroup(item)) {
    const isExpanded = !!expandedMenus[item.label]
    const groupActive = item.subItems.some((sub) => isActivePath(sub.path))

    return (
      <Box>
        <Tooltip title={collapsed ? item.label : ''} placement="right" disableHoverListener={!collapsed}>
          <ListItemButton
            onClick={() => onToggleGroup(item.label)}
            sx={{
              height: NAV_ITEM_HEIGHT,
              minHeight: NAV_ITEM_HEIGHT,
              py: 0,
              borderRadius: '8px',
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? 'center' : 'initial',
              color: groupActive ? 'primary.main' : 'text.secondary',
              bgcolor: groupActive ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 32, color: item.color || 'inherit' }}>
              {Icon && <Icon sx={{ fontSize: 18 }} />}
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '0.8rem' } } }}
                />
                {isExpanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
              </>
            )}
          </ListItemButton>
        </Tooltip>

        <Collapse in={isExpanded && !collapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ mt: 0.25, gap: 0.25 }}>
            {item.subItems.map((sub) => (
              <ListItemButton
                key={sub.path}
                onClick={() => navigate(sub.path)}
                selected={isActivePath(sub.path)}
                sx={{
                  height: NAV_SUBITEM_HEIGHT,
                  minHeight: NAV_SUBITEM_HEIGHT,
                  py: 0,
                  pl: 5,
                  borderRadius: '8px',
                  color: isActivePath(sub.path) ? 'primary.main' : 'text.secondary',
                  bgcolor: isActivePath(sub.path) ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemText
                  primary={sub.label}
                  slotProps={{ primary: { sx: { fontSize: '0.75rem', fontWeight: 500 } } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </Box>
    )
  }

  const active = isActivePath(item.path)

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" disableHoverListener={!collapsed}>
      <ListItemButton
        onClick={() => navigate(item.path)}
        selected={active}
        sx={{
          height: NAV_ITEM_HEIGHT,
          minHeight: NAV_ITEM_HEIGHT,
          py: 0,
          borderRadius: '8px',
          px: collapsed ? 1.5 : 2,
          justifyContent: collapsed ? 'center' : 'initial',
          color: active ? 'primary.main' : 'text.secondary',
          bgcolor: active ? 'action.selected' : 'transparent',
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 32, color: item.color || 'inherit' }}>
          {Icon && <Icon sx={{ fontSize: 18 }} />}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.label}
            slotProps={{ primary: { sx: { fontWeight: active ? 700 : 600, fontSize: '0.8rem' } } }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  )
}

export default function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const { user } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ Students: true })

  const toggleGroup = (label: string) => setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }))

  const isSuper = checkUserRole.isSuperAdmin(user?.role)
  const visibleNavItems = isSuper
    ? navConfig
    : navConfig.filter((item) => item.label === 'Dashboard')

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRadius: '16px',
        m: 2,
        mr: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowX: 'hidden',
        height: 'calc(100vh - 32px)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          sx={{
            height: HEADER_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            px: collapsed ? 2 : 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            gap: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SchoolIcon sx={{ color: '#fff', fontSize: 16 }} />
          </Box>
          {!collapsed && (
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
              Vidyartha
            </Typography>
          )}
        </Box>
 
        <List sx={{ flexGrow: 1, px: 1, py: 1.5, gap: 0.25, overflowY: 'auto' }}>
          {visibleNavItems.map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} expandedMenus={expandedMenus} onToggleGroup={toggleGroup} />
          ))}
        </List>
      </Box>

      <Box sx={{ p: 1.5 }}>
        <Divider sx={{ mb: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: 0.75 }}
          >
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}