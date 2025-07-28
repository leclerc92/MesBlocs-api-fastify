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

export interface BlocResponse {
    id: number
    sessionId: number
    difficulty: number
    style: string
    retry: number
    terminate: boolean
    createdAt: Date
    score?:number
}

export interface BlocQuery {
    page?: number
    limit?: number
    sessionId?: number
    difficulty?: number
    style?: string
}

export interface BlocStats {
    total: number
    byDifficulty: Record<number, number>
    byStyle: Record<string, number>
    avgRetry: number
    terminateRate: number
}