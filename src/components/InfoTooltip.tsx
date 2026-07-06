import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface InfoTooltipProps {
  title: string
  placement?: 'bottom' | 'left' | 'right' | 'top' | 'bottom-end' | 'bottom-start' | 'left-end' | 'left-start' | 'right-end' | 'right-start' | 'top-end' | 'top-start'
  size?: 'small' | 'medium' | 'large'
}

export default function InfoTooltip({ title, placement = 'top', size = 'small' }: InfoTooltipProps) {
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            p: '8px 12px',
            fontSize: '0.8125rem',
            backdropFilter: 'blur(8px)',
          },
        },
        arrow: {
          sx: {
            color: 'background.paper',
            '&::before': {
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        },
      }}
    >
      <IconButton
        size={size}
        sx={{
          color: 'text.secondary',
          opacity: 0.6,
          transition: 'opacity 0.2s',
          p: 0.5,
          '&:hover': {
            opacity: 1,
            bgcolor: 'transparent',
          },
        }}
      >
        <InfoOutlinedIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </IconButton>
    </Tooltip>
  )
}
