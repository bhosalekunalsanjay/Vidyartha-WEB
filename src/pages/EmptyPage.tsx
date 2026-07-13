import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface EmptyPageProps {
  title?: string
}

export default function EmptyPage({ title = 'Feature Coming Soon' }: EmptyPageProps) {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out', display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Card sx={{ p: 5, textAlign: 'center', maxWidth: 450, borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This module is scheduled for development in a future phase. All navigation wiring and route constraints are fully set up.
        </Typography>
      </Card>
    </Box>
  )
}
