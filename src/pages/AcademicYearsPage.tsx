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
import { academicYearsService } from '../services/academicYearService'
import type { AcademicYearItem } from '../interfaces/academicYear.type'
import { notify } from '../store/notification.store'

const MOCK_YEARS: AcademicYearItem[] = [
  { id: 'ACY-501', name: '2026-2027', startDate: new Date('2026-06-01'), endDate: new Date('2027-04-30'), status: 'Active' },
  { id: 'ACY-502', name: '2027-2028', startDate: new Date('2027-06-01'), endDate: new Date('2028-04-30'), status: 'Inactive' },
]

export default function AcademicYearsPage() {
  const [years, setYears] = useState<AcademicYearItem[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYearItem | null>(null)

  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchYears = async () => {
    setPageLoading(true)
    try {
      const data = await academicYearsService.getAcademicYears(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setYears(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setYears(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setYears(MOCK_YEARS)
      setTotalCount(MOCK_YEARS.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchYears()
  }, [page, rowsPerPage])

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
      if (val.trim()) setErrors((prev) => ({ ...prev, name: false }))
    } else if (field === 'startDate') {
      setStartDate(val)
      if (val) setErrors((prev) => ({ ...prev, startDate: false }))
    } else if (field === 'endDate') {
      setEndDate(val)
      if (val) setErrors((prev) => ({ ...prev, endDate: false }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveYear = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !name.trim(),
      startDate: !startDate,
      endDate: !endDate,
    }

    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((v) => v)
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      notify.warning('Please enter valid Start and End Dates.')
      return
    }

    if (start >= end) {
      setErrors((prev) => ({ ...prev, startDate: true, endDate: true }))
      notify.warning('Start Date must be strictly before End Date.')
      return
    }

    setSaveLoading(true)

    const payload = {
      name: name.trim(),
      startDate: start,
      endDate: end,
      status,
    }

    try {
      if (editingYear) {
        await academicYearsService.updateAcademicYear(editingYear.id, payload)
        notify.success(`Academic Year ${name} updated successfully.`)
      } else {
        await academicYearsService.createAcademicYear(payload)
        notify.success(`Academic Year ${name} registered successfully.`)
      }
      fetchYears()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingYear) {
        setYears((prev) =>
          prev.map((y) => (y.id === editingYear.id ? { ...y, ...payload, id: y.id } : y))
        )
        notify.success(`Academic Year updated locally.`)
      } else {
        const mockId = `ACY-${Math.floor(100 + Math.random() * 900)}`
        setYears((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Academic Year registered locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedYears = years.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Academic Years
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Register academic years, terms, and starting/ending calendar limits.
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
          Add Academic Year
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
              ) : displayedYears.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No academic years found. Click "Add Academic Year" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedYears.map((row) => (
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

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
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
                helperText={errors.name ? 'Academic Year title is required.' : ''}
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
                helperText={errors.startDate ? 'Start Date is required.' : ''}
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
                helperText={errors.endDate ? 'End Date is required.' : ''}
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
