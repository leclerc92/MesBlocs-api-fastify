import {PrismaClient} from "@prisma/client";
import {BlocQuery, CreateBlocInput, UpdateBlocInput, BlocResponse, BlocStats} from "../models/bloc.model";

export class BlocService {
    constructor(private prisma: PrismaClient) {
    }

    async getAllBlocs(query: BlocQuery) {
        const { page = 1, limit = 100, sessionId, difficulty, style } = query
        const skip = (page - 1) * limit

        const where: any = {}
        
        if (sessionId) {
            where.sessionId = sessionId
        }
        
        if (difficulty) {
            where.difficulty = difficulty
        }
        
        if (style) {
            where.style = { contains: style }
        }

        const [blocs, total] = await Promise.all([
            this.prisma.bloc.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    sessionId: true,
                    difficulty: true,
                    style: true,
                    retry: true,
                    terminate: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.bloc.count({ where })
        ])

        return {
            blocs,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    }

    async getBlocById(id: number): Promise<BlocResponse | null> {
        return await this.prisma.bloc.findUnique({
            where: { id },
            select: {
                id: true,
                sessionId: true,
                difficulty: true,
                style: true,
                retry: true,
                terminate: true,
                createdAt: true
            }
        })
    }

    async createBloc(blocData: CreateBlocInput): Promise<BlocResponse> {
        // Vérifier que la session existe
        const session = await this.prisma.session.findUnique({
            where: { id: blocData.sessionId }
        })
        
        if (!session) {
            throw new Error('Session non trouvée')
        }

        return await this.prisma.bloc.create({
            data: {
                sessionId: blocData.sessionId,
                difficulty: blocData.difficulty,
                style: blocData.style,
                retry: blocData.retry,
                terminate: blocData.terminate
            },
            select: {
                id: true,
                sessionId: true,
                difficulty: true,
                style: true,
                retry: true,
                terminate: true,
                createdAt: true
            }
        })
    }

    async updateBloc(id: number, blocData: UpdateBlocInput): Promise<BlocResponse | null> {
        try {
            return await this.prisma.bloc.update({
                where: { id },
                data: blocData,
                select: {
                    id: true,
                    sessionId: true,
                    difficulty: true,
                    style: true,
                    retry: true,
                    terminate: true,
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

    async deleteBloc(id: number): Promise<boolean> {
        try {
            await this.prisma.bloc.delete({ where: { id } })
            return true
        } catch (error: any) {
            if (error.code === 'P2025') {
                return false
            }
            throw error
        }
    }

    async getBlocStats(): Promise<BlocStats> {
        const allBlocs = await this.prisma.bloc.findMany({
            select: {
                difficulty: true,
                style: true,
                retry: true,
                terminate: true
            }
        })

        const total = allBlocs.length
        
        // Statistiques par difficulté
        const byDifficulty: Record<number, number> = {}
        allBlocs.forEach(bloc => {
            byDifficulty[bloc.difficulty] = (byDifficulty[bloc.difficulty] || 0) + 1
        })

        // Statistiques par style
        const byStyle: Record<string, number> = {}
        allBlocs.forEach(bloc => {
            byStyle[bloc.style] = (byStyle[bloc.style] || 0) + 1
        })

        // Moyenne des retry
        const avgRetry = total > 0 
            ? allBlocs.reduce((sum, bloc) => sum + bloc.retry, 0) / total 
            : 0

        // Taux de terminate
        const terminateCount = allBlocs.filter(bloc => bloc.terminate).length
        const terminateRate = total > 0 ? (terminateCount / total) * 100 : 0

        return {
            total,
            byDifficulty,
            byStyle,
            avgRetry: Math.round(avgRetry * 100) / 100, // 2 décimales
            terminateRate: Math.round(terminateRate * 100) / 100 // 2 décimales
        }
    }
}