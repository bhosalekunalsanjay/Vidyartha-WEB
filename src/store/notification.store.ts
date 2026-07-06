import { create } from 'zustand'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  message: string
  notificationType: NotificationType
}

interface NotificationState {
  notifications: Notification[]
  show: (message: string, notificationsType?: NotificationType) => void
  dismiss: (id: string) => void
}

// This is your "service class + BehaviorSubject" rolled into one.
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  show: (message, notificationType = 'info') => {
    const id = crypto.randomUUID()
    set((state) => ({
      notifications: [...state.notifications, { id, message, notificationType }],
    }))
  },
  dismiss: (id) => {
    console.log('dismiss')
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
}))

// Ergonomic wrapper — this is the part that feels like an Angular service.
// Notice: no hook, no component required to call this. Works ANYWHERE.
export const notify = {
  success: (message: string) => useNotificationStore.getState().show(message, 'success'),
  error: (message: string) => useNotificationStore.getState().show(message, 'error'),
  info: (message: string) => useNotificationStore.getState().show(message, 'info'),
  warning: (message: string) => useNotificationStore.getState().show(message, 'warning'),
}