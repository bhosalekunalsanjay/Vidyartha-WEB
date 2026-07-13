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
import { schoolsService } from '../services/schoolService'
import type { SchoolItem } from '../types/school.type'
import { notify } from '../store/notification.store'

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  // Drawer Form States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<SchoolItem | null>(null)

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [primaryContact, setPrimaryContact] = useState<string>('')
  const [secondaryContact, setSecondaryContact] = useState<string>('')
  const [email, setEmail] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [status, setStatus] = useState<number>(1)

  // Validation Error States
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Pagination States
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  const fetchSchools = async () => {
    setPageLoading(true)
    try {
      const data = await schoolsService.getSchools(page + 1, rowsPerPage)
      if (data) {
        if (Array.isArray(data)) {
          setSchools(data)
          setTotalCount(data.length)
        } else if (data.items) {
          setSchools(data.items)
          setTotalCount(data.totalCount || data.items.length)
        }
      }
    } catch {
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [page, rowsPerPage])

  // Open drawers in Add / Edit configurations
  const handleOpenAddDrawer = () => {
    setEditingSchool(null)
    setName('')
    setAddress('')
    setPrimaryContact('')
    setSecondaryContact('')
    setEmail('')
    setTagLine('')
    setStatus(1)
    setErrors({})
    setDrawerOpen(true)
  }

  const handleOpenEditDrawer = (school: SchoolItem) => {
    setEditingSchool(school)
    setName(school.name)
    setAddress(school.address || '')
    setPrimaryContact(school.primaryContact || '')
    setSecondaryContact(school.secondaryContact || '')
    setEmail(school.email || '')
    setTagLine(school.tagLine || '')
    setStatus(school.status !== undefined ? school.status : 1)
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
  const handleSaveSchool = async (e: FormEvent) => {
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
      address: address.trim() || undefined,
      primaryContact: primaryContact.trim(),
      secondaryContact: secondaryContact.trim(),
      email: email.trim() || undefined,
      tagLine: tagLine.trim() || undefined,
      status,
    }

    try {
      if (editingSchool) {
        await schoolsService.updateSchool(editingSchool.id, payload)
        notify.success(`School ${name} updated successfully.`)
      } else {
        await schoolsService.createSchool(payload)
        notify.success(`School ${name} created successfully.`)
      }
      fetchSchools()
      setDrawerOpen(false)
    } catch {
    } finally {
      setSaveLoading(false)
    }
  }

  const displayedSchools = schools.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            Saving school profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Schools
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage registered school campus properties, contact lines, and taglines.
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
          Add School
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
                <TableCell sx={{ fontWeight: 700 }}>School Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tagline</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Primary Contact</TableCell>
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
                    <TableCell><Skeleton variant="text" width={140} /></TableCell>
                    <TableCell><Skeleton variant="text" width={110} /></TableCell>
                    <TableCell><Skeleton variant="text" width={160} /></TableCell>
                    <TableCell><Skeleton variant="text" width={130} /></TableCell>
                    <TableCell><Skeleton variant="text" width={90} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                  </TableRow>
                ))
              ) : displayedSchools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No school profiles registered. Click "Add School" to register one.
                  </TableCell>
                </TableRow>
              ) : (
                displayedSchools.map((row) => (
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
                      <Tooltip title="Edit School">
                        <IconButton size="small" onClick={() => handleOpenEditDrawer(row)}>
                          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{row.tagLine || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.address || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.email || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.primaryContact || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status === 1 ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.status === 1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                          color: row.status === 1 ? '#10B981' : '#F43F5E',
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

      {/* Slide-out Sidebar Drawer Form (Add/Edit School Form) */}
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
            {editingSchool ? 'Edit School Profile' : 'Register New School'}
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable Form Box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3.5 }}>
          <form onSubmit={handleSaveSchool}>
            
            {/* School Name */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                School Name *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Vidyartha Public School"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name ? 'School name is required.' : ''}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Tagline */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Tagline
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Nurturing future leaders"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Address */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Campus Address
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. 102 Main Street, Tech City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="e.g. contact@vidyartha.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Primary Contact */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Primary Contact Number
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="e.g. 5551234"
                value={primaryContact}
                onChange={(e) => setPrimaryContact(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Secondary Contact */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                Secondary Contact Number
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="e.g. 5555678"
                value={secondaryContact}
                onChange={(e) => setSecondaryContact(e.target.value)}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            {/* Status */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
                School Status
              </Typography>
              <Select
                fullWidth
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                variant="outlined"
                sx={{ borderRadius: '8px', textAlign: 'left' }}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
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
            onClick={handleSaveSchool}
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
            Save School
          </Button>
        </Box>
      </Drawer>

    </Box>
  )
}
