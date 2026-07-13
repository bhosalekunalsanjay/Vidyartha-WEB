export interface AcademicYearItem {
  id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  status: 'Active' | 'Inactive'
}
