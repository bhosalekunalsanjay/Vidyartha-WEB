import { createBrowserRouter } from 'react-router'
import { lazy, Suspense, type JSX } from 'react'
import MainLayout from '../layouts/MainLayout.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import LoginPage from '../pages/LoginPage.tsx'

// Lazy-loaded pages → separate JS chunks, only downloaded when visited.
const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'))

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />, // guards everything nested inside
    children: [
      {
        element: <MainLayout />, // shared AppBar/nav shell
        children: [
          { path: '/', element: withSuspense(DashboardPage) },
        ],
      },
    ],
  }
])