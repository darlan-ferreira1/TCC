import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import produtosRoutes from './routes/produtos.routes.js'

export async function build() {
  const fastify = Fastify({ logger: true })

  // Plugins de infraestrutura
  await fastify.register(cors, { origin: 'http://localhost:5173' })
  await fastify.register(swagger, {
    openapi: { info: { title: 'API - TCC', version: '1.0.0' } },
  })
  await fastify.register(swaggerUi, { routePrefix: '/docs' })

  // Rotas da aplicação, todas sob o prefixo /api
  await fastify.register(produtosRoutes, { prefix: '/api' })

  return fastify
}