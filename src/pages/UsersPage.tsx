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

const dummyUsers = [
  { id: '1', name: 'Kunalsanjay Bhosale', username: 'kunal_bhosale', role: 'Administrator', status: 'Online' },
  { id: '2', name: 'Aparna Sen', username: 'aparna_sen', role: 'Teacher', status: 'Online' },
  { id: '3', name: 'Rohan Mehta', username: 'rohan_m', role: 'Student', status: 'Offline' },
  { id: '4', name: 'Vikram Rao', username: 'vikram_rao', role: 'Teacher', status: 'Online' },
]

export default function UsersPage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Administer logins, student identities, and staff system privileges.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Administrators
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              3
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Teachers
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              24
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Active Students
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              653
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Suspended Accounts
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              0
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <Chip label="All Users" color="primary" variant="filled" sx={{ borderRadius: '8px' }} />
          <Chip label="Staff" variant="outlined" sx={{ borderRadius: '8px' }} />
          <Chip label="Students" variant="outlined" sx={{ borderRadius: '8px' }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>Profile</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyUsers.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.85rem' }}>
                      {row.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>@{row.username}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Online' ? 'success' : 'default'}
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
