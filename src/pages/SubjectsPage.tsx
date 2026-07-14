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
import { subjectsService } from '../services/subjectService'
import type { SubjectItem } from '../interfaces/subject.type'
import { notify } from '../store/notification.store'

const MOCK_SUBJECTS: SubjectItem[] = [
  { id: 'SUB-401', name: 'Mathematics', code: 'MATH101', type: 'Both' },
  { id: 'SUB-402', name: 'Physics', code: 'PHYS101', type: 'Both' },
  { id: 'SUB-403', name: 'English Literature', code: 'ENGL102', type: 'Theory' },
]

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [type, setType] = useState<'Theory' | 'Practical' | 'Both'>('Both')

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchSubjects = async () => {
    setPageLoading(true)
    try {
      const data = await subjectsService.getSubjects(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setSubjects(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setSubjects(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
      // Offline fallback
      setSubjects(MOCK_SUBJECTS)
      setTotalCount(MOCK_SUBJECTS.length)
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [page, rowsPerPage])

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingSubject(null)
    setName('')
    setCode('')
    setType('Both')
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (sub: SubjectItem) => {
    setEditingSubject(sub)
    setName(sub.name)
    setCode(sub.code)
    setType(sub.type)
    setErrors({})
    setDrawerOpen(true)
  }

  // Handle immediate error clearances
  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') {
      setName(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, name: false }))
    } else if (field === 'code') {
      setCode(val)
      if (val.trim()) setErrors((prev) => ({ ...prev, code: false }))
    }
  }

  // Handle Form Submission with validation error state coloring
  const handleSaveSubject = async (e: FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !name.trim(),
      code: !code.trim(),
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
      code: code.trim().toUpperCase(),
      type,
    }

    try {
      if (editingSubject) {
        await subjectsService.updateSubject(editingSubject.id, payload)
        notify.success(`Subject ${name} updated successfully.`)
      } else {
        await subjectsService.createSubject(payload)
        notify.success(`Subject ${name} created successfully.`)
      }
      fetchSubjects()
      setDrawerOpen(false)
    } catch {
      // Local state fallback
      if (editingSubject) {
        setSubjects((prev) =>
          prev.map((s) => (s.id === editingSubject.id ? { ...s, ...payload, id: s.id } : s))
        )
        notify.success(`Subject updated locally.`)
      } else {
        const mockId = `SUB-${Math.floor(100 + Math.random() * 900)}`
        setSubjects((prev) => [...prev, { ...payload, id: mockId }])
        notify.success(`Subject created locally (Backend offline).`)
      }
      setDrawerOpen(false)
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedSubjects = subjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            Saving subject profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Subjects
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage the list of educational courses, exam syllabus type, and codes.
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
          Add Subject
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
                <TableCell sx={{ fontWeight: 700 }}>Subject Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Subject Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
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
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : displayedSubjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No subject records found. Click "Add Subject" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedSubjects.map((row) => (
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
                      <Tooltip title="Edit Subject">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.code}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.type}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor:
                            row.type === 'Theory'
                              ? 'rgba(139, 92, 246, 0.1)'
                              : row.type === 'Practical'
                              ? 'rgba(6, 182, 212, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            row.type === 'Theory' ? '#8B5CF6' : row.type === 'Practical' ? '#06B6D4' : '#10B981',
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit Subject Form) */}
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
            {editingSubject ? 'Edit Subject Details' : 'Add New Subject'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveSubject}>
            
            {/* Subject Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Subject Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Mathematics"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name ? 'Subject name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Subject Code */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Subject Code *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. MATH101"
                value={code}
                onChange={(e) => handleFieldChange('code', e.target.value)}
                error={!!errors.code}
                helperText={errors.code ? 'Subject code is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Subject Type */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Subject Type *
              </Typography>
              <Select
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value as 'Theory' | 'Practical' | 'Both')}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value="Theory">Theory Only</MenuItem>
                <MenuItem value="Practical">Practical Only</MenuItem>
                <MenuItem value="Both">Both (Theory & Practical)</MenuItem>
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
            onClick={handleSaveSubject}
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
            Save Subject
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
