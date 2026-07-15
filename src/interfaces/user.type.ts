import type { Gender } from "../enums/Gender"
import type { UserRole } from "../enums/UserRole"
import type { UserStatus } from "../enums/UserStatus"

export interface User {
    id: string
    schoolId: string
    username: string
    email: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    gender: Gender
    role: UserRole
    status: UserStatus
}