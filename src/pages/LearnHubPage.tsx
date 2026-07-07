import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'

const dummyCourses = [
  { id: '1', title: 'React UI Architecture', category: 'Technology', students: 48, progress: 85, level: 'Advanced' },
  { id: '2', title: 'Calculus & Algebra II', category: 'Mathematics', students: 62, progress: 40, level: 'Intermediate' },
  { id: '3', title: 'Inorganic & Organic Chemistry', category: 'Science', students: 55, progress: 68, level: 'Advanced' },
  { id: '4', title: 'Introductory Microeconomics', category: 'Economics', students: 35, progress: 95, level: 'Beginner' },
]

export default function LearnHubPage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Learn Hub
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Access course curriculums, review student study tracks, and monitor completion rates.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Published Courses
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              12
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Average Progress
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              72%
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Course Handouts
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              142 PDF Guides
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Active Course Tracks
      </Typography>
      <Grid container spacing={3}>
        {dummyCourses.map((course) => (
          <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip label={course.category} size="small" color="primary" sx={{ borderRadius: '8px' }} />
                  <Chip label={course.level} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Active Learners: {course.students} students registered
                </Typography>

                <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Class Progress
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {course.progress}% Completed
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={course.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#22293f' : '#e2e8f0',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
