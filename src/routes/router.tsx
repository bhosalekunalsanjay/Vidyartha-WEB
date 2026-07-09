import { createBrowserRouter } from 'react-router'
import { lazy, Suspense, type JSX } from 'react'
import MainLayout from '../layouts/MainLayout.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import LoginPage from '../pages/LoginPage.tsx'

// Lazy-loaded pages → separate JS chunks, only downloaded when visited.
const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'))
const StudentDirectoryPage = lazy(() => import('../features/students/pages/StudentDirectoryPage.tsx'))
const AttendancePage = lazy(() => import('../features/students/pages/AttendancePage.tsx'))
const SchoolPage = lazy(() => import('../pages/SchoolPage.tsx'))
const UsersPage = lazy(() => import('../pages/UsersPage.tsx'))
const FinancePage = lazy(() => import('../pages/FinancePage.tsx'))
const LearnHubPage = lazy(() => import('../pages/LearnHubPage.tsx'))

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
          { path: '/', element: withSuspense(DashboardPage), handle: { title: 'School Analytics Dashboard' } },
          { path: '/students', element: withSuspense(StudentDirectoryPage), handle: { title: 'Student Directory' } },
          { path: '/students/attendance', element: withSuspense(AttendancePage), handle: { title: 'Daily Attendance Log' } },
          { path: '/school', element: withSuspense(SchoolPage), handle: { title: 'School Settings' } },
          { path: '/learn-hub', element: withSuspense(LearnHubPage), handle: { title: 'Learn Hub Modules' } },
          { path: '/finance', element: withSuspense(FinancePage), handle: { title: 'Finance Registry' } },
          { path: '/users', element: withSuspense(UsersPage), handle: { title: 'Users' } },
        ],
      },
    ],
  }
])