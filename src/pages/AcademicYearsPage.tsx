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
import { format } from 'date-fns'

// Icons & Services
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { academicYearsService } from '../services/academicYearService'
import { schoolsService } from '../services/schoolService'
import type { AcademicYearItem } from '../interfaces/academicYear.type'
import type { SchoolItem } from '../interfaces/school.type'
import { useAuth } from '../context/AuthContext'
import { checkUserRole } from '../utils/roleCheck'
import { notify } from '../store/notification.store'

export default function AcademicYearsPage() {
  const { user } = useAuth()
  const isSuperAdmin = checkUserRole.isSuperAdmin(user?.role)

  const [years, setYears] = useState<AcademicYearItem[]>([])
  const [pageLoading, setPageLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // School drop-down states for Super Admin
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
  const [schoolsLoading, setSchoolsLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYearItem | null>(null)

  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch all schools if current user is Super Admin
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
    if (isSuperAdmin) {
      fetchSchools()
    }
  }, [user])

  const fetchYears = async () => {
    if (isSuperAdmin && !selectedSchoolId) {
      setYears([])
      setTotalCount(0)
      return
    }

    setPageLoading(true)
    try {
      const data = await academicYearsService.getAcademicYears(
        page + 1,
        rowsPerPage,
        isSuperAdmin ? selectedSchoolId : null
      )
      if (data) {
        if (data.items) {
          setYears(data.items)
          setTotalCount(data.totalCount || 0)
        } else if (Array.isArray(data)) {
          setYears(data)
          setTotalCount(data.length)
        } else {
          setYears([])
          setTotalCount(0)
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch academic years:', err)
      notify.error('Failed to load academic years.')
      setYears([])
      setTotalCount(0)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchYears()
  }, [page, rowsPerPage, selectedSchoolId])

  // Format Dates for UI / Forms
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

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    if (isSuperAdmin && !selectedSchoolId) {
      notify.warning('Please select a school first.')
      return
    }
    setEditingYear(null)
    setName('')
    setStartDate('')
    setEndDate('')
    setStatus('Active')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (yr: AcademicYearItem) => {
    setEditingYear(yr)
    setName(yr.name)
    setStartDate(formatDateForInput(yr.startDate))
    setEndDate(formatDateForInput(yr.endDate))
    setStatus(yr.status)
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') {
      setName(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, name: '' }))
    } else if (field === 'startDate') {
      setStartDate(val)
      if (val) setErrors((prev) => ({ ...prev, startDate: '', endDate: '' }))
    } else if (field === 'endDate') {
      setEndDate(val)
      if (val) setErrors((prev) => ({ ...prev, endDate: '', startDate: '' }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveYear = async (e: FormEvent) => {
    e.preventDefault()

    const tempErrors: Record<string, string> = {}
    if (!name.trim()) tempErrors.name = 'Academic Year title is required.'
    if (!startDate) tempErrors.startDate = 'Start Date is required.'
    if (!endDate) tempErrors.endDate = 'End Date is required.'

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start >= end) {
        tempErrors.startDate = 'Start Date must be strictly before End Date.'
        tempErrors.endDate = 'End Date must be strictly after Start Date.'
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
      name: name.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
    }

    try {
      if (editingYear) {
        await academicYearsService.updateAcademicYear(
          editingYear.id,
          payload,
          isSuperAdmin ? selectedSchoolId : null
        )
        notify.success(`Academic Year ${name} updated successfully.`)
      } else {
        await academicYearsService.createAcademicYear(
          payload,
          isSuperAdmin ? selectedSchoolId : null
        )
        notify.success(`Academic Year ${name} registered successfully.`)
      }
      fetchYears()
      setDrawerOpen(false)
    } catch (err: any) {
      console.error('Failed to save academic year:', err)
      const msg = err.response?.data?.message || 'Failed to save academic year.'
      notify.error(msg)
    } finally {
      setSaveLoading(false)
    }
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
            Saving academic calendar...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Academic Years
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Register academic years, terms, and starting/ending calendar limits.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isSuperAdmin && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 220 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, color: 'text.secondary' }}>
                Select School *
              </Typography>
              <Select
                value={selectedSchoolId}
                onChange={(e) => {
                  setSelectedSchoolId(e.target.value)
                  setPage(0)
                }}
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
            disabled={isSuperAdmin && !selectedSchoolId}
            sx={{
              py: 1,
              px: 2.5,
              borderRadius: '8px',
              fontWeight: 700,
              textTransform: 'none',
              backgroundImage: isSuperAdmin && !selectedSchoolId 
                ? 'none' 
                : 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
              color: '#fff',
              '&:hover': {
                backgroundImage: isSuperAdmin && !selectedSchoolId 
                  ? 'none' 
                  : 'linear-gradient(135deg, #0369a1 0%, #0f766e 100%)',
              },
            }}
          >
            Add Academic Year
          </Button>
        </Box>
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
                <TableCell sx={{ fontWeight: 700 }}>Year Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
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
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : isSuperAdmin && !selectedSchoolId ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', fontWeight: 600 }}>
                    Please select a school to load and manage academic years.
                  </TableCell>
                </TableRow>
              ) : years.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No academic years found. Click "Add Academic Year" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                years.map((row) => (
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
                      <Tooltip title="Edit Academic Year">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {row.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDateForUI(row.startDate)}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{formatDateForUI(row.endDate)}</TableCell>
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit Academic Year Form) */}
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
            {editingYear ? 'Edit Academic Calendar' : 'Add New Academic Year'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveYear}>
            
            {/* Year Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Year Title *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 2026-2027"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name || ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Start Date */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Start Date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={startDate}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate || ''}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* End Date */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                End Date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={endDate}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                error={!!errors.endDate}
                helperText={errors.endDate || ''}
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
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
            onClick={handleSaveYear}
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
            Save Academic Year
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
