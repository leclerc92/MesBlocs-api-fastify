import { PrismaClient } from "@prisma/client";
import { SessionQuery, CreateSessionInput, UpdateSessionInput, SessionResponse, SessionStats } from "../models/session.model";

export class SessionService {
    constructor(private prisma: PrismaClient) {}

    async getAllSessions(query: SessionQuery) {
        const { page = 1, limit = 100, dateFrom, dateTo } = query
        const skip = (page - 1) * limit

        const where: any = {}
        
        if (dateFrom || dateTo) {
            where.date = {}
            if (dateFrom) {
                where.date.gte = new Date(dateFrom)
            }
            if (dateTo) {
                where.date.lte = new Date(dateTo)
            }
        }

        const [sessions, total] = await Promise.all([
            this.prisma.session.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    date: true,
                    createdAt: true,
                    _count: {
                        select: { blocs: true }
                    }
                },
                orderBy: { date: 'desc' }
            }),
            this.prisma.session.count({ where })
        ])

        return {
            sessions,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    }

    async getSessionById(id: number): Promise<SessionResponse | null> {
        const session = await this.prisma.session.findUnique({
            where: { id },
            select: {
                id: true,
                date: true,
                createdAt: true,
                blocs: {
                    select: {
                        id: true,
                        sessionId: true,
                        difficulty: true,
                        style: true,
                        retry: true,
                        terminate: true,
                        createdAt: true
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        return session
    }

    async createSession(sessionData: CreateSessionInput): Promise<SessionResponse> {
        return await this.prisma.session.create({
            data: {
                date: sessionData.date
            },
            select: {
                id: true,
                date: true,
                createdAt: true
            }
        })
    }

    async updateSession(id: number, sessionData: UpdateSessionInput): Promise<SessionResponse | null> {
        try {
            return await this.prisma.session.update({
                where: { id },
                data: sessionData,
                select: {
                    id: true,
                    date: true,
                    createdAt: true
                }
            })
        } catch (error: any) {
            if (error.code === 'P2025') {
                return null
            }
            throw error
        }
    }

    async deleteSession(id: number): Promise<boolean> {
        try {
            // Le cascade delete supprimera automatiquement les blocs associés
            await this.prisma.session.delete({ where: { id } })
            return true
        } catch (error: any) {
            if (error.code === 'P2025') {
                return false
            }
            throw error
        }
    }

    async getSessionStats(): Promise<SessionStats> {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        const [total, thisWeek, thisMonth, totalBlocs] = await Promise.all([
            this.prisma.session.count(),
            this.prisma.session.count({ 
                where: { createdAt: { gte: weekAgo } } 
            }),
            this.prisma.session.count({ 
                where: { createdAt: { gte: monthAgo } } 
            }),
            this.prisma.bloc.count()
        ])

        return {
            total,
            thisWeek,
            thisMonth,
            totalBlocs
        }
    }

    async getSessionWithBlocsCount(id: number) {
        return await this.prisma.session.findUnique({
            where: { id },
            select: {
                id: true,
                date: true,
                createdAt: true,
                _count: {
                    select: { blocs: true }
                }
            }
        })
    }

    async getSessionsByDateRange(startDate: Date, endDate: Date) {
        return await this.prisma.session.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                date: true,
                createdAt: true,
                blocs: {
                    select: {
                        id: true,
                        difficulty: true,
                        style: true,
                        retry: true,
                        terminate: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        })
    }
}