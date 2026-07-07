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

const dummyClasses = [
  { id: '1', name: 'Class 10 - Section A', teacher: 'Ramesh Kumar', strength: 38, status: 'Active' },
  { id: '2', name: 'Class 11 - Section B', teacher: 'Sarah Dsouza', strength: 42, status: 'Active' },
  { id: '3', name: 'Class 12 - Section A', teacher: 'Amit Patel', strength: 35, status: 'Active' },
  { id: '4', name: 'Class 9 - Section C', teacher: 'Priya Sharma', strength: 40, status: 'Inactive' },
]

export default function SchoolPage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        School Directory
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage classrooms, branches, and class representative profiles.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Total Classrooms
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              18
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Assigned Teachers
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              24
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Global Strength
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              680 Students
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Classroom Assignments
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>Class Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Class Teacher</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Students</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyClasses.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>{row.strength}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Active' ? 'success' : 'default'}
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
