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
import { format } from 'date-fns'
import React from 'react'
import api from '../api/api'
import type { User } from '../types/user.type'
import { UserStatus } from '../enums/UserStatus'
import { UserRole } from '../enums/UserRole'
import { notify } from '../store/notification.store'

// Icons
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import ToggleOnIcon from '@mui/icons-material/ToggleOnOutlined'
import { Gender } from '../enums/Gender'

const MOCK_USERS: User[] = [
  {
    id: 'USR-101',
    schoolId: 'school-1',
    username: 'sarah.admin',
    email: 'sarah.jenkins@vidyartha.edu',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    dateOfBirth: new Date('1985-06-15'),
    gender: 'Female',
    refreshToken: '',
    refreshTokenExpiry: new Date(),
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  },
  {
    id: 'USR-102',
    schoolId: 'school-1',
    username: 'alex.teacher',
    email: 'alex.rivera@vidyartha.edu',
    firstName: 'Alex',
    lastName: 'Rivera',
    dateOfBirth: new Date('1990-09-22'),
    gender: 'Male',
    refreshToken: '',
    refreshTokenExpiry: new Date(),
    role: UserRole.TEACHER,
    status: UserStatus.ACTIVE,
  },
  {
    id: 'USR-103',
    schoolId: 'school-1',
    username: 'julian.student',
    email: 'julian.vance@vidyartha.edu',
    firstName: 'Julian',
    lastName: 'Vance',
    dateOfBirth: new Date('2010-04-12'),
    gender: 'Male',
    refreshToken: '',
    refreshTokenExpiry: new Date(),
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
  },
  {
    id: 'USR-104',
    schoolId: 'school-1',
    username: 'clara.teacher',
    email: 'clara.oswald@vidyartha.edu',
    firstName: 'Clara',
    lastName: 'Oswald',
    dateOfBirth: new Date('1993-11-05'),
    gender: 'Female',
    refreshToken: '',
    refreshTokenExpiry: new Date(),
    role: UserRole.TEACHER,
    status: UserStatus.INACTIVE,
  },
  {
    id: 'USR-105',
    schoolId: 'school-1',
    username: 'rebecca.student',
    email: 'rebecca.miller@vidyartha.edu',
    firstName: 'Rebecca',
    lastName: 'Miller',
    dateOfBirth: new Date('2009-08-30'),
    gender: 'Female',
    refreshToken: '',
    refreshTokenExpiry: new Date(),
    role: UserRole.STUDENT,
    status: UserStatus.SUSPENDED,
  },
]

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([])

  // Drawer Form State
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [formFirstName, setFormFirstName] = React.useState('')
  const [formLastName, setFormLastName] = React.useState('')
  const [formUsername, setFormUsername] = React.useState('')
  const [formEmail, setFormEmail] = React.useState('')
  const [formGender, setFormGender] = React.useState<Gender>(Gender.OTHER)
  const [formRole, setFormRole] = React.useState<UserRole>(UserRole.STUDENT)
  const [formStatus, setFormStatus] = React.useState<UserStatus>(UserStatus.ACTIVE)
  const [formDOB, setFormDOB] = React.useState('')

  // Status Change Menu State
  const [statusAnchorEl, setStatusAnchorEl] = React.useState<null | HTMLElement>(null)
  const [activeMenuUser, setActiveMenuUser] = React.useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      if (response.data && response.data.length > 0) {
        setUsers(response.data)
      } else {
        setUsers(MOCK_USERS)
      }
    } catch {
      // Offline or local fallback
      setUsers(MOCK_USERS)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

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

  // Handle opening Drawer in Add mode
  const handleOpenAddDrawer = () => {
    setEditingUser(null)
    setFormFirstName('')
    setFormLastName('')
    setFormUsername('')
    setFormEmail('')
    setFormGender('Male')
    setFormRole(UserRole.STUDENT)
    setFormStatus(UserStatus.ACTIVE)
    setFormDOB('')
    setDrawerOpen(true)
  }

  // Handle opening Drawer in Edit mode
  const handleOpenEditDrawer = (user: User) => {
    setEditingUser(user)
    setFormFirstName(user.firstName)
    setFormLastName(user.lastName)
    setFormUsername(user.username || '')
    setFormEmail(user.email)
    setFormGender(user.gender || Gender.OTHER)
    setFormRole(user.role)
    setFormStatus(user.status)
    setFormDOB(formatDateForInput(user.dateOfBirth))
    setDrawerOpen(true)
  }

  // Handle saving the user record
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formFirstName.trim() || !formLastName.trim() || !formUsername.trim() || !formEmail.trim() || !formDOB) {
      notify.warning('Please fill in all mandatory fields.')
      return
    }

    const birthDate = new Date(formDOB)
    if (isNaN(birthDate.getTime())) {
      notify.warning('Please enter a valid Date of Birth.')
      return
    }

    if (editingUser) {
      // Update record in state
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
      notify.success(`User profile for ${formFirstName} ${formLastName} has been updated.`)
    } else {
      // Create new record
      const newId = `USR-${Math.floor(100 + Math.random() * 900)}`
      const newUser: User = {
        id: newId,
        schoolId: 'school-1',
        username: formUsername.trim(),
        email: formEmail.trim(),
        firstName: formFirstName.trim(),
        lastName: formLastName.trim(),
        dateOfBirth: birthDate,
        gender: formGender,
        refreshToken: '',
        refreshTokenExpiry: new Date(),
        role: formRole,
        status: formStatus,
      }
      setUsers((prev) => [...prev, newUser])
      notify.success(`User account for ${formFirstName} ${formLastName} has been created.`)
    }

    setDrawerOpen(false)
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
  const handleSelectStatus = (newStatus: UserStatus) => {
    if (activeMenuUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === activeMenuUser.id ? { ...u, status: newStatus } : u))
      )
      notify.success(`Status for ${activeMenuUser.firstName} changed to ${newStatus}.`)
    }
    handleCloseStatusMenu()
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      
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

      {/* Metrics Cards (Keep static dummy parameters as instructed) */}
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
        {/* Tab Filter Chips (Keep static as instructed) */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <Chip label="All Users" color="primary" variant="filled" sx={{ borderRadius: '8px' }} />
          <Chip label="Staff" variant="outlined" sx={{ borderRadius: '8px' }} />
          <Chip label="Students" variant="outlined" sx={{ borderRadius: '8px' }} />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                {/* Fixed column header at the left */}
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
              {users.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {/* Fixed column cells on the left */}
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
                  <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.lastName}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.username || row.email.split('@')[0]}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.email}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.gender}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{formatDateOfBirth(row.dateOfBirth)}</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>{row.role}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        <Box>
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
                onChange={(e) => setFormFirstName(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Last Name *
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

            {/* Username */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Username *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. sarah.jenkins"
                value={formUsername}
                onChange={(e) => setFormUsername(e.target.value)}
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
                onChange={(e) => setFormEmail(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Gender Selection */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Gender
              </Typography>
              <Select
                fullWidth
                value={formGender}
                onChange={(e) => setFormGender(e.target.value)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
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
                onChange={(e) => setFormDOB(e.target.value)}
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
                <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRole.TEACHER}>Teacher</MenuItem>
                <MenuItem value={UserRole.STUDENT}>Student</MenuItem>
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

      {/* Change Status Popover Menu */}
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
        <MenuItem onClick={() => handleSelectStatus(UserStatus.ACTIVE)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Active
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus(UserStatus.INACTIVE)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Inactive
        </MenuItem>
        <MenuItem onClick={() => handleSelectStatus(UserStatus.SUSPENDED)} sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Suspended
        </MenuItem>
      </Menu>

    </Box>
  )
}
