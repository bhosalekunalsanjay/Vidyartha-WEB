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

const dummyTransactions = [
  { id: '1', item: 'Quarterly Tuition Fees - Class 10', amount: '₹12,500', type: 'Credit', date: 'Jul 04, 2026', status: 'Paid' },
  { id: '2', item: 'Laboratory Equipment Replacements', amount: '₹4,800', type: 'Debit', date: 'Jul 02, 2026', status: 'Paid' },
  { id: '3', item: 'Software Subscription Renewal', amount: '₹15,000', type: 'Debit', date: 'Jun 28, 2026', status: 'Paid' },
  { id: '4', item: 'Quarterly Tuition Fees - Class 11', amount: '₹14,000', type: 'Credit', date: 'Jun 25, 2026', status: 'Pending' },
]

export default function FinancePage() {
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Financial Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Overview of educational tuition collection, software expenditures, and pending invoices.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, borderLeft: '5px solid #10b981' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Fees Collected (Q2)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: 'success.main' }}>
              ₹2,48,500
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, borderLeft: '5px solid #ef4444' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Active Expenditures
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: 'error.main' }}>
              ₹19,800
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ p: 3, borderLeft: '5px solid #f59e0b' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Outstanding Invoices
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: 'warning.main' }}>
              ₹42,000
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recent Transactions
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>Particulars / Item</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyTransactions.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.item}</TableCell>
                  <TableCell sx={{ color: row.type === 'Credit' ? 'success.main' : 'error.main', fontWeight: 700 }}>
                    {row.type === 'Credit' ? `+ ${row.amount}` : `- ${row.amount}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.type}
                      size="small"
                      color={row.type === 'Credit' ? 'success' : 'error'}
                      variant="outlined"
                      sx={{ borderRadius: '8px' }}
                    />
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={row.status === 'Paid' ? 'success' : 'warning'}
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
