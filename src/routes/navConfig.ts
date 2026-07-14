import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'

// Material Outlined Icons
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import PeopleIcon from '@mui/icons-material/PeopleAltOutlined'
import TeacherIcon from '@mui/icons-material/SupervisorAccountOutlined'
import AcademicIcon from '@mui/icons-material/MenuBookOutlined'
import ExamIcon from '@mui/icons-material/AssignmentOutlined'
import FeeIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import AttendanceIcon from '@mui/icons-material/CalendarMonthOutlined'
import ParentIcon from '@mui/icons-material/FamilyRestroomOutlined'
import CommIcon from '@mui/icons-material/CampaignOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import SchoolIcon from '@mui/icons-material/SchoolOutlined'
import StaffIcon from '@mui/icons-material/BadgeOutlined'

interface NavLeaf {
  label: string
  path: string
  icon?: ComponentType<SvgIconProps>
  subItems?: never
  color?: string // For custom colored icons
}

interface NavGroup {
  label: string
  path?: never
  icon?: ComponentType<SvgIconProps>
  subItems: NavLeaf[]
  color?: string // For custom colored icons
}

export type NavItem = NavLeaf | NavGroup

export function isGroup(item: NavItem): item is NavGroup {
  return Array.isArray(item.subItems)
}

export const navConfig: NavItem[] = [
  { 
    label: 'Dashboard', 
    path: '/', 
    icon: DashboardIcon,
    color: '#6366F1' // Indigo
  },
  {
    label: 'Schools',
    icon: SchoolIcon,
    color: '#F97316', // Orange
    subItems: [
      { label: 'Schools', path: '/schools' }
    ]
  },
  {
    label: 'Students',
    icon: PeopleIcon,
    color: '#0EA5E9', // Sky Blue
    subItems: [
      { label: 'Students', path: '/students' },
      { label: 'Student Enrollments', path: '/students/enrollments' },
    ],
  },
  {
    label: 'Teachers',
    icon: TeacherIcon,
    color: '#10B981', // Emerald Green
    subItems: [
      { label: 'All Teachers', path: '/teachers' },
      { label: 'Subject Assignments', path: '/teachers/assignments' },
    ],
  },
  {
    label: 'Staff',
    icon: StaffIcon,
    color: '#A855F7', // Purple
    subItems: [
      { label: 'Non-Teaching Staff', path: '/staff' },
    ],
  },
  {
    label: 'Academic',
    icon: AcademicIcon,
    color: '#8B5CF6', // Violet
    subItems: [
      { label: 'Classes', path: '/academic/classes' },
      { label: 'Divisions', path: '/academic/divisions' },
      { label: 'Subjects', path: '/academic/subjects' },
      { label: 'Academic Years', path: '/academic/academic-years' },
      { label: 'Timetable', path: '/academic/timetable' },
    ],
  },
  {
    label: 'Examinations',
    icon: ExamIcon,
    color: '#F43F5E', // Rose
    subItems: [
      { label: 'Exam Schedules', path: '/examinations/schedules' },
      { label: 'Enter Marks', path: '/examinations/marks' },
      { label: 'Report Cards', path: '/examinations/report-cards' },
    ],
  },
  {
    label: 'Fees',
    icon: FeeIcon,
    color: '#F59E0B', // Amber
    subItems: [
      { label: 'Fee Structures', path: '/fees/structures' },
      { label: 'Student Fees', path: '/fees/student-fees' },
      { label: 'Payment History', path: '/fees/payments' },
    ],
  },
  {
    label: 'Attendance',
    icon: AttendanceIcon,
    color: '#0D9488', // Teal
    subItems: [
      { label: 'Mark Attendance', path: '/attendance/mark' },
      { label: 'Attendance Reports', path: '/attendance/reports' },
      { label: 'Delegation', path: '/attendance/delegation' },
    ],
  },
  {
    label: 'Parents',
    icon: ParentIcon,
    color: '#EC4899', // Pink
    subItems: [
      { label: 'Parent-Student Links', path: '/parents/links' },
      { label: 'Parent Portal', path: '/parents/portal' },
    ],
  },
  {
    label: 'Communication',
    icon: CommIcon,
    color: '#06B6D4', // Cyan
    subItems: [
      { label: 'Complaints & Suggestions', path: '/communication/complaints' },
      { label: 'Events & Holidays', path: '/communication/events' },
    ],
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    color: '#64748B', // Slate Grey
    subItems: [
      { label: 'School Profile', path: '/settings/profile' },
    ],
  },
]