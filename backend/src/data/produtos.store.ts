import { Produto } from '../types.js'

// O "banco de dados" em memória vive aqui, isolado
let produtos: Produto[] = [
  { id: 1, nome: 'Teclado', preco: 150 },
  { id: 2, nome: 'Mouse', preco: 80 },
]
let proximoId = 3

export const produtosStore = {
  listar(): Produto[] {
    return produtos
  },

  buscarPorId(id: number): Produto | undefined {
    return produtos.find((p) => p.id === id)
  },

  inserir(produto: Produto): void {
    produtos.push(produto)
  },

  atualizar(id: number, dados: Produto): Produto | null {
    const index = produtos.findIndex((p) => p.id === id)
    if (index === -1) return null
    produtos[index] = dados
    return dados
  },

  remover(id: number): boolean {
    const tamanhoAntes = produtos.length
    produtos = produtos.filter((p) => p.id !== id)
    return produtos.length < tamanhoAntes
  },

  gerarId(): number {
    return proximoId++
  },
}