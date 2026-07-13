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
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import TablePagination from '@mui/material/TablePagination'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton'
import { format } from 'date-fns'
import React from 'react'
import { usersService } from '../services/apiService'
import type { User } from '../types/user.type'
import { UserStatus } from '../enums/UserStatus'
import { UserRole } from '../enums/UserRole'
import { Gender } from '../enums/Gender'
import { notify } from '../store/notification.store'

// Icons
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ToggleOnIcon from '@mui/icons-material/ToggleOnOutlined'

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])

  // Loading States
  const [pageLoading, setPageLoading] = React.useState(true)
  const [saveLoading, setSaveLoading] = React.useState(false)

  // Drawer Form State
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  
  const [formFirstName, setFormFirstName] = React.useState('')
  const [formLastName, setFormLastName] = React.useState('')
  const [formUsername, setFormUsername] = React.useState('')
  const [formEmail, setFormEmail] = React.useState('')
  const [formPassword, setFormPassword] = React.useState('')
  const [formConfirmPassword, setFormConfirmPassword] = React.useState('')
  const [formGender, setFormGender] = React.useState<Gender>(Gender.OTHER)
  const [formRole, setFormRole] = React.useState<UserRole>(UserRole.STUDENT)
  const [formStatus, setFormStatus] = React.useState<UserStatus>(UserStatus.ACTIVE)
  const [formDOB, setFormDOB] = React.useState('')

  // Validation Error States
  const [errors, setErrors] = React.useState<Record<string, boolean>>({})

  // Real-time Username Check States
  const [usernameAvailable, setUsernameAvailable] = React.useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = React.useState(false)

  // Status Change Menu State
  const [statusAnchorEl, setStatusAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeMenuUser, setActiveMenuUser] = React.useState<User | null>(null)

  // Pagination State (Client-side display wrapper; queries sent to backend API parameters)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [totalCount, setTotalCount] = React.useState(0)

  // Fetch users with pagination request parameters
  const fetchUsers = async () => {
    setPageLoading(true)
    try {
      const data = await usersService.getUsers(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setUsers(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setUsers(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Catch silently or fallback to empty list if offline
      setUsers([])
      setTotalCount(0)
    } finally {
      setPageLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage])

  // Debounced real-time username availability check (3 seconds / 3000ms delay)
  React.useEffect(() => {
    if (!formUsername.trim()) {
      setUsernameAvailable(null)
      setCheckingUsername(false)
      return
    }

    // In edit mode, if username is unchanged, resolve immediately as available
    if (editingUser && formUsername.trim().toLowerCase() === editingUser.username?.toLowerCase()) {
      setUsernameAvailable(true)
      setCheckingUsername(false)
      return
    }

    setCheckingUsername(true)
    setUsernameAvailable(null)

    const timer = setTimeout(async () => {
      try {
        const available = await usersService.checkUsernameAvailable(formUsername.trim())
        setUsernameAvailable(available)
      } catch {
        // Fallback: Check clash against local user array when API is offline
        const existsLocally = users.some(
          (u) =>
            (!editingUser || u.id !== editingUser.id) &&
            u.username.toLowerCase() === formUsername.trim().toLowerCase()
        )
        setUsernameAvailable(!existsLocally)
      } finally {
        setCheckingUsername(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [formUsername, editingUser])

  // Safely format date of birth values
  const formatDateOfBirth = (dob: any) => {
    try {
      const d = dob instanceof Date ? dob : new Date(dob)
      if (isNaN(d.getTime())) return 'N/A'
      return format(d, 'dd/MM/yyyy')
    } catch {
      return 'N/A'
    }
  }

  // Format date values to yyyy-MM-dd for HTML5 input field
  const formatDateForInput = (dob: any) => {
    try {
      const d = dob instanceof Date ? dob : new Date(dob)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  // Format dynamic roles display
  const formatRoleLabel = (role: UserRole) => {
    if (role === UserRole.SUPER_ADMIN) return 'Super Admin'
    if (role === UserRole.ADMIN) return 'Admin'
    if (role === UserRole.TEACHER) return 'Teacher'
    if (role === UserRole.STUDENT) return 'Student'
    if (role === UserRole.PARENT) return 'Parent'
    if (role === UserRole.FINANCE) return 'Finance'
    if (role === UserRole.NON_TEACHING_STAFF) return 'Non-Teaching Staff'
    return 'User'
  }

  // Handle opening Drawer in Add mode
  const handleOpenAddDrawer = () => {
    setEditingUser(null)
    setFormFirstName('')
    setFormLastName('')
    setFormUsername('')
    setFormEmail('')
    setFormPassword('')
    setFormConfirmPassword('')
    setFormGender(Gender.OTHER)
    setFormRole(UserRole.STUDENT)
    setFormStatus(UserStatus.ACTIVE)
    setFormDOB('')
    setErrors({})
    setUsernameAvailable(null)
    setDrawerOpen(true)
  }

  // Handle opening Drawer in Edit mode
  const handleOpenEditDrawer = (user: User) => {
    setEditingUser(user)
    setFormFirstName(user.firstName)
    setFormLastName(user.lastName || '')
    setFormUsername(user.username || '')
    setFormEmail(user.email)
    setFormPassword('')
    setFormConfirmPassword('')
    setFormGender(user.gender || Gender.OTHER)
    setFormRole(user.role)
    setFormStatus(user.status)
    setFormDOB(formatDateForInput(user.dateOfBirth))
    setErrors({})
    setUsernameAvailable(true) // Assumed valid initially
    setDrawerOpen(true)
  }

  // Handle input changes with immediate error clearance
  const handleFirstNameChange = (val: string) => {
    setFormFirstName(val)
    if (val.trim()) {
      setErrors((prev) => ({ ...prev, firstName: false }))
    }
  }

  const handleUsernameChange = (val: string) => {
    setFormUsername(val)
    if (val.trim()) {
      setErrors((prev) => ({ ...prev, username: false }))
    }
  }

  const handleEmailChange = (val: string) => {
    setFormEmail(val)
    if (val.trim()) {
      setErrors((prev) => ({ ...prev, email: false }))
    }
  }

  const handlePasswordChange = (val: string) => {
    setFormPassword(val)
    if (val.trim()) {
      setErrors((prev) => ({ ...prev, password: false }))
    }
  }

  const handleConfirmPasswordChange = (val: string) => {
    setFormConfirmPassword(val)
    if (val.trim() && val === formPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: false }))
    }
  }

  const handleDOBChange = (val: string) => {
    setFormDOB(val)
    if (val) {
      setErrors((prev) => ({ ...prev, dateOfBirth: false }))
    }
  }

  // Handle saving the user record
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()

    const isAddMode = !editingUser

    // Validate (LastName is NOT required)
    const newErrors = {
      firstName: !formFirstName.trim(),
      username: !formUsername.trim() || usernameAvailable === false,
      email: !formEmail.trim(),
      dateOfBirth: !formDOB,
      password: isAddMode ? !formPassword.trim() : false,
      confirmPassword: isAddMode ? (!formConfirmPassword.trim() || formConfirmPassword !== formPassword) : false,
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((v) => v)
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    const birthDate = new Date(formDOB)
    if (isNaN(birthDate.getTime())) {
      setErrors((prev) => ({ ...prev, dateOfBirth: true }))
      notify.warning('Please enter a valid Date of Birth.')
      return
    }

    setSaveLoading(true)

    if (editingUser) {
      // Edit User Action
      try {
        const updatedPayload = {
          firstName: formFirstName.trim(),
          lastName: formLastName.trim(),
          username: formUsername.trim(),
          email: formEmail.trim(),
          gender: formGender,
          role: formRole,
          status: formStatus,
          dateOfBirth: birthDate,
        }
        await usersService.updateUser(editingUser.id, updatedPayload)
        notify.success(`User profile for ${formFirstName} has been updated.`)
        fetchUsers()
        setDrawerOpen(false)
      } catch {
        // Local state update fallback
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  firstName: formFirstName.trim(),
                  lastName: formLastName.trim(),
                  username: formUsername.trim(),
                  email: formEmail.trim(),
                  gender: formGender,
                  role: formRole,
                  status: formStatus,
                  dateOfBirth: birthDate,
                }
              : u
          )
        )
        notify.success(`User profile updated locally.`)
        setDrawerOpen(false)
      } finally {
        setSaveLoading(false)
      }
    } else {
      // Create User Action (Post to `/api/auth/register` to save new user)
      try {
        const registrationPayload = {
          username: formUsername.trim(),
          email: formEmail.trim(),
          firstName: formFirstName.trim(),
          lastName: formLastName.trim(),
          dateOfBirth: formDOB, // C# DateOnly expected format yyyy-MM-dd
          role: formRole,
          password: formPassword,
          confirmPassword: formConfirmPassword,
        }
        await usersService.createUser(registrationPayload)
        
        notify.success(`User account for ${formFirstName} registered successfully.`)
        fetchUsers()
        setDrawerOpen(false)
      } catch {
      } finally {
        setSaveLoading(false)
      }
    }
  }

  // Handle status context menu trigger
  const handleOpenStatusMenu = (e: React.MouseEvent<HTMLElement>, user: User) => {
    setStatusAnchorEl(e.currentTarget)
    setActiveMenuUser(user)
  }

  const handleCloseStatusMenu = () => {
    setStatusAnchorEl(null)
    setActiveMenuUser(null)
  }

  // Handle changing user status from context menu
  const handleSelectStatus = async (newStatus: UserStatus) => {
    if (!activeMenuUser) return
    setSaveLoading(true)
    try {
      await usersService.updateUserStatus(activeMenuUser.id, newStatus)
      notify.success(`Status for ${activeMenuUser.firstName} changed to ${newStatus}.`)
      fetchUsers()
    } catch {
      setUsers((prev) =>
        prev.map((u) => (u.id === activeMenuUser.id ? { ...u, status: newStatus } : u))
      )
      notify.success(`Status updated locally (Backend API offline).`)
    } finally {
      setSaveLoading(false)
      handleCloseStatusMenu()
    }
  }

  // Pagination event handlers
  const handleChangePage = (_e: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  // Sliced user list for client-side rendering display fallback
  const displayedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
      {/* Full screen Backdrop Loader for Saving operations */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={saveLoading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            Saving user account...
          </Typography>
        </Box>
      </Backdrop>

      {/* Top Header Flex with Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Administer logins, student identities, and staff system privileges.
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
          Add User
        </Button>
      </Box>

      {/* Metrics Cards (Keep static dummy metrics) */}
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

      {/* Roster Card wrapper */}
      <Card sx={{ overflow: 'hidden' }}>
        {/* Tab Filter Chips (Keep static chips) */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <Chip label="All Users" color="primary" variant="filled" sx={{ borderRadius: '8px' }} />
          <Chip label="Staff" variant="outlined" sx={{ borderRadius: '8px' }} />
          <Chip label="Students" variant="outlined" sx={{ borderRadius: '8px' }} />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {/* Fixed column Actions header */}
                <TableCell
                  sx={{
                    fontWeight: 700,
                    position: 'sticky',
                    left: 0,
                    bgcolor: 'action.hover',
                    zIndex: 3,
                    boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                    width: 100,
                    minWidth: 100,
                  }}
                >
                  Actions
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageLoading ? (
                // Skeleton loading state
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                        width: 100,
                        minWidth: 100,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Skeleton variant="circular" width={28} height={28} />
                        <Skeleton variant="circular" width={28} height={28} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={160} /></TableCell>
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : displayedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No user accounts present. Click "Add User" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedUsers.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    {/* Sticky left Actions body cell */}
                    <TableCell
                      sx={{
                        position: 'sticky',
                        left: 0,
                        bgcolor: 'background.paper',
                        zIndex: 2,
                        boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                        width: 100,
                        minWidth: 100,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit User">
                          <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                            <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Status">
                          <IconButton size="small" onClick={(e) => handleOpenStatusMenu(e, row)}>
                            <ToggleOnIcon fontSize="small" sx={{ color: 'success.main' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.firstName}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.lastName || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.username || row.email.split('@')[0]}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.gender}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDateOfBirth(row.dateOfBirth)}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{formatRoleLabel(row.role)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={
                          row.status === UserStatus.ACTIVE
                            ? 'success'
                            : row.status === UserStatus.SUSPENDED
                            ? 'error'
                            : row.status === UserStatus.INACTIVE
                            ? 'warning'
                            : 'default'
                        }
                        sx={{ borderRadius: '8px', fontWeight: 700 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* MUI Table Roster Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Card>

      {/* Slide-out Sidebar Drawer Form (Add/Edit Form) */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: 1200,
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ overflowY: 'auto', pr: 1 }}>
          {/* Drawer Top Header Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'left' }}>
              {editingUser ? 'Edit User Profile' : 'Add New User'}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSaveUser}>
            {/* First Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                First Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Sarah"
                value={formFirstName}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName ? 'First name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Last Name (NOT required) */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Jenkins"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Username with real-time 3-second debounce check */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Username *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. sarah.jenkins"
                value={formUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                error={!!errors.username || usernameAvailable === false}
                helperText={
                  errors.username
                    ? 'Username is required.'
                    : checkingUsername
                    ? 'Checking availability...'
                    : usernameAvailable === true
                    ? 'Username is available!'
                    : usernameAvailable === false
                    ? 'Username is already taken.'
                    : ''
                }
                slotProps={{
                  formHelperText: {
                    sx: {
                      color:
                        usernameAvailable === true
                          ? 'success.main'
                          : errors.username || usernameAvailable === false
                          ? 'error.main'
                          : 'text.secondary',
                      fontWeight: 600,
                    },
                  },
                }}
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
                value={formEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                error={!!errors.email}
                helperText={errors.email ? 'Email address is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Password inputs - rendered in Add mode only */}
            {!editingUser && (
              <>
                {/* Password */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                    Password *
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Min 8 characters"
                    value={formPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password ? 'Password is required.' : ''}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
                {/* Confirm Password */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                    Confirm Password *
                  </Typography>
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Re-enter password"
                    value={formConfirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={
                      errors.confirmPassword
                        ? formConfirmPassword !== formPassword
                          ? 'Passwords do not match.'
                          : 'Confirm password is required.'
                        : ''
                    }
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
              </>
            )}

            {/* Gender Selection */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Gender
              </Typography>
              <Select
                fullWidth
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as Gender)}
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
                value={formDOB}
                onChange={(e) => handleDOBChange(e.target.value)}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth ? 'Date of birth is required.' : ''}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* System Role */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Role
              </Typography>
              <Select
                fullWidth
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value={UserRole.SUPER_ADMIN}>Super Admin</MenuItem>
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRole.TEACHER}>Teacher</MenuItem>
                <MenuItem value={UserRole.STUDENT}>Student</MenuItem>
                <MenuItem value={UserRole.PARENT}>Parent</MenuItem>
                <MenuItem value={UserRole.FINANCE}>Finance</MenuItem>
                <MenuItem value={UserRole.NON_TEACHING_STAFF}>Non-Teaching Staff</MenuItem>
              </Select>
            </Box>

            {/* Account Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Status
              </Typography>
              <Select
                fullWidth
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value={UserStatus.ACTIVE}>Active</MenuItem>
                <MenuItem value={UserStatus.INACTIVE}>Inactive</MenuItem>
                <MenuItem value={UserStatus.SUSPENDED}>Suspended</MenuItem>
              </Select>
            </Box>
          </form>
        </Box>

        {/* Drawer Buttons Actions */}
        <Box sx={{ display: 'flex', gap: 2, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
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
            onClick={handleSaveUser}
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
            Save User
          </Button>
        </Box>
      </Drawer>

      {/* Change Status Popover Menu (Hides current status from user options) */}
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl)}
        onClose={handleCloseStatusMenu}
        slotProps={{
          paper: {
            sx: {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        {activeMenuUser?.status !== UserStatus.ACTIVE && (
          <MenuItem onClick={() => handleSelectStatus(UserStatus.ACTIVE)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Active
          </MenuItem>
        )}
        {activeMenuUser?.status !== UserStatus.INACTIVE && (
          <MenuItem onClick={() => handleSelectStatus(UserStatus.INACTIVE)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Inactive
          </MenuItem>
        )}
        {activeMenuUser?.status !== UserStatus.SUSPENDED && (
          <MenuItem onClick={() => handleSelectStatus(UserStatus.SUSPENDED)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Suspended
          </MenuItem>
        )}
      </Menu>

    </Box>
  )
}
