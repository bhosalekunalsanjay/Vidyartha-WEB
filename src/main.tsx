import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { router } from './routes/router'
import { ColorModeProvider } from './theme/ColorModeContext'
import './index.css'
import NotificationHost from './components/NotificationHost'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <NotificationHost/>
    </ColorModeProvider>
  </StrictMode>
)