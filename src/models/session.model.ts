
import { BlocResponse } from './bloc.model'

export interface CreateSessionInput {
    date: Date
}

export interface UpdateSessionInput {
    date?: Date
}

export interface SessionResponse {
    id: number
    date: Date
    createdAt: Date
    blocs?: BlocResponse[]
}

export interface SessionQuery {
    page?: number
    limit?: number
    dateFrom?: string
    dateTo?: string
}

export interface SessionStats {
    total: number
    thisWeek: number
    thisMonth: number
    totalBlocs: number
}