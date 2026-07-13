import { createBrowserRouter } from 'react-router'
import { lazy, Suspense, type JSX } from 'react'
import MainLayout from '../layouts/MainLayout.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import LoginPage from '../pages/LoginPage.tsx'
import EmptyPage from '../pages/EmptyPage.tsx'

// Lazy-loaded roster pages
const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'))
const StudentDirectoryPage = lazy(() => import('../features/students/pages/StudentDirectoryPage.tsx'))
const TeachersPage = lazy(() => import('../pages/TeachersPage.tsx'))
const ClassesPage = lazy(() => import('../pages/ClassesPage.tsx'))
const DivisionsPage = lazy(() => import('../pages/DivisionsPage.tsx'))
const SubjectsPage = lazy(() => import('../pages/SubjectsPage.tsx'))
const AcademicYearsPage = lazy(() => import('../pages/AcademicYearsPage.tsx'))
const UsersPage = lazy(() => import('../pages/UsersPage.tsx'))

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
)

const renderEmpty = (title: string) => <EmptyPage title={title} />

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
          // Primary Active pages
          { path: '/', element: withSuspense(DashboardPage), handle: { title: 'School Analytics Dashboard' } },
          { path: '/users', element: withSuspense(UsersPage), handle: { title: 'Users Directory' } },
          { path: '/students', element: withSuspense(StudentDirectoryPage), handle: { title: 'Student Directory' } },
          { path: '/teachers', element: withSuspense(TeachersPage), handle: { title: 'Teachers Directory' } },
          
          // Academic submenus
          { path: '/academic/classes', element: withSuspense(ClassesPage), handle: { title: 'Classes Management' } },
          { path: '/academic/divisions', element: withSuspense(DivisionsPage), handle: { title: 'Divisions Management' } },
          { path: '/academic/subjects', element: withSuspense(SubjectsPage), handle: { title: 'Subjects Registry' } },
          { path: '/academic/academic-years', element: withSuspense(AcademicYearsPage), handle: { title: 'Academic Years Calendar' } },

          // Empty Placeholder Pages
          { path: '/students/enrollments', element: renderEmpty('Student Enrollments') },
          { path: '/teachers/assignments', element: renderEmpty('Subject Assignments') },
          { path: '/academic/timetable', element: renderEmpty('Class Timetable Calendar') },
          
          { path: '/examinations/schedules', element: renderEmpty('Exam Schedules') },
          { path: '/examinations/marks', element: renderEmpty('Enter Student Marks') },
          { path: '/examinations/report-cards', element: renderEmpty('Report Cards Manager') },

          { path: '/fees/structures', element: renderEmpty('Fee Structures') },
          { path: '/fees/student-fees', element: renderEmpty('Student Fees Invoicing') },
          { path: '/fees/payments', element: renderEmpty('Payment History Ledger') },

          { path: '/attendance/mark', element: renderEmpty('Mark Attendance Registry') },
          { path: '/attendance/reports', element: renderEmpty('Attendance Reports') },
          { path: '/attendance/delegation', element: renderEmpty('Staff Delegation Logs') },

          { path: '/parents/links', element: renderEmpty('Parent-Student Linkage') },
          { path: '/parents/portal', element: renderEmpty('Parent Portal Console') },

          { path: '/communication/complaints', element: renderEmpty('Complaints & Suggestions Inbox') },
          { path: '/communication/events', element: renderEmpty('Events & Holidays Calendar') },

          { path: '/settings/profile', element: renderEmpty('School Profile Config') },
        ],
      },
    ],
  }
])