import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { userRoutes } from './routes/user.routes'
import { sessionRoutes } from './routes/session.routes'
import { blocRoutes } from './routes/bloc.routes'

// Configuration simple
const fastify = Fastify({
    logger: process.env.NODE_ENV !== 'production' ? {
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    } : true
})

// Prisma client
const prisma = new PrismaClient()

// Décorer Fastify avec Prisma pour l'utiliser dans les routes
fastify.decorate('prisma', prisma)

// Typage pour TypeScript
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient
    }
}

// CORS simple
fastify.register(import('@fastify/cors'), {
    origin: true
})

// Health check
fastify.get('/health', async () => {
    return { status: 'OK', timestamp: new Date().toISOString() }
})

// Enregistrer les routes
fastify.register(userRoutes)
fastify.register(sessionRoutes)
fastify.register(blocRoutes)

// ========================================
// DÉMARRAGE SERVEUR
// ========================================

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3001')
        const host = process.env.HOST || '0.0.0.0'

        await fastify.listen({ port, host })
        console.log(`🚀 Serveur démarré sur http://${host}:${port}`)
        console.log(`🏥 Health: http://${host}:${port}/health`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

// Graceful shutdown
process.on('SIGTERM', () => fastify.close())
process.on('SIGINT', () => fastify.close())

start()