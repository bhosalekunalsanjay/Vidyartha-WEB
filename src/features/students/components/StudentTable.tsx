import { useState, type MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'

export interface Student {
  id: string
  firstName: string
  lastName: string
  class: string
  fees: 'Paid' | 'Pending'
  attendance: 'Present' | 'Absent'
}

interface StudentTableProps {
  students: Student[]
  onAddTrigger: () => void
  onDeleteTrigger: (student: Student) => void
}

export default function StudentTable({ students, onAddTrigger, onDeleteTrigger }: StudentTableProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>, student: Student) => {
    setAnchorEl(e.currentTarget)
    setSelectedStudent(student)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    if (selectedStudent) {
      onDeleteTrigger(selectedStudent)
    }
    handleCloseMenu()
  }

  return (
    <Card sx={{ overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)' }}>
      {/* Roster header actions */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Student Roster
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Review school fee invoices and classroom attendance tracking.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddTrigger}
          sx={{
            py: 1,
            px: 2.5,
            borderRadius: '8px',
            fontWeight: 700,
            textTransform: 'none',
            backgroundImage: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
            color: '#fff',
            '&:hover': {
              backgroundImage: 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)',
            },
          }}
        >
          Add Student
        </Button>
      </Box>

      {/* Roster table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>Fees Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>Attendance</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', width: 80 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No student records present. Click "Add Student" to create a record.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  hover
                  sx={{
                    '& td, & th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{student.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary', textAlign: 'left' }}>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', color: 'text.primary' }}>{student.class}</TableCell>
                  <TableCell sx={{ textAlign: 'left' }}>
                    <Chip
                      label={student.fees}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: student.fees === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: student.fees === 'Paid' ? '#10B981' : '#F59E0B',
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left' }}>
                    <Chip
                      label={student.attendance}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: student.attendance === 'Present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                        color: student.attendance === 'Present' ? '#10B981' : '#F43F5E',
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, student)}>
                      <MoreVertIcon fontSize="small" sx={{ color: 'text.primary' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row action actions popup menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
            },
          },
        }}
      >
        <MenuItem onClick={handleCloseMenu} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Edit Record</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#F43F5E' }}>Delete Record</MenuItem>
      </Menu>
    </Card>
  )
}
