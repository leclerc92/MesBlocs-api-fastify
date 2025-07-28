import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { CreateUserInput, UpdateUserInput, UserResponse, UserQuery, UserStats } from '../models/user.model'

export class UserService {
    constructor(private prisma: PrismaClient) {}

    async getAllUsers(query: UserQuery) {
        const { page = 1, limit = 10, search } = query
        const skip = (page - 1) * limit

        const where = search ? {
            OR: [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } }
            ]
        } : {}

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ])

        return {
            users,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    }

    async getUserById(id: number): Promise<UserResponse | null> {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true
            }
        })
    }

    async createUser(userData: CreateUserInput): Promise<UserResponse> {
        const exists = await this.prisma.user.findUnique({ 
            where: { email: userData.email } 
        })
        
        if (exists) {
            throw new Error('Email déjà utilisé')
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12)
        
        return await this.prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isActive: true
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true
            }
        })
    }

    async updateUser(id: number, userData: UpdateUserInput): Promise<UserResponse | null> {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: userData,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
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

    async deleteUser(id: number): Promise<boolean> {
        try {
            await this.prisma.user.update({
                where: { id },
                data: { isActive: false }
            })
            return true
        } catch (error: any) {
            if (error.code === 'P2025') {
                return false
            }
            throw error
        }
    }

    async getUserStats(): Promise<UserStats> {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const [total, active, inactive, recent] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { isActive: false } }),
            this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } })
        ])

        return { total, active, inactive, recentlyCreated: recent }
    }
}