export type Produto = {
  id: number
  nome: string
  preco: number
}

// O que o cliente envia ao criar/atualizar (sem o id, que o servidor gera)
export type ProdutoInput = {
  nome: string
  preco: number
}