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
import { classesService } from '../services/classService'
import type { ClassItem } from '../interfaces/class.type'
import { notify } from '../store/notification.store'

const MOCK_CLASSES: ClassItem[] = [
  { id: 'CLS-001', name: 'Class 10-A', academicYearId: '2026-2027', capacity: 40 },
  { id: 'CLS-002', name: 'Class 10-B', academicYearId: '2026-2027', capacity: 35 },
  { id: 'CLS-003', name: 'Class 11-A', academicYearId: '2026-2027', capacity: 45 },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)

  const [name, setName] = useState('')
  const [academicYearId, setAcademicYearId] = useState('2026-2027')
  const [capacity, setCapacity] = useState<number | string>('')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchClasses = async () => {
    setPageLoading(true)
    try {
      const data = await classesService.getClasses(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setClasses(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setClasses(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setClasses(MOCK_CLASSES)
      setTotalCount(MOCK_CLASSES.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [page, rowsPerPage])

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingClass(null)
    setName('')
    setAcademicYearId('2026-2027')
    setCapacity('')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (cls: ClassItem) => {
    setEditingClass(cls)
    setName(cls.name)
    setAcademicYearId(cls.academicYearId)
    setCapacity(cls.capacity)
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') {
      setName(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, name: false }))
    } else if (field === 'capacity') {
      setCapacity(val)
      if (val.trim() && !isNaN(Number(val))) setErrors((prev) => ({ ...prev, capacity: false }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveClass = async (e: FormEvent) => {
    e.preventDefault()

    const capacityNum = Number(capacity)
    const newErrors = {
      name: !name.trim(),
      capacity: !capacity.toString().trim() || isNaN(capacityNum) || capacityNum <= 0,
    }

    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((v) => v)
    if (hasErrors) {
      notify.warning('Please correct all validation errors before saving.')
      return
    }

    setSaveLoading(true)

    const payload = {
      name: name.trim(),
      academicYearId,
      capacity: capacityNum,
    }

    try {
      if (editingClass) {
        await classesService.updateClass(editingClass.id, payload)
        notify.success(`Class profile for ${name} has been updated.`)
      } else {
        await classesService.createClass(payload)
        notify.success(`Class profile for ${name} has been created.`)
      }
      fetchClasses()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingClass) {
        setClasses((prev) =>
          prev.map((c) => (c.id === editingClass.id ? { ...c, ...payload, id: c.id } : c))
        )
        notify.success(`Class profile updated locally.`)
      } else {
        const mockId = `CLS-${Math.floor(100 + Math.random() * 900)}`
        setClasses((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Class created locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedClasses = classes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            Saving class profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Classes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Configure and maintain school classrooms, student limits, and year links.
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
          Add Class
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
                <TableCell sx={{ fontWeight: 700 }}>Class Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Academic Year</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Student Capacity</TableCell>
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
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                  </TableRow>
                ))
              ) : displayedClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No class records found. Click "Add Class" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedClasses.map((row) => (
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
                      <Tooltip title="Edit Class">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.academicYearId}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.capacity} students</TableCell>
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit Class Form) */}
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
            {editingClass ? 'Edit Class Details' : 'Add New Class'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveClass}>
            
            {/* Class Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Class Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Class 10-A"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name ? 'Class name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Academic Year Selection */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Academic Year *
              </Typography>
              <Select
                fullWidth
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="2026-2027">2026-2027</MenuItem>
                <MenuItem value="2027-2028">2027-2028</MenuItem>
              </Select>
            </Box>

            {/* Student Capacity */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Student Capacity *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 40"
                value={capacity}
                onChange={(e) => handleFieldChange('capacity', e.target.value)}
                error={!!errors.capacity}
                helperText={errors.capacity ? 'Enter a valid student capacity limit.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
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
            onClick={handleSaveClass}
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
            Save Class
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
