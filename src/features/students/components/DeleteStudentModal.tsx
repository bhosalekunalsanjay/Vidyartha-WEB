import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Icons
import DeleteIcon from '@mui/icons-material/DeleteOutlined'

interface DeleteStudentModalProps {
  open: boolean
  studentName: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteStudentModal({ open, studentName, onClose, onConfirm }: DeleteStudentModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        zIndex: 1300,
        '& .MuiDialog-paper': {
          maxWidth: 380,
          borderRadius: '12px',
          p: 3,
        },
      }}
    >
      <DialogContent sx={{ p: 0, textAlign: 'center' }}>
        <Avatar sx={{ bgcolor: 'rgba(244, 63, 94, 0.08)', width: 56, height: 56, mx: 'auto', mb: 2 }}>
          <DeleteIcon sx={{ color: '#F43F5E', fontSize: 28 }} />
        </Avatar>
        <Typography id="delete-dialog-title" variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          Delete Record
        </Typography>
        <DialogContentText id="delete-dialog-description" sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 3 }}>
          Are you sure you want to permanently delete the student record for <strong>{studentName}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 0, gap: 2, justifyContent: 'center' }}>
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
          onClick={onConfirm}
          sx={{
            py: 1.25,
            borderRadius: '8px',
            fontWeight: 700,
            textTransform: 'none',
            bgcolor: '#F43F5E',
            color: '#fff',
            '&:hover': { bgcolor: '#BE123C' },
          }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
