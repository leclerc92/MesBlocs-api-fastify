export interface CreateBlocInput {
    sessionId: number
    difficulty: number
    style: string
    retry: number
    terminate: boolean
}

export interface UpdateBlocInput {
    difficulty?: number
    style?: string
    retry?: number
    terminate?: boolean
}

export interface BlocResponseDb {
    id: number
    sessionId: number
    difficulty: number
    style: string
    retry: number
    terminate: boolean
    createdAt: Date
}

export interface BlocDto extends BlocResponseDb {
    score: number
}

export interface BlocQuery {
    page?: number
    limit?: number
    sessionId?: number
    difficulty?: number
    style?: string
}
