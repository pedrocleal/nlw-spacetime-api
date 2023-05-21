import { FastifyInstance } from "fastify";

import z from 'zod';

import { prisma } from "../lib/prisma";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      }
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 100).concat('...'),
        createdAt: memory.createdAt,
        userId: memory.userId
      }
    })
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    return memory
  })

  app.post('/memories', async (request, response) => {
    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)
  
    const memory = await prisma.memory.create({
      data: {
        content,
        isPublic,
        coverUrl,
        userId: '3ad11fab-1e0d-4ca8-81e6-e1e13fa5e893',
      }
    })

    return response.status(201).send(memory)
  })

  app.put('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      isPublic: z.coerce.boolean().default(false),
      coverUrl: z.string(),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        isPublic,
        coverUrl,
      }
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      }
    })

    return {
      message: 'Memory deleted successfully',
    }
  })
}