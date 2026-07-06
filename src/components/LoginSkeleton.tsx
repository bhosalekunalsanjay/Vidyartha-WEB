import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

export default function LoginSkeleton() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 13, 22, 0.2) 90.1%)'
            : 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, rgba(248, 250, 252, 0.2) 90.1%)',
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          p: 4,
          borderRadius: 6,
          backdropFilter: 'blur(20px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        }}
      >
        {/* Logo / Badge placeholder */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={56} height={56} />
        </Box>

        {/* Title and Subtitle placeholders */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1, borderRadius: '4px' }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ borderRadius: '4px' }} />
        </Box>

        {/* Form Inputs placeholders */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2.5, borderRadius: '16px' }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 1, borderRadius: '16px' }} />
        </Box>

        {/* Remember me & Forgot password placeholders */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Skeleton variant="rectangular" width={110} height={20} sx={{ borderRadius: '4px' }} />
          <Skeleton variant="rectangular" width={120} height={20} sx={{ borderRadius: '4px' }} />
        </Box>

        {/* Button placeholder */}
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: '50px' }} />
      </Card>
    </Box>
  )
}
