import {PrismaClient} from "@prisma/client";
import {BlocQuery, CreateBlocInput, UpdateBlocInput, BlocResponseDb, BlocDto} from "../models/bloc.model";

export class BlocService {
    constructor(private prisma: PrismaClient) {
    }

    async getAllBlocs(query: BlocQuery) {
        const { sessionId, difficulty, style } = query
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

        const [blocs] = await Promise.all([
            this.prisma.bloc.findMany({
                where,
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

        return  this.convertBlocsToDto(blocs)

    }

    async getBlocById(id: number): Promise<BlocDto | null> {
        const bloc = await this.prisma.bloc.findUnique({
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

        if (!bloc) {
            return null
        }
        return this.convertBlocToDto(bloc);
    }

    async createBloc(blocData: CreateBlocInput): Promise<BlocDto> {
        // Vérifier que la session existe
        const session = await this.prisma.session.findUnique({
            where: { id: blocData.sessionId }
        })
        
        if (!session) {
            throw new Error('Session non trouvée')
        }

        const bloc =  await this.prisma.bloc.create({
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

        return this.convertBlocToDto(bloc);
    }

    async updateBloc(id: number, blocData: UpdateBlocInput): Promise<BlocDto | null> {
        try {
            const bloc =  await this.prisma.bloc.update({
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
            if (!bloc) {
                return null
            }
            return this.convertBlocToDto(bloc);

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

    convertBlocsToDto(blocs: BlocResponseDb[]): BlocDto[] {
        return blocs.map(bloc => ({
            ...bloc,
            score: BlocService.calculBlocScore(bloc)
        }))
    }

    convertBlocToDto(bloc:BlocResponseDb): BlocDto {
        return {
            ...bloc,
            score: BlocService.calculBlocScore(bloc)
        }
    }

    static calculBlocScore(bloc: BlocResponseDb) : number {
        const { difficulty, style, retry, terminate } = bloc
        const tryFacteur:number = retry === 0 ? 1 : retry;
        const typeFacteur:number = style === "DE" ? 1.2 : 1;
        const terminateFacteur:number  =terminate ? 1.1 : 1;

        return difficulty * 2 * (1 + 0.7 / tryFacteur) * typeFacteur * terminateFacteur;
    }
}