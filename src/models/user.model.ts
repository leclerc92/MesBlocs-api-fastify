export interface CreateUserInput {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface UpdateUserInput {
    email?: string
    firstName?: string
    lastName?: string
    isActive?: boolean
}

export interface UserResponse {
    id: number
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    createdAt: Date
}

export interface UserQuery {
    page?: number
    limit?: number
    search?: string
}

export interface UserStats {
    total: number
    active: number
    inactive: number
    recentlyCreated: number
}