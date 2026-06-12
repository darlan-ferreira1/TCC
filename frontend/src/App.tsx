/* function App() {
  return (
    <>
    testezinho
    </>
  )
}

export default App */

import { useState, useEffect } from 'react'

type Produto = {
  id: number
  nome: string
  preco: number
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')

  // READ — roda uma vez quando a página carrega
  useEffect(() => {
    fetch('/api/produtos')
      .then((res) => res.json())
      .then((data: Produto[]) => setProdutos(data))
  }, [])

  // CREATE
  async function adicionar() {
    if (!nome || !preco) return
    const res = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, preco: Number(preco) }),
    })
    const novo: Produto = await res.json()
    setProdutos((prev) => [...prev, novo])
    setNome('')
    setPreco('')
  }

  // DELETE
  async function remover(id: number) {
    await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
    setProdutos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Produtos</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Preço" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
        <button onClick={adicionar}>Adicionar</button>
      </div>

      <ul>
        {produtos.map((p) => (
          <li key={p.id} style={{ marginBottom: 8 }}>
            {p.nome} — R$ {p.preco}{' '}
            <button onClick={() => remover(p.id)}>remover</button>
          </li>
        ))}
      </ul>
    </div>

        <div>        
          cesta
        </div>
  </>
  )
}