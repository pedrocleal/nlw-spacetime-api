import 'dotenv/config'

import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
  origin: true,
  // alterar para o endereço do front em produção
})

app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🔥 Server running on http://localhost:3333')
  })
