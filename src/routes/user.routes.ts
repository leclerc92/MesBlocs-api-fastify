import { FastifyInstance } from 'fastify'
import { UserService } from '../services/user.service'
import { CreateUserInput, UpdateUserInput, UserQuery } from '../models/user.model'

export async function userRoutes(fastify: FastifyInstance) {
    const userService = new UserService(fastify.prisma)

    // GET /api/users - Liste des utilisateurs
    fastify.get('/api/users', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'number', default: 1 },
                    limit: { type: 'number', default: 10 },
                    search: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const result = await userService.getAllUsers(request.query as UserQuery)
            return result
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/users/:id - Utilisateur par ID
    fastify.get('/api/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const userId = parseInt(id)

        if (!userId || userId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const user = await userService.getUserById(userId)
            if (!user) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' })
            }
            return user
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // POST /api/users - Créer utilisateur
    fastify.post('/api/users', {
        schema: {
            body: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    firstName: { type: 'string', minLength: 1 },
                    lastName: { type: 'string', minLength: 1 }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const user = await userService.createUser(request.body as CreateUserInput)
            return reply.code(201).send(user)
        } catch (error: any) {
            fastify.log.error(error)
            if (error.message.includes('Email déjà utilisé')) {
                return reply.code(409).send({ error: error.message })
            }
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // PUT /api/users/:id - Modifier utilisateur
    fastify.put('/api/users/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    firstName: { type: 'string', minLength: 1 },
                    lastName: { type: 'string', minLength: 1 },
                    isActive: { type: 'boolean' }
                }
            }
        }
    }, async (request, reply) => {
        const { id } = request.params as { id: string }
        const userId = parseInt(id)

        if (!userId || userId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const user = await userService.updateUser(userId, request.body as UpdateUserInput)
            if (!user) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' })
            }
            return user
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // DELETE /api/users/:id - Supprimer utilisateur (soft delete)
    fastify.delete('/api/users/:id', async (request, reply) => {
        const { id } = request.params as { id: string }
        const userId = parseInt(id)

        if (!userId || userId < 1) {
            return reply.code(400).send({ error: 'ID invalide' })
        }

        try {
            const deleted = await userService.deleteUser(userId)
            if (!deleted) {
                return reply.code(404).send({ error: 'Utilisateur non trouvé' })
            }
            return { message: 'Utilisateur désactivé' }
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })

    // GET /api/users/stats - Statistiques
    fastify.get('/api/users/stats', async (request, reply) => {
        try {
            const stats = await userService.getUserStats()
            return stats
        } catch (error: any) {
            fastify.log.error(error)
            return reply.code(500).send({ error: 'Erreur serveur' })
        }
    })
}