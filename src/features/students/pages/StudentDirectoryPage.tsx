import { useState, useEffect, type FormEvent } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import TablePagination from '@mui/material/TablePagination'
import { format } from 'date-fns'

// Icons & Services
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { studentsService } from '../../../services/studentService'
import type { Student } from '../../../interfaces/student.type'
import { Gender } from '../../../enums/Gender'
import { notify } from '../../../store/notification.store'

const MOCK_STUDENTS: Student[] = [
  {
    id: 'STU-101',
    firstName: 'Julian',
    lastName: 'Vance',
    classId: 'Class 10-A',
    feesStatus: 'Paid',
    attendanceStatus: 'Present',
    gender: Gender.MALE,
    dateOfBirth: new Date('2010-04-12'),
    email: 'julian.vance@vidyartha.edu',
  },
  {
    id: 'STU-102',
    firstName: 'Rebecca',
    lastName: 'Miller',
    classId: 'Class 11-B',
    feesStatus: 'Pending',
    attendanceStatus: 'Present',
    gender: Gender.FEMALE,
    dateOfBirth: new Date('2009-08-30'),
    email: 'rebecca.miller@vidyartha.edu',
  },
  {
    id: 'STU-103',
    firstName: 'Thomas',
    lastName: 'Albern',
    classId: 'Class 10-B',
    feesStatus: 'Paid',
    attendanceStatus: 'Absent',
    gender: Gender.MALE,
    dateOfBirth: new Date('2010-02-15'),
    email: 'thomas.albern@vidyartha.edu',
  },
]

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<Gender>(Gender.OTHER)
  const [dob, setDob] = useState('')
  const [classId, setClassId] = useState('Class 10-A')
  const [feesStatus, setFeesStatus] = useState<'Paid' | 'Pending'>('Paid')
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent'>('Present')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchStudents = async () => {
    setPageLoading(true)
    try {
      const data = await studentsService.getStudents(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setStudents(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setStudents(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setStudents(MOCK_STUDENTS)
      setTotalCount(MOCK_STUDENTS.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [page, rowsPerPage])

  // Format Date for UI and Form Fields
  const formatDateForUI = (dateVal: any) => {
    try {
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
      if (isNaN(d.getTime())) return 'N/A'
      return format(d, 'dd/MM/yyyy')
    } catch {
      return 'N/A'
    }
  }

  const formatDateForInput = (dateVal: any) => {
    try {
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  // Opening drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingStudent(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setGender(Gender.OTHER)
    setDob('')
    setClassId('Class 10-A')
    setFeesStatus('Paid')
    setAttendanceStatus('Present')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (student: Student) => {
    setEditingStudent(student)
    setFirstName(student.firstName)
    setLastName(student.lastName || '')
    setEmail(student.email)
    setGender(student.gender || Gender.OTHER)
    setDob(formatDateForInput(student.dateOfBirth))
    setClassId(student.classId)
    setFeesStatus(student.feesStatus)
    setAttendanceStatus(student.attendanceStatus)
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    if (field === 'firstName') {
      setFirstName(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, firstName: false }))
    } else if (field === 'email') {
      setEmail(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, email: false }))
    } else if (field === 'dob') {
      setDob(val)
      if (val) setErrors((prev) => ({ ...prev, dob: false }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveStudent = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors = {
      firstName: !firstName.trim(),
      email: !email.trim(),
      dob: !dob,
    }

    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((v) => v)
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    const birthDate = new Date(dob)
    if (isNaN(birthDate.getTime())) {
      setErrors((prev) => ({ ...prev, dob: true }))
      notify.warning('Please enter a valid Date of Birth.')
      return
    }

    setSaveLoading(true)

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      gender,
      dateOfBirth: birthDate,
      classId,
      feesStatus,
      attendanceStatus,
    }

    try {
      if (editingStudent) {
        await studentsService.updateStudent(editingStudent.id, payload)
        notify.success(`Student profile for ${firstName} has been updated.`)
      } else {
        await studentsService.createStudent(payload)
        notify.success(`Student profile for ${firstName} has been created.`)
      }
      fetchStudents()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingStudent) {
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? { ...s, ...payload, id: s.id } : s))
        )
        notify.success(`Student profile updated locally.`)
      } else {
        const mockId = `STU-${Math.floor(100 + Math.random() * 900)}`
        setStudents((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Student registered locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedStudents = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Full-Screen Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={saveLoading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            Saving student profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Students
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage student registrations, demographic values, and class allocations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDrawer}
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

      {/* Table Wrapper Card */}
      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {/* Fixed column Action header */}
                <TableCell
                  sx={{
                    fontWeight: 700,
                    position: 'sticky',
                    left: 0,
                    bgcolor: 'action.hover',
                    zIndex: 3,
                    boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                    width: 90,
                    minWidth: 90,
                  }}
                >
                  Action
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Fees</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageLoading ? (
                // Skeletons during fetch loading
                Array.from(new Array(rowsPerPage)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                        width: 90,
                        minWidth: 90,
                      }}
                    >
                      <Skeleton variant="circular" width={28} height={28} />
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : displayedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No student records found. Click "Add Student" to create a new profile.
                  </TableCell>
                </TableRow>
              ) : (
                displayedStudents.map((row) => (
                  <TableRow key={row.id} hover sx={{ '& td, & th': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                    {/* Fixed Actions Cell */}
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                        width: 90,
                        minWidth: 90,
                      }}
                    >
                      <Tooltip title="Edit Student">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.firstName} {row.lastName || ''}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.classId}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.gender}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDateForUI(row.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.feesStatus}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.feesStatus === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: row.feesStatus === 'Paid' ? '#10B981' : '#F59E0B',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.attendanceStatus}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.attendanceStatus === 'Present' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          color: row.attendanceStatus === 'Present' ? '#10B981' : '#F43F5E',
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Roster Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Card>

      {/* Slide-out Sidebar Drawer Form (Add/Edit Student Form) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: 1200,
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {/* Fixed Header Row */}
        <Box
          sx={{
            p: 3.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.paper',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'left' }}>
            {editingStudent ? 'Edit Student Profile' : 'Add New Student'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveStudent}>
            
            {/* First Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                First Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Julian"
                value={firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName ? 'First name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Last Name (Optional) */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="e.g. julian.vance@vidyartha.edu"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? 'Email address is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Gender */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Gender *
              </Typography>
              <Select
                fullWidth
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value={Gender.MALE}>Male</MenuItem>
                <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                <MenuItem value={Gender.OTHER}>Other</MenuItem>
              </Select>
            </Box>

            {/* Date of Birth */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Date of Birth *
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={dob}
                onChange={(e) => handleFieldChange('dob', e.target.value)}
                error={!!errors.dob}
                helperText={errors.dob ? 'Date of birth is required.' : ''}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Class Assignment */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Class Assignment *
              </Typography>
              <Select
                fullWidth
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Class 10-A">Class 10-A</MenuItem>
                <MenuItem value="Class 10-B">Class 10-B</MenuItem>
                <MenuItem value="Class 11-A">Class 11-A</MenuItem>
                <MenuItem value="Class 11-B">Class 11-B</MenuItem>
              </Select>
            </Box>

            {/* Fees Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Fees Status *
              </Typography>
              <Select
                fullWidth
                value={feesStatus}
                onChange={(e) => setFeesStatus(e.target.value as 'Paid' | 'Pending')}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </Box>

            {/* Attendance Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Attendance Status *
              </Typography>
              <Select
                fullWidth
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value as 'Present' | 'Absent')}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </Box>
          </form>
        </Box>

        {/* Fixed Footer Actions */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 3.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setDrawerOpen(false)}
            sx={{
              py: 1.25,
              borderRadius: '8px',
              fontWeight: 700,
              textTransform: 'none',
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveStudent}
            sx={{
              py: 1.25,
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
            Save Student
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
