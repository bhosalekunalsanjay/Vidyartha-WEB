import { useEffect, useState } from 'react'
import api from '../api/api.ts'
import { useAuth } from '../context/AuthContext'
import { useColorMode } from '../theme/ColorModeContext'

// MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Divider from '@mui/material/Divider'

// Icons
import SchoolIcon from '@mui/icons-material/School'
import PeopleIcon from '@mui/icons-material/People'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AddIcon from '@mui/icons-material/Add'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DateRangeIcon from '@mui/icons-material/DateRange'

// Reusable Components
import DashboardSkeleton from '../components/DashboardSkeleton'
import { useNotificationStore } from '../features/notification'

interface DashboardSummary {
  totalStudents?: number
  activeSessions?: number
  completionRate?: number
  systemLoad?: number
  recentActivities?: Array<{
    id: string
    title: string
    time: string
    category: string
  }>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { mode } = useColorMode()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const triggerPopup = (title: string, message: string, type: 'error' | 'success' | 'warning' | 'info') => {
    showNotification({ title, message, type })
  }

  useEffect(() => {
    // Add a small simulated delay to display skeleton loadings
    const fetchTimer = setTimeout(() => {
      api
        .get<DashboardSummary>('/dashboard/summary')
        .then((res) => {
          setData(res.data)
        })
        .catch((err) => {
          // If server fails or is not running, notify and fall back to mock data
          const apiMessage = err?.response?.data?.message || err?.message || 'Failed to fetch active server stats.'
          triggerPopup(
            'API Connection Error',
            `${apiMessage}. Loading local offline dataset for visualization.`,
            'warning'
          )
          
          // Failsafe offline data to make the page interactive
          setData({
            totalStudents: 1248,
            activeSessions: 86,
            completionRate: 94.2,
            systemLoad: 28.5,
            recentActivities: [
              { id: '1', title: 'Aditi Sharma completed Mathematics Quiz', time: '10 mins ago', category: 'quiz' },
              { id: '2', title: 'System back-up succeeded', time: '1 hour ago', category: 'system' },
              { id: '3', title: 'New Course "Organic Chemistry" published', time: '4 hours ago', category: 'course' },
            ],
          })
        })
        .finally(() => setLoading(false))
    }, 1000)

    return () => clearTimeout(fetchTimer)
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  // Derived values with fallbacks
  const totalStudents = data?.totalStudents ?? 0
  const activeSessions = data?.activeSessions ?? 0
  const completionRate = data?.completionRate ?? 0.0
  const systemLoad = data?.systemLoad ?? 0.0
  const recentActivities = data?.recentActivities ?? []

  return (
    <Box sx={{ py: 2, animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Top Banner Greeting */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>
            Hello, {user?.name || 'Administrator'} 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is what's happening with your students and workspace today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            py: 1.5,
            px: 3,
            background:
              mode === 'dark'
                ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          }}
        >
          Add New Report
        </Button>
      </Box>

      {/* Grid of Statistical Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Students */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Total Students
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {totalStudents}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.light', width: 44, height: 44 }}>
                <PeopleIcon sx={{ color: '#fff' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                +14.2%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                from last month
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Active Sessions */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Active Sessions
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {activeSessions}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.light', width: 44, height: 44 }}>
                <SchoolIcon sx={{ color: '#fff' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                +8.4%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                live learners
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Completion Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Completion Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {completionRate}%
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.light', width: 44, height: 44 }}>
                <AssessmentIcon sx={{ color: '#fff' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                +1.2%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                vs target 90%
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* System Load */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  System Health
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {100 - systemLoad}%
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.light', width: 44, height: 44 }}>
                <SettingsInputComponentIcon sx={{ color: '#fff' }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 20 }} />
              <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                -4.3%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                latency offset
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Details Grid (mock charts & lists) */}
      <Grid container spacing={3}>
        {/* Performance Chart Paper */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 4, height: '100%', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Weekly Learning Engagement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculated active user study hours.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Quiz Hours" size="small" color="primary" variant="filled" sx={{ borderRadius: '8px' }} />
                <Chip label="Video Hours" size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
              </Box>
            </Box>

            {/* Custom SVG Bar Chart with Rounded Caps */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: 220, gap: '4%', pt: 2, px: 2 }}>
              {[
                { label: 'Mon', val: 65 },
                { label: 'Tue', val: 78 },
                { label: 'Wed', val: 50 },
                { label: 'Thu', val: 92 },
                { label: 'Fri', val: 85 },
                { label: 'Sat', val: 35 },
                { label: 'Sun', val: 40 },
              ].map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${item.val}%`,
                      background:
                        mode === 'dark'
                          ? 'linear-gradient(180deg, #a855f7 0%, rgba(99, 102, 241, 0.4) 100%)'
                          : 'linear-gradient(180deg, #4f46e5 0%, rgba(79, 70, 229, 0.1) 100%)',
                      borderRadius: '16px 16px 0 0',
                      transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        filter: 'brightness(1.15)',
                        cursor: 'pointer',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, fontWeight: 600 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Recent Activities List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, height: '100%', minHeight: 380, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Activities
            </Typography>
            <List sx={{ p: 0, flex: 1 }}>
              {recentActivities.map((act, index) => (
                <Box key={act.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            act.category === 'quiz'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : act.category === 'system'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : 'rgba(168, 85, 247, 0.1)',
                        }}
                      >
                        {act.category === 'quiz' ? (
                          <AssignmentIcon sx={{ color: '#10b981' }} />
                        ) : act.category === 'system' ? (
                          <DateRangeIcon sx={{ color: '#3b82f6' }} />
                        ) : (
                          <SchoolIcon sx={{ color: '#a855f7' }} />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }} color="text.primary">
                          {act.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {act.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}