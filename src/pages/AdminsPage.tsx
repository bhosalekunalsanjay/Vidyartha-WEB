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
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import { format } from 'date-fns'

// Icons & Services
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'

import { adminsService, type AdminItem } from '../services/adminService'
import { schoolsService } from '../services/schoolService'
import type { SchoolItem } from '../interfaces/school.type'
import { useAuth } from '../context/AuthContext'
import { checkUserRole } from '../utils/roleCheck'
import { UserStatus } from '../enums/UserStatus'
import { notify } from '../store/notification.store'
import { UserStatusOptions } from '../options/UserStatus'

export default function AdminsPage() {
  const { user } = useAuth()
  const isSuperAdmin = checkUserRole.isSuperAdmin(user?.role)

  const [admins, setAdmins] = useState<AdminItem[]>([])
  const [pageLoading, setPageLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // School drop-down states for Super Admin context
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
  const [schoolsLoading, setSchoolsLoading] = useState(false)

  // Search Filter State
  const [searchTerm, setSearchTerm] = useState('')

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminItem | null>(null)

  // Form Fields
  const [formSchoolId, setFormSchoolId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<UserStatus>(UserStatus.ACTIVE)
  const [email, setEmail] = useState('')
  

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch all schools for selection
  const fetchSchools = async () => {
    try {
      setSchoolsLoading(true)
      const data = await schoolsService.getSchools(1, 100)
      if (data) {
        if (Array.isArray(data)) {
          setSchools(data)
        } else if (data.items) {
          setSchools(data.items)
        }
      }
    } catch (err) {
      console.error('Failed to load schools:', err)
      notify.error('Failed to load schools for selection.')
    } finally {
      setSchoolsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchAdmins = async () => {
    // SuperAdmin must select a school before querying
    if (!selectedSchoolId) {
      setAdmins([])
      setTotalCount(0)
      return
    }

    setPageLoading(true)
    try {
      const data = await adminsService.getAdmins(
        page + 1,
        rowsPerPage,
        searchTerm.trim() || undefined
      )
      if (data) {
        if (data.items) {
          setAdmins(data.items)
          setTotalCount(data.totalCount || 0)
        } else if (Array.isArray(data)) {
          setAdmins(data)
          setTotalCount(data.length)
        } else {
          setAdmins([])
          setTotalCount(0)
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch admins:', err)
      notify.error('Failed to load school administrators.')
      setAdmins([])
      setTotalCount(0)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [page, rowsPerPage, selectedSchoolId, searchTerm])

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId)
    if (schoolId) {
      localStorage.setItem('selectedSchoolId', schoolId)
    } else {
      localStorage.removeItem('selectedSchoolId')
    }
    setPage(0)
  }

  // Format Dates for UI / Forms
  const formatDateForUI = (dateVal: any) => {
    try {
      if (!dateVal) return 'N/A'
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
      if (isNaN(d.getTime())) return 'N/A'
      return format(d, 'dd/MM/yyyy')
    } catch {
      return 'N/A'
    }
  }

  const formatDateForInput = (dateVal: any) => {
    try {
      if (!dateVal) return ''
      const d = dateVal instanceof Date ? dateVal : new Date(dateVal)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingAdmin(null)
    setFormSchoolId(selectedSchoolId) // Default to currently selected school context
    setFirstName('')
    setLastName('')
    setDateOfBirth('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setStatus(UserStatus.ACTIVE)
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (adm: AdminItem) => {
    setEditingAdmin(adm)
    setFormSchoolId(adm.schoolId)
    setFirstName(adm.firstName)
    setLastName(adm.lastName || '')
    setDateOfBirth(formatDateForInput(adm.dateOfBirth))
    setUsername(adm.username)
    setEmail(adm.email)
    setPassword('')
    setConfirmPassword('')
    setStatus(adm.status)
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }))
    if (field === 'firstName') setFirstName(val)
    else if (field === 'lastName') setLastName(val)
    else if (field === 'username') setUsername(val)
    else if (field === 'password') setPassword(val)
    else if (field === 'confirmPassword') setConfirmPassword(val)
    else if (field === 'email') setEmail(val)
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveAdmin = async (e: FormEvent) => {
    e.preventDefault()

    const tempErrors: Record<string, string> = {}
    if (!formSchoolId) tempErrors.schoolId = 'School is required.'
    if (!firstName.trim()) tempErrors.firstName = 'First name is required.'
    if (!username.trim()) tempErrors.username = 'Username is required.'
    else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      tempErrors.username = 'Username can only contain alphanumeric characters, underscores, hyphens, or periods.'
    }

    const isNew = !editingAdmin

    // Password validation logic
    if (isNew) {
      if (!password) {
        tempErrors.password = 'Password is required.'
      } else {
        if (password.length < 8) {
          tempErrors.password = 'Password must be at least 8 characters.'
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
          tempErrors.password = 'Password must contain uppercase, lowercase, number, and special character.'
        }
      }

      if (!confirmPassword) {
        tempErrors.confirmPassword = 'Confirm password is required.'
      } else if (confirmPassword !== password) {
        tempErrors.confirmPassword = 'Passwords do not match.'
      }
    } else {
      // If editing and password was entered, validate it
      if (password) {
        if (password.length < 8) {
          tempErrors.password = 'Password must be at least 8 characters.'
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
          tempErrors.password = 'Password must contain uppercase, lowercase, number, and special character.'
        }

        if (!confirmPassword) {
          tempErrors.confirmPassword = 'Confirm password is required.'
        } else if (confirmPassword !== password) {
          tempErrors.confirmPassword = 'Passwords do not match.'
        }
      }
    }

    setErrors(tempErrors)
    const hasErrors = Object.keys(tempErrors).length > 0
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    setSaveLoading(true)

    const payload = {
      schoolId: formSchoolId,
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth)?.toISOString().split("T")[0] : null,
      username: username.trim(),
      email: email.trim(),
      password: password || undefined,
      confirmPassword: confirmPassword || undefined,
      status,
    }

    try {
      if (editingAdmin) {
        await adminsService.updateAdmin(editingAdmin.id, payload)
        notify.success(`School Administrator ${username} updated successfully.`)
      } else {
        await adminsService.createAdmin(payload)
        notify.success(`School Administrator ${username} created successfully.`)
      }
      fetchAdmins()
      setDrawerOpen(false)
    } catch (err: any) {
      console.error('Failed to save administrator:', err)
      const msg = err.response?.data?.message || 'Failed to save administrator profile.'
      notify.error(msg)
    } finally {
      setSaveLoading(false)
    }
  }

  // Lookup school name by ID
  const getSchoolName = (schoolId: string) => {
    const school = schools.find((s) => s.id === schoolId)
    return school ? school.name : 'Unknown School'
  }

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
            Saving administrator profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            School Administrators
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create and manage administrative staff associated with each school.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSuperAdmin && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 220 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, color: 'text.secondary' }}>
                Filter by School *
              </Typography>
              <Select
                value={selectedSchoolId}
                onChange={(e) => handleSchoolChange(e.target.value)}
                displayEmpty
                size="small"
                fullWidth
                disabled={schoolsLoading}
                sx={{ borderRadius: '8px', bgcolor: 'background.paper', textAlign: 'left' }}
              >
                <MenuItem value="" disabled>
                  <em>{schoolsLoading ? 'Loading schools...' : 'Select a School'}</em>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDrawer}
            disabled={!selectedSchoolId}
            sx={{
              py: 1,
              px: 2.5,
              borderRadius: '8px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundImage: !selectedSchoolId 
                ? 'none' 
                : 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              color: '#fff',
              '&:hover': {
                backgroundImage: !selectedSchoolId 
                  ? 'none' 
                  : 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)',
              },
            }}
          >
            Add Admin
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Box */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
        <TextField
          size="small"
          placeholder="Search admins by name, username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 350, bgcolor: 'background.paper', borderRadius: '8px' }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }
          }}
        />
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
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Associated School</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
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
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="text" width={150} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : !selectedSchoolId ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 600 }}>
                    Please select a school to load and manage administrators.
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No administrators found for this school. Click "Add Admin" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((row) => (
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
                      <Tooltip title="Edit Administrator">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.username}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {row.firstName} {row.lastName || ''}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {getSchoolName(row.schoolId)}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDateForUI(row.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status === UserStatus.ACTIVE ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.status === UserStatus.ACTIVE ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          color: row.status === UserStatus.ACTIVE ? '#10B981' : '#F43F5E',
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit Admin Form) */}
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
            {editingAdmin ? 'Edit Administrator Profile' : 'Add New Administrator'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveAdmin}>
            
            {/* School Association Selector */}
            <FormControl fullWidth sx={{ mb: 2.5 }} error={!!errors.schoolId}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Associate School *
              </Typography>
              <Select
                value={formSchoolId}
                onChange={(e) => {
                  setFormSchoolId(e.target.value)
                  setErrors((prev) => ({ ...prev, schoolId: '' }))
                }}
                displayEmpty
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="" disabled>
                  <em>Select School</em>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.schoolId && <FormHelperText>{errors.schoolId}</FormHelperText>}
            </FormControl>

            {/* Username */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Username *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. jdoe_admin"
                value={username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                error={!!errors.username}
                helperText={errors.username || ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* First Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                First Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName || ''}
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
                placeholder="e.g. Doe"
                value={lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName || ''}
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
                placeholder="e.g. sarah.j@vidyartha.edu"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? 'Email address is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Date of Birth */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Date of Birth
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Password {editingAdmin ? '(Leave blank to retain current)' : '*'}
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                error={!!errors.password}
                helperText={errors.password || ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Confirm Password {editingAdmin ? '(Leave blank to retain current)' : '*'}
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword || ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Status Option dropdown from constants file */}
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Status *
              </Typography>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                {UserStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={handleSaveAdmin}
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
            Save Administrator
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
