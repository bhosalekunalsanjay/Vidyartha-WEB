import { useState, useEffect, useRef, type FormEvent } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Skeleton from '@mui/material/Skeleton'
import TablePagination from '@mui/material/TablePagination'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelIcon from '@mui/icons-material/CancelOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { staffService } from '../services/staffService'
import { schoolsService } from '../services/schoolService'
import type { StaffMember } from '../interfaces/staff.type'
import type { SchoolItem } from '../interfaces/school.type'
import { UserRole } from '../enums/UserRole'
import { UserStatus } from '../enums/UserStatus'
import { useAuth } from '../context/AuthContext'
import { notify } from '../store/notification.store'
import { format } from 'date-fns'
import type { User } from '../interfaces/payloads/user'

export default function StaffPage() {
  const { user: authUser } = useAuth()
  const isSuperAdmin = true;//authUser?.role === UserRole.SUPER_ADMIN

  // ─── List State ──────────────────────────────────────────────────────────────
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  // ─── School Dropdown (for Super Admin) ───────────────────────────────────────
  const [schools, setSchools] = useState<SchoolItem[]>([])

  // ─── Drawer State ─────────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  // ─── Form Fields ──────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [status, setStatus] = useState<UserStatus>(UserStatus.ACTIVE)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ─── Validation ───────────────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // ─── Username Availability ────────────────────────────────────────────────────
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Fetch Staff List ─────────────────────────────────────────────────────────
  const fetchStaff = async (signal?: AbortSignal) => {
    setPageLoading(true)
    try {
      const payload: User = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        role: UserRole.NON_TEACHING_STAFF,
        schoolId: "1234",
      }
      const data = await staffService.getStaff(payload, signal)
      if (data) {
        if (Array.isArray(data)) {
          setStaff(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setStaff(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch (err: any) {
      if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
        setStaff([])
        setTotalCount(0)
      }
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchStaff(controller.signal)
    return () => controller.abort()
  }, [page, rowsPerPage])

  // ─── Load schools for Super Admin school dropdown ─────────────────────────────
  useEffect(() => {
    if (!isSuperAdmin) return
    schoolsService.getSchools(1, 100).then((data) => {
      if (Array.isArray(data)) setSchools(data)
      else if (data?.items) setSchools(data.items)
    }).catch(() => setSchools([]))
  }, [isSuperAdmin])

  // ─── Realtime Username Check (3 s debounce) ───────────────────────────────────
  useEffect(() => {
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)

    if (!username.trim()) {
      setUsernameAvailable(null)
      setCheckingUsername(false)
      return
    }

    // If editing and username unchanged — skip check
    if (editingStaff && username.trim().toLowerCase() === editingStaff.username?.toLowerCase()) {
      setUsernameAvailable(true)
      setCheckingUsername(false)
      return
    }

    setCheckingUsername(true)
    setUsernameAvailable(null)

    usernameDebounceRef.current = setTimeout(async () => {
      try {
        const available = await staffService.checkUsernameAvailable(username.trim())
        setUsernameAvailable(available)
      } catch {
        setUsernameAvailable(null)
      } finally {
        setCheckingUsername(false)
      }
    }, 3000)

    return () => {
      if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)
    }
  }, [username, editingStaff])

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const formatDOBForUI = (val: any) => {
    try {
      const d = val instanceof Date ? val : new Date(val)
      if (isNaN(d.getTime())) return '—'
      return format(d, 'dd/MM/yyyy')
    } catch { return '—' }
  }

  const formatDOBForInput = (val: any) => {
    try {
      const d = val instanceof Date ? val : new Date(val)
      if (isNaN(d.getTime())) return ''
      return d.toISOString().split('T')[0]
    } catch { return '' }
  }

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setDateOfBirth('')
    setSchoolId('')
    setStatus(UserStatus.ACTIVE)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setErrors({})
    setUsernameAvailable(null)
  }

  // ─── Open Add Drawer ──────────────────────────────────────────────────────────
  const handleOpenAddDrawer = () => {
    setEditingStaff(null)
    clearForm()
    setDrawerOpen(true)
  }

  // ─── Open Edit Drawer ─────────────────────────────────────────────────────────
  const handleOpenEditDrawer = (member: StaffMember) => {
    setEditingStaff(member)
    setFirstName(member.firstName)
    setLastName(member.lastName || '')
    setUsername(member.username)
    setEmail(member.email || '')
    setPassword('')
    setConfirmPassword('')
    setDateOfBirth(formatDOBForInput(member.dateOfBirth))
    setSchoolId(member.schoolId || '')
    setStatus(member.status)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setErrors({})
    setUsernameAvailable(true)
    setDrawerOpen(true)
  }

  // ─── Field Change Handlers (with immediate error clearing) ────────────────────
  const handleChange = (field: string, val: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(val)
        if (val.trim()) setErrors((p) => ({ ...p, firstName: false }))
        break
      case 'username':
        setUsername(val)
        if (val.trim()) setErrors((p) => ({ ...p, username: false }))
        break
      case 'password':
        setPassword(val)
        if (val.trim()) setErrors((p) => ({ ...p, password: false }))
        break
      case 'confirmPassword':
        setConfirmPassword(val)
        if (val.trim() && val === password) setErrors((p) => ({ ...p, confirmPassword: false }))
        break
      case 'dateOfBirth':
        setDateOfBirth(val)
        if (val) setErrors((p) => ({ ...p, dateOfBirth: false }))
        break
    }
  }

  // ─── Save Handler ─────────────────────────────────────────────────────────────
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const isAdd = !editingStaff

    const newErrors: Record<string, boolean> = {
      firstName: !firstName.trim(),
      username: !username.trim() || usernameAvailable === false,
      status: !status,
      ...(isAdd && {
        password: !password.trim(),
        confirmPassword: !confirmPassword.trim() || confirmPassword !== password,
      }),
    }

    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    setSaveLoading(true)
    try {
      if (isAdd) {
        const payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          username: username.trim(),
          email: email.trim() || undefined,
          password,
          confirmPassword,
          dateOfBirth: dateOfBirth || undefined,
          schoolId: isSuperAdmin && schoolId ? schoolId : undefined,
          status,
          role: UserRole.NON_TEACHING_STAFF,
        }
        await staffService.createStaff(payload)
        notify.success(`Staff member ${firstName} registered successfully.`)
      } else {
        const payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim() || undefined,
          username: username.trim(),
          email: email.trim() || undefined,
          dateOfBirth: dateOfBirth || undefined,
          schoolId: isSuperAdmin && schoolId ? schoolId : undefined,
          status,
        }
        await staffService.updateStaff(editingStaff!.id, payload)
        notify.success(`Staff member ${firstName} updated successfully.`)
      }
      fetchStaff()
      setDrawerOpen(false)
    } catch {
      // Error is shown via the axios interceptor toast
    } finally {
      setSaveLoading(false)
    }
  }

  // ─── Username Availability Adornment ─────────────────────────────────────────
  const usernameEndAdornment = () => {
    if (!username.trim()) return null
    if (checkingUsername) return <InputAdornment position="end"><CircularProgress size={16} /></InputAdornment>
    if (usernameAvailable === true) return <InputAdornment position="end"><CheckCircleIcon sx={{ color: '#10B981', fontSize: 18 }} /></InputAdornment>
    if (usernameAvailable === false) return <InputAdornment position="end"><CancelIcon sx={{ color: '#F43F5E', fontSize: 18 }} /></InputAdornment>
    return null
  }

  // ─── Shared form field styles ─────────────────────────────────────────────────
  const inputSx = { '& .MuiOutlinedInput-root': { borderRadius: '8px' } }

  const labelSx = {
    variant: 'body2' as const,
    sx: { fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>

      {/* Saving backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 999 }} open={saveLoading}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>Saving staff record...</Typography>
        </Box>
      </Backdrop>

      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Non-Teaching Staff</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage non-teaching staff accounts, credentials, and school assignments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDrawer}
          sx={{
            py: 1, px: 2.5, borderRadius: '8px', fontWeight: 700, textTransform: 'none',
            backgroundImage: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
            color: '#fff',
            '&:hover': { backgroundImage: 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)' },
          }}
        >
          Add Staff
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell sx={{
                  fontWeight: 700, position: 'sticky', left: 0, bgcolor: 'action.hover',
                  zIndex: 3, boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)', width: 90, minWidth: 90,
                }}>
                  Action
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date of Birth</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageLoading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 2, boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)', width: 90, minWidth: 90 }}>
                      <Skeleton variant="circular" width={28} height={28} />
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={160} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={65} height={22} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No non-teaching staff found. Click "Add Staff" to register one.
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((row) => (
                  <TableRow key={row.id} hover sx={{ '& td': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                    <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 2, boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)', width: 90, minWidth: 90 }}>
                      <Tooltip title="Edit Staff Member">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.firstName} {row.lastName || ''}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.username}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDOBForUI(row.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.status === UserStatus.ACTIVE ? 'rgba(16,185,129,0.1)' : row.status === UserStatus.INACTIVE ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                          color: row.status === UserStatus.ACTIVE ? '#10B981' : row.status === UserStatus.INACTIVE ? '#F43F5E' : '#F59E0B',
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Card>

      {/* ─── Add / Edit Drawer ──────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          zIndex: 1200,
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420 },
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {/* Fixed Header */}
        <Box sx={{
          p: 3.5, borderBottom: '1px solid', borderColor: 'divider',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {editingStaff ? 'Edit Staff Member' : 'Register Staff Member'}
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSave} noValidate>

            {/* First Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>First Name *</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Ramesh"
                value={firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName ? 'First name is required.' : ''}
                variant="outlined"
                sx={inputSx}
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>Last Name</Typography>
              <TextField
                fullWidth
                placeholder="e.g. Kumar"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="outlined"
                sx={inputSx}
              />
            </Box>

            {/* School Dropdown — only for Super Admin */}
            {isSuperAdmin && (
              <Box sx={{ mb: 2.5 }}>
                <Typography {...labelSx}>School *</Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  variant="outlined"
                  sx={{ borderRadius: '8px', textAlign: 'left' }}
                  renderValue={(val) => {
                    if (!val) return <span style={{ color: '#9CA3AF' }}>Select school</span>
                    return schools.find((s) => s.id === val)?.name || val
                  }}
                >
                  <MenuItem value="" disabled><em>Select school</em></MenuItem>
                  {schools.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            {/* Username */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>Username *</Typography>
              <TextField
                fullWidth
                placeholder="e.g. ramesh.kumar"
                value={username}
                onChange={(e) => handleChange('username', e.target.value)}
                error={!!errors.username || usernameAvailable === false}
                helperText={
                  usernameAvailable === false
                    ? 'This username is already taken.'
                    : usernameAvailable === true && username.trim()
                    ? 'Username is available.'
                    : errors.username
                    ? 'Username is required.'
                    : ''
                }
                slotProps={{
                  formHelperText: {
                    sx: { color: usernameAvailable === true ? '#10B981' : undefined }
                  },
                  input: { endAdornment: usernameEndAdornment() }
                }}
                variant="outlined"
                sx={inputSx}
              />
            </Box>

            {/* Password — required only on Add */}
            {!editingStaff && (
              <>
                <Box sx={{ mb: 2.5 }}>
                  <Typography {...labelSx}>Password *</Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password ? 'Password is required.' : ''}
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                    sx={inputSx}
                  />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Typography {...labelSx}>Confirm Password *</Typography>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword ? 'Passwords do not match.' : ''}
                    variant="outlined"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowConfirmPassword((p) => !p)} edge="end">
                              {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                    sx={inputSx}
                  />
                </Box>
              </>
            )}

            {/* Email */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>Email Address</Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="e.g. ramesh.kumar@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={inputSx}
              />
            </Box>

            {/* Date of Birth */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>Date of Birth</Typography>
              <TextField
                fullWidth
                type="date"
                value={dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={inputSx}
              />
            </Box>

            {/* Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography {...labelSx}>Status *</Typography>
              <Select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value as UserStatus)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value={UserStatus.ACTIVE}>
                  <Chip label="Active" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700, borderRadius: '6px' }} />
                </MenuItem>
                <MenuItem value={UserStatus.INACTIVE}>
                  <Chip label="Inactive" size="small" sx={{ bgcolor: 'rgba(244,63,94,0.1)', color: '#F43F5E', fontWeight: 700, borderRadius: '6px' }} />
                </MenuItem>
                <MenuItem value={UserStatus.SUSPENDED}>
                  <Chip label="Suspended" size="small" sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontWeight: 700, borderRadius: '6px' }} />
                </MenuItem>
              </Select>
            </Box>
          </form>
        </Box>

        {/* Fixed Footer */}
        <Box sx={{
          display: 'flex', gap: 2, p: 3.5,
          borderTop: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper', position: 'sticky', bottom: 0, zIndex: 10,
        }}>
          <Button
            fullWidth variant="outlined"
            onClick={() => setDrawerOpen(false)}
            sx={{
              py: 1.25, borderRadius: '8px', fontWeight: 700, textTransform: 'none',
              color: 'text.secondary', borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth variant="contained"
            onClick={handleSave}
            sx={{
              py: 1.25, borderRadius: '8px', fontWeight: 700, textTransform: 'none',
              backgroundImage: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              color: '#fff',
              '&:hover': { backgroundImage: 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)' },
            }}
          >
            {editingStaff ? 'Save Changes' : 'Register Staff'}
          </Button>
        </Box>
      </Drawer>
    </Box>
  )
}
