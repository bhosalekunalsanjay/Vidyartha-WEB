import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'

// Icons
import SchoolIcon from '@mui/icons-material/SchoolOutlined'
import PeopleIcon from '@mui/icons-material/PeopleOutlined'
import AssessmentIcon from '@mui/icons-material/AssessmentOutlined'

export default function DashboardPage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Dynamic welcome banner */}
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B', mb: 1, letterSpacing: '-0.02em' }}>
          Welcome back, Sarah
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here is a quick overview of Vidyartha's activities and performance metrics today.
        </Typography>
      </Box>

      {/* Overview Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(2, 132, 199, 0.08)', width: 48, height: 48 }}>
              <PeopleIcon sx={{ color: '#0284C7' }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total Active Students
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
                1,248 Learners
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(13, 148, 136, 0.08)', width: 48, height: 48 }}>
              <SchoolIcon sx={{ color: '#0D9488' }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                School Grade Level
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
                High School (9-12)
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.08)', width: 48, height: 48 }}>
              <AssessmentIcon sx={{ color: '#F59E0B' }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Overall Attendance
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mt: 0.5 }}>
                94.2% Average
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Main dashboard widgets */}
      <Grid container spacing={3}>
        
        {/* Left widget: Recent Registrations list */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', mb: 2, textAlign: 'left' }}>
              Recent Student Enrollments
            </Typography>
            <List>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#0284C7', color: '#fff', fontWeight: 600 }}>SC</Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ textAlign: 'left' }}
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>Sarah Connor</Typography>}
                  secondary="Class 10-A • Registered 2 hours ago"
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ my: 1, borderColor: '#F1F5F9' }} />
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#0D9488', color: '#fff', fontWeight: 600 }}>JK</Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ textAlign: 'left' }}
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>John K.</Typography>}
                  secondary="Class 11-B • Registered 5 hours ago"
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ my: 1, borderColor: '#F1F5F9' }} />
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#8B5CF6', color: '#fff', fontWeight: 600 }}>MR</Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ textAlign: 'left' }}
                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E293B' }}>Marcus R.</Typography>}
                  secondary="Class 12-C • Registered Yesterday"
                />
              </ListItem>
            </List>
          </Card>
        </Grid>

        {/* Right widget: Academic progress lists */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B', mb: 3, textAlign: 'left' }}>
              Academic Performance Trends
            </Typography>
            
            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                  Mathematics Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284C7' }}>
                  88% Pass Rate
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={88}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9' }}
              />
            </Box>

            <Box sx={{ mb: 3, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                  Science Curriculums
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0D9488' }}>
                  94% Pass Rate
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={94}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9' }}
              />
            </Box>

            <Box sx={{ mb: 1, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>
                  Language Studies
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  76% Pass Rate
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={76}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9' }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      
    </Box>
  )
}