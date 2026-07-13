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
import { divisionsService } from '../services/divisionService'
import type { DivisionItem } from '../types/division.type'
import { notify } from '../store/notification.store'

const MOCK_DIVISIONS: DivisionItem[] = [
  { id: 'DIV-301', name: 'Division A', classId: 'Class 10-A', classRoom: 'Building B, Room 102' },
  { id: 'DIV-302', name: 'Division B', classId: 'Class 10-B', classRoom: 'Building B, Room 103' },
  { id: 'DIV-303', name: 'Division A', classId: 'Class 11-A', classRoom: 'Building C, Room 204' },
]

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<DivisionItem[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState<DivisionItem | null>(null)

  const [name, setName] = useState('')
  const [classId, setClassId] = useState('Class 10-A')
  const [classRoom, setClassRoom] = useState('')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchDivisions = async () => {
    setPageLoading(true)
    try {
      const data = await divisionsService.getDivisions(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setDivisions(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setDivisions(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setDivisions(MOCK_DIVISIONS)
      setTotalCount(MOCK_DIVISIONS.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchDivisions()
  }, [page, rowsPerPage])

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingDivision(null)
    setName('')
    setClassId('Class 10-A')
    setClassRoom('')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (div: DivisionItem) => {
    setEditingDivision(div)
    setName(div.name)
    setClassId(div.classId)
    setClassRoom(div.classRoom || '')
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') {
      setName(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, name: false }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveDivision = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !name.trim(),
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
      classId,
      classRoom: classRoom.trim(),
    }

    try {
      if (editingDivision) {
        await divisionsService.updateDivision(editingDivision.id, payload)
        notify.success(`Division ${name} updated successfully.`)
      } else {
        await divisionsService.createDivision(payload)
        notify.success(`Division ${name} created successfully.`)
      }
      fetchDivisions()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingDivision) {
        setDivisions((prev) =>
          prev.map((d) => (d.id === editingDivision.id ? { ...d, ...payload, id: d.id } : d))
        )
        notify.success(`Division updated locally.`)
      } else {
        const mockId = `DIV-${Math.floor(100 + Math.random() * 900)}`
        setDivisions((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Division created locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedDivisions = divisions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            Saving division profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Divisions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Organize classes into specific sections, sections layouts, and classrooms.
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
          Add Division
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
                <TableCell sx={{ fontWeight: 700 }}>Division Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Class Assignment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Classroom Location</TableCell>
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
                    <TableCell><Skeleton variant="text" width={180} /></TableCell>
                  </TableRow>
                ))
              ) : displayedDivisions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No division records found. Click "Add Division" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedDivisions.map((row) => (
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
                      <Tooltip title="Edit Division">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.classId}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.classRoom || '—'}</TableCell>
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit Division Form) */}
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
            {editingDivision ? 'Edit Division Details' : 'Add New Division'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveDivision}>
            
            {/* Division Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Division Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Division A"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name ? 'Division name is required.' : ''}
                variant="outlined"
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

            {/* Classroom Location */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Classroom Location
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Building B, Room 102"
                value={classRoom}
                onChange={(e) => setClassRoom(e.target.value)}
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
            onClick={handleSaveDivision}
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
            Save Division
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
