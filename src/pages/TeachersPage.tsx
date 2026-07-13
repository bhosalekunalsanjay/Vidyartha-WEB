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

// Icons & Services
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { teachersService } from '../services/teacherService'
import type { Teacher } from '../types/teacher.type'
import { Gender } from '../enums/Gender'
import { notify } from '../store/notification.store'

const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'TCH-201',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@vidyartha.edu',
    phone: '+1 (555) 019-2834',
    qualification: 'M.Sc. Mathematics',
    status: 'Active',
    gender: Gender.MALE,
  },
  {
    id: 'TCH-202',
    firstName: 'Clara',
    lastName: 'Oswald',
    email: 'clara.oswald@vidyartha.edu',
    phone: '+1 (555) 014-9982',
    qualification: 'Ph.D. English Literature',
    status: 'Active',
    gender: Gender.FEMALE,
  },
  {
    id: 'TCH-203',
    firstName: 'Danny',
    lastName: 'Pink',
    email: 'danny.pink@vidyartha.edu',
    phone: '+1 (555) 012-7744',
    qualification: 'B.Sc. Physics',
    status: 'Inactive',
    gender: Gender.MALE,
  },
]

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [qualification, setQualification] = useState('')
  const [gender, setGender] = useState<Gender>(Gender.OTHER)
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchTeachers = async () => {
    setPageLoading(true)
    try {
      const data = await teachersService.getTeachers(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setTeachers(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setTeachers(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setTeachers(MOCK_TEACHERS)
      setTotalCount(MOCK_TEACHERS.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [page, rowsPerPage])

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingTeacher(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhone('')
    setQualification('')
    setGender(Gender.OTHER)
    setStatus('Active')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFirstName(teacher.firstName)
    setLastName(teacher.lastName || '')
    setEmail(teacher.email)
    setPhone(teacher.phone || '')
    setQualification(teacher.qualification || '')
    setGender(teacher.gender || Gender.OTHER)
    setStatus(teacher.status)
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
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveTeacher = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors = {
      firstName: !firstName.trim(),
      email: !email.trim(),
    }

    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((v) => v)
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    setSaveLoading(true)

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      qualification: qualification.trim(),
      gender,
      status,
    }

    try {
      if (editingTeacher) {
        await teachersService.updateTeacher(editingTeacher.id, payload)
        notify.success(`Teacher profile for ${firstName} has been updated.`)
      } else {
        await teachersService.createTeacher(payload)
        notify.success(`Teacher profile for ${firstName} has been created.`)
      }
      fetchTeachers()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingTeacher) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...payload, id: t.id } : t))
        )
        notify.success(`Teacher profile updated locally.`)
      } else {
        const mockId = `TCH-${Math.floor(100 + Math.random() * 900)}`
        setTeachers((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Teacher registered locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedTeachers = teachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            Saving teacher profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Teachers
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Administer system teachers roster profiles and academic qualifications.
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
          Add Teacher
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
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Qualification</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                    <TableCell><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell><Skeleton variant="text" width={160} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : displayedTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No teacher records found. Click "Add Teacher" to create a new profile.
                  </TableCell>
                </TableRow>
              ) : (
                displayedTeachers.map((row) => (
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
                      <Tooltip title="Edit Teacher">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.firstName} {row.lastName || ''}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.phone || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.qualification || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.gender}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          color: row.status === 'Active' ? '#10B981' : '#F43F5E',
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
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Card>

      {/* Slide-out Sidebar Drawer Form (Add/Edit Teacher Form) */}
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
            {editingTeacher ? 'Edit Teacher Profile' : 'Add New Teacher'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveTeacher}>
            
            {/* First Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                First Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Alex"
                value={firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName ? 'First name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Rivera"
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
                placeholder="e.g. alex.rivera@vidyartha.edu"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? 'Email address is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Phone */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Phone Number
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. +1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Qualification */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Academic Qualification
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. M.Sc. Mathematics"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
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

            {/* Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Status *
              </Typography>
              <Select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
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
            onClick={handleSaveTeacher}
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
            Save Teacher
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
