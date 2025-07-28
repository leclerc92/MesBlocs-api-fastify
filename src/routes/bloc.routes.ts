import { FastifyInstance } from 'fastify'
import { BlocService } from '../services/bloc.service'
import { CreateBlocInput, UpdateBlocInput, BlocQuery } from '../models/bloc.model'

export async function blocRoutes(fastify: FastifyInstance) {
    const blocService = new BlocService(fastify.prisma)

    // GET /api/blocs - Liste des blocs
    fastify.get('/api/blocs', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    sessionId: { type: 'number' },
                    difficulty: { type: 'number' },
                    style: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const result = await blocService.getAllBlocs(request.query as BlocQuery);
            return result
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/blocs/:id - Bloc par ID
    fastify.get('/api/blocs/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const blocId = parseInt(id)

        if (!blocId || blocId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const bloc = await blocService.getBlocById(blocId)
            if (!bloc) {
                return reply.code(404).send({ error: 'Bloc non trouvé' })
            }
            return bloc
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // POST /api/blocs - Créer bloc
    fastify.post('/api/blocs', {
        schema: {
            body: {
                type: 'object',
                required: ['sessionId', 'difficulty', 'style', 'retry', 'terminate'],
                properties: {
                    sessionId: { type: 'number' },
                    difficulty: { type: 'number', minimum: 1, maximum: 10 },
                    style: { type: 'string', minLength: 1 },
                    retry: { type: 'number', minimum: 0 },
                    terminate: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const bloc = await blocService.createBloc(request.body as CreateBlocInput)
            return reply.code(201).send(bloc)
        } catch (error: any) {
            fastify.log.error(error)
            if (error.message.includes('Session non trouvée')) {
                return reply.code(404).send({ error: error.message })
            }
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // PUT /api/blocs/:id - Modifier bloc
    fastify.put('/api/blocs/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    difficulty: { type: 'number', minimum: 1, maximum: 10 },
                    style: { type: 'string', minLength: 1 },
                    retry: { type: 'number', minimum: 0 },
                    terminate: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const blocId = parseInt(id)

        if (!blocId || blocId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const bloc = await blocService.updateBloc(blocId, request.body as UpdateBlocInput)
            if (!bloc) {
                return reply.code(404).send({ error: 'Bloc non trouvé' })
            }
            return bloc
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // DELETE /api/blocs/:id - Supprimer bloc
    fastify.delete('/api/blocs/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const blocId = parseInt(id)

        if (!blocId || blocId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const deleted = await blocService.deleteBloc(blocId)
            if (!deleted) {
                return reply.code(404).send({ error: 'Bloc non trouvé' })
            }
            return { message: 'Bloc supprimé' }
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

}