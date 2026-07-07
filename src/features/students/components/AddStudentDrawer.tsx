import { useState, type FormEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Icons
import CloseIcon from '@mui/icons-material/Close'

interface AddStudentDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (firstName: string, lastName: string, className: string) => void
}

export default function AddStudentDrawer({ open, onClose, onSave }: AddStudentDrawerProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedClass, setSelectedClass] = useState('Class 10-A')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      return
    }
    onSave(firstName.trim(), lastName.trim(), selectedClass)
    // Clear forms
    setFirstName('')
    setLastName('')
    setSelectedClass('Class 10-A')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
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
        {/* Drawer top bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'left' }}>
            Add New Student
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* First name field - label strictly above input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
              First Name
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Julian"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {/* Last name field - label strictly above input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Vance"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {/* Class selection dropdown - label strictly above input */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', display: 'block', textAlign: 'left' }}>
              Class Assignment
            </Typography>
            <Select
              fullWidth
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              variant="outlined"
              sx={{ borderRadius: '8px', textAlign: 'left' }}
            >
              <MenuItem value="Class 10-A">Class 10-A</MenuItem>
              <MenuItem value="Class 10-B">Class 10-B</MenuItem>
              <MenuItem value="Class 11-A">Class 11-A</MenuItem>
              <MenuItem value="Class 11-B">Class 11-B</MenuItem>
            </Select>
          </Box>
        </form>
      </Box>

      {/* Drawer action buttons */}
      <Box sx={{ display: 'flex', gap: 2, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
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
          onClick={handleSubmit}
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
          Save Student
        </Button>
      </Box>
    </Drawer>
  )
}
