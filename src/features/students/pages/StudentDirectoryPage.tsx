import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import StudentTable, { type Student } from '../components/StudentTable'
import AddStudentDrawer from '../components/AddStudentDrawer'
import DeleteStudentModal from '../components/DeleteStudentModal'

import { notify } from '../../../store/notification.store'

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 'STU-101', firstName: 'Julian', lastName: 'Vance', class: 'Class 10-A', fees: 'Paid', attendance: 'Present' },
    { id: 'STU-102', firstName: 'Rebecca', lastName: 'Miller', class: 'Class 11-B', fees: 'Pending', attendance: 'Present' },
    { id: 'STU-103', firstName: 'Thomas', lastName: 'Albern', class: 'Class 10-B', fees: 'Paid', attendance: 'Absent' },
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    const handleOpenDrawer = () => {
      setIsDrawerOpen(true)
    }
    window.addEventListener('open-add-student-drawer', handleOpenDrawer)
    return () => window.removeEventListener('open-add-student-drawer', handleOpenDrawer)
  }, [])

  const handleAddTrigger = () => {
    setIsDrawerOpen(true)
  }

  const handleDeleteTrigger = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedStudent) {
      setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id))
      notify.success(`Student record for ${selectedStudent.firstName} ${selectedStudent.lastName} has been deleted.`)
    }
    setIsDeleteModalOpen(false)
    setSelectedStudent(null)
  }

  const handleSaveStudent = (firstName: string, lastName: string, className: string) => {
    const newId = `STU-${Math.floor(100 + Math.random() * 900)}`
    const newStudent: Student = {
      id: newId,
      firstName,
      lastName,
      class: className,
      fees: Math.random() > 0.4 ? 'Paid' : 'Pending',
      attendance: 'Present',
    }

    setStudents((prev) => [...prev, newStudent])
    notify.success(`Student ${firstName} ${lastName} has been added.`)
    setIsDrawerOpen(false)
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <StudentTable
        students={students}
        onAddTrigger={handleAddTrigger}
        onDeleteTrigger={handleDeleteTrigger}
      />

      <AddStudentDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveStudent}
      />

      <DeleteStudentModal
        open={isDeleteModalOpen}
        studentName={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : ''}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedStudent(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}
