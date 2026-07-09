import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import SchoolIcon from '@mui/icons-material/SchoolOutlined'
import PeopleIcon from '@mui/icons-material/PeopleOutlined'
import FinanceIcon from '@mui/icons-material/MonetizationOnOutlined'
import LearnIcon from '@mui/icons-material/AutoStoriesOutlined'

interface NavLeaf {
  label: string
  path: string
  icon?: ComponentType<SvgIconProps>
  subItems?: never
}

interface NavGroup {
  label: string
  path?: never
  icon?: ComponentType<SvgIconProps>
  subItems: NavLeaf[]
}

export type NavItem = NavLeaf | NavGroup

export function isGroup(item: NavItem): item is NavGroup {
  return Array.isArray(item.subItems)
}

export const navConfig: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: DashboardIcon },
  { label: 'Users', path: '/users', icon: PeopleIcon },
  {
    label: 'Students',
    icon: PeopleIcon,
    subItems: [
      { label: 'Student List', path: '/students' },
      { label: 'Attendance', path: '/students/attendance' },
    ],
  },
  { label: 'Teachers', path: '/school', icon: SchoolIcon },
  { label: 'Academic', path: '/learn-hub', icon: LearnIcon },
  {
    label: 'Finance',
    icon: FinanceIcon,
    subItems: [{ label: 'Fees Ledger', path: '/finance' }],
  },
]