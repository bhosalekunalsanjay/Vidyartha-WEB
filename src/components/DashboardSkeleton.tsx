import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'

export default function DashboardSkeleton() {
  return (
    <Box sx={{ py: 2 }}>
      {/* Header section with greetings and action button placeholders */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Skeleton variant="text" width={240} height={40} sx={{ mb: 1, borderRadius: '6px' }} />
          <Skeleton variant="text" width={180} height={20} sx={{ borderRadius: '4px' }} />
        </Box>
        <Skeleton variant="rectangular" width={140} height={42} sx={{ borderRadius: '50px' }} />
      </Box>

      {/* Grid of Metric Cards (e.g. 4 metrics) */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, borderRadius: 6, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1, borderRadius: '4px' }} />
                    <Skeleton variant="text" width="80%" height={32} sx={{ borderRadius: '4px' }} />
                  </Box>
                  <Skeleton variant="circular" width={40} height={40} />
                </Box>
                <Skeleton variant="text" width="50%" height={18} sx={{ borderRadius: '4px' }} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Content layout (e.g., visual chart card and sidebar list cards) */}
      <Grid container spacing={3}>
        {/* Visual Chart Card Placeholder */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid', borderColor: 'divider', minHeight: 340 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
              <Skeleton variant="text" width="30%" height={28} sx={{ borderRadius: '4px' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rectangular" width={60} height={30} sx={{ borderRadius: '8px' }} />
                <Skeleton variant="rectangular" width={60} height={30} sx={{ borderRadius: '8px' }} />
              </Box>
            </Box>
            {/* Visual simulation of chart lines/bars */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 2, pt: 2 }}>
              {[60, 80, 45, 90, 30, 75, 50, 85, 95, 60, 40, 70].map((height, idx) => (
                <Skeleton
                  key={idx}
                  variant="rectangular"
                  width="100%"
                  height={`${height}%`}
                  sx={{ borderRadius: '8px 8px 0 0' }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar list placeholder */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 6, border: '1px solid', borderColor: 'divider', minHeight: 340 }}>
            <Skeleton variant="text" width="50%" height={28} sx={{ mb: 3, borderRadius: '4px' }} />
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Skeleton variant="circular" width={44} height={44} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5, borderRadius: '4px' }} />
                  <Skeleton variant="text" width="40%" height={16} sx={{ borderRadius: '4px' }} />
                </Box>
                <Skeleton variant="text" width={40} height={20} sx={{ borderRadius: '4px' }} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
