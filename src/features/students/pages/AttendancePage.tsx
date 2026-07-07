import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

const mockAttendance = [
  { id: 'STU-101', name: 'Julian Vance', class: 'Class 10-A', rate: '98%', status: 'Present' },
  { id: 'STU-102', name: 'Rebecca Miller', class: 'Class 11-B', rate: '94%', status: 'Present' },
  { id: 'STU-103', name: 'Thomas Albern', class: 'Class 10-B', rate: '82%', status: 'Absent' },
  { id: 'STU-104', name: 'Alisha Brown', class: 'Class 12-A', rate: '96%', status: 'Present' },
]

export default function AttendancePage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Attendance Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Present Today
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#10B981' }}>
              3 Learners
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Absent Today
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#F43F5E' }}>
              1 Learner
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Average Attendance (July)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              92.5%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Roster Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Daily Attendance Status
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Classroom</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Monthly Avg</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Today Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAttendance.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.85rem' }}>
                      {row.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left' }}>{row.class}</TableCell>
                  <TableCell sx={{ textAlign: 'left' }}>{row.rate}</TableCell>
                  <TableCell sx={{ textAlign: 'left' }}>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Present' ? 'success' : 'error'}
                      sx={{ borderRadius: '8px' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

    </Box>
  )
}
