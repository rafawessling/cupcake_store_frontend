import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)
const MAX = 99

function reducer(itens, acao) {
  switch (acao.tipo) {
    case 'adicionar': {
      const existe = itens.find((i) => i.id === acao.produto.id)
      if (existe) {
        return itens.map((i) =>
          i.id === existe.id ? { ...i, quantidade: Math.min(MAX, i.quantidade + 1) } : i,
        )
      }
      const { id, nome, preco, imagem_url } = acao.produto
      return [...itens, { id, nome, preco, imagem_url, quantidade: 1 }]
    }
    case 'quantidade':
      return itens.map((i) =>
        i.id === acao.id ? { ...i, quantidade: Math.min(MAX, Math.max(1, acao.quantidade)) } : i,
      )
    case 'remover':
      return itens.filter((i) => i.id !== acao.id)
    case 'limpar':
      return []
    default:
      return itens
  }
}

export function CartProvider({ children }) {
  const [itens, dispatch] = useReducer(reducer, [])

  const adicionar = useCallback((produto) => dispatch({ tipo: 'adicionar', produto }), [])
  const alterarQuantidade = useCallback(
    (id, quantidade) => dispatch({ tipo: 'quantidade', id, quantidade }),
    [],
  )
  const remover = useCallback((id) => dispatch({ tipo: 'remover', id }), [])
  const limpar = useCallback(() => dispatch({ tipo: 'limpar' }), [])

  const valor = useMemo(() => {
    const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0)
    // Em centavos para evitar erros de ponto flutuante. Total apenas informativo.
    const subtotal = itens.reduce((s, i) => s + Math.round(i.preco * 100) * i.quantidade, 0) / 100
    return { itens, quantidadeTotal, subtotal, total: subtotal, adicionar, alterarQuantidade, remover, limpar, MAX }
  }, [itens, adicionar, alterarQuantidade, remover, limpar])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
