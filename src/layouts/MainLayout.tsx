import { useState } from 'react'
import { Outlet } from 'react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 32px)', m: 2, ml: 0.5, overflow: 'hidden' }}>
        <Header />

        <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
            <Outlet />
          </Box>
          <Box sx={{ py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              © 2026 Vidyartha. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}