import { FastifyInstance } from 'fastify'
import { SessionService } from '../services/session.service'
import { CreateSessionInput, UpdateSessionInput, SessionQuery } from '../models/session.model'

export async function sessionRoutes(fastify: FastifyInstance) {
    const sessionService = new SessionService(fastify.prisma)

    // GET /api/sessions - Liste des sessions
    fastify.get('/api/sessions', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    dateFrom: { type: 'string', format: 'date' },
                    dateTo: { type: 'string', format: 'date' },
                    orderBy: { type: 'string', enum: ['date', 'difficulty', 'style', 'retry', 'terminate'] },
                }
            }
        }
    }, async (request, reply) => {
        try {
            const result = await sessionService.getAllSessions(request.query as SessionQuery)
            return result
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/sessions/:id - Session par ID avec ses blocs
    fastify.get('/api/sessions/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const sessionId = parseInt(id)

        if (!sessionId || sessionId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const session = await sessionService.getSessionById(sessionId)
            if (!session) {
                return reply.code(404).send({ error: 'Session non trouvée' })
            }
            return session
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // POST /api/sessions - Créer session
    fastify.post('/api/sessions', {
        schema: {
            body: {
                type: 'object',
                required: ['date'],
                properties: {
                    date: { type: 'string', format: 'date-time' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { date } = request.body as { date: string }
            const sessionData: CreateSessionInput = {
                date: new Date(date)
            }
            
            const session = await sessionService.createSession(sessionData)
            return reply.code(201).send(session)
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // PUT /api/sessions/:id - Modifier session
    fastify.put('/api/sessions/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    date: { type: 'string', format: 'date-time' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const sessionId = parseInt(id)

        if (!sessionId || sessionId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const updateData: UpdateSessionInput = {}
            const { date } = request.body as { date?: string }
            
            if (date) {
                updateData.date = new Date(date)
            }

            const session = await sessionService.updateSession(sessionId, updateData)
            if (!session) {
                return reply.code(404).send({ error: 'Session non trouvée' })
            }
            return session
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // DELETE /api/sessions/:id - Supprimer session (cascade des blocs)
    fastify.delete('/api/sessions/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const sessionId = parseInt(id)

        if (!sessionId || sessionId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const deleted = await sessionService.deleteSession(sessionId)
            if (!deleted) {
                return reply.code(404).send({ error: 'Session non trouvée' })
            }
            return { message: 'Session et ses blocs supprimés' }
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/sessions/stats - Statistiques des sessions
    fastify.get('/api/sessions/stats', async (request, reply) => {
        try {
            const stats = await sessionService.getSessionStats()
            return stats
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/sessions/:id/count - Session avec nombre de blocs
    fastify.get('/api/sessions/:id/count', async (request, reply) => {
        const { id } = request.params as { id: string }
        const sessionId = parseInt(id)

        if (!sessionId || sessionId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const session = await sessionService.getSessionWithBlocsCount(sessionId)
            if (!session) {
                return reply.code(404).send({ error: 'Session non trouvée' })
            }
            return session
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/sessions/range - Sessions dans une période
    fastify.get('/api/sessions/range', {
        schema: {
            querystring: {
                type: 'object',
                required: ['startDate', 'endDate'],
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { startDate, endDate } = request.query as { startDate: string, endDate: string }
            const sessions = await sessionService.getSessionsByDateRange(
                new Date(startDate), 
                new Date(endDate)
            )
            return { sessions }
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })
}