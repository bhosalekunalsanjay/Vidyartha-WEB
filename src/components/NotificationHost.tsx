import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useNotificationStore } from '../store/notification.store'

export default function NotificationHost() {
  // Selector pattern: this component only re-renders when `notifications` changes,
  // not on every unrelated store update — same idea as .pipe(map(...)) on an Observable
  // instead of subscribing to the raw subject.
  const notifications = useNotificationStore((state) => state.notifications)
  const dismiss = useNotificationStore((state) => state.dismiss)

  const current = notifications[0] // drain one at a time, queue the rest

  return (
    <Snackbar
      open={!!current}
      autoHideDuration={4000}
      onClose={() => current && dismiss(current.id)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {current ? (
        <Alert severity={current.notificationType} onClose={() => dismiss(current.id)}>
          {current.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  )
}