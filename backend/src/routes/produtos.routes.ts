import { FastifyInstance } from 'fastify'
import { ProdutoInput } from '../types.js'
import { produtosService } from '../services/produtos.service.js'

export default async function produtosRoutes(fastify: FastifyInstance) {
  // READ
  fastify.get('/produtos', async () => {
    return produtosService.listarTodos()
  })

  // CREATE
  fastify.post<{ Body: ProdutoInput }>('/produtos', async (request, reply) => {
    const novo = produtosService.criar(request.body)
    return reply.code(201).send(novo)
  })

  // UPDATE
  fastify.put<{ Params: { id: string }; Body: ProdutoInput }>(
    '/produtos/:id',
    async (request, reply) => {
      const id = Number(request.params.id)
      const atualizado = produtosService.atualizar(id, request.body)
      if (!atualizado) return reply.code(404).send({ erro: 'Não encontrado' })
      return atualizado
    },
  )

  // DELETE
  fastify.delete<{ Params: { id: string } }>('/produtos/:id', async (request, reply) => {
    const id = Number(request.params.id)
    const removido = produtosService.remover(id)
    if (!removido) return reply.code(404).send({ erro: 'Não encontrado' })
    return reply.code(204).send()
  })
}