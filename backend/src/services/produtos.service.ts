import { Produto, ProdutoInput } from '../types.js'
import { produtosStore } from '../data/produtos.store.js'

export const produtosService = {
  listarTodos(): Produto[] {
    return produtosStore.listar()
  },

  criar(dados: ProdutoInput): Produto {
    const novo: Produto = {
      id: produtosStore.gerarId(),
      nome: dados.nome,
      preco: dados.preco,
    }
    produtosStore.inserir(novo)
    return novo
  },

  atualizar(id: number, dados: ProdutoInput): Produto | null {
    const atualizado: Produto = { id, nome: dados.nome, preco: dados.preco }
    return produtosStore.atualizar(id, atualizado)
  },

  remover(id: number): boolean {
    return produtosStore.remover(id)
  },
}