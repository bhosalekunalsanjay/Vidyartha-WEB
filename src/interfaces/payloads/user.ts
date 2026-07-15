import type { UserRole } from "../../enums/UserRole"

export interface User {
    pageNumber: number
    pageSize: number
    role: UserRole
    schoolId: string
}