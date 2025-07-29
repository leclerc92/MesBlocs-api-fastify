
import {BlocResponseDb} from './bloc.model'
import {SessionPerformance} from "./sessionPerformance.model";

export interface CreateSessionInput {
    date: Date
}

export interface UpdateSessionInput {
    date?: Date
}

export interface SessionResponseBd {
    id: number
    date: Date
    createdAt: Date
    blocs?: BlocResponseDb[]
}

export interface SessionDto {
    id: number
    date: Date
    performance?: SessionPerformance;
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

