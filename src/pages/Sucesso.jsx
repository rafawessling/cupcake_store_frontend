import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { IconCheck } from '../components/Icons'
import Layout from '../components/Layout'
import Skeleton from '../components/Skeleton'
import { formatarPreco } from '../utils/format'

export default function Sucesso() {
  const { id } = useParams()
  const { state } = useLocation()
  // Usa o pedido recebido no 201; ao recarregar, busca em GET /api/pedidos/{id}.
  const inicial = state?.pedido && String(state.pedido.id) === id ? state.pedido : null
  const [pedido, setPedido] = useState(inicial)
  const [estado, setEstado] = useState(inicial ? 'ok' : 'carregando')

  useEffect(() => {
    if (inicial) return
    let cancelado = false
    api
      .obterPedido(id)
      .then((p) => {
        if (cancelado) return
        setPedido(p)
        setEstado('ok')
      })
      .catch(() => !cancelado && setEstado('erro'))
    return () => {
      cancelado = true
    }
  }, [id, inicial])

  return (
    <Layout>
      {estado === 'carregando' && (
        <div className="cartao-central" aria-busy="true">
          <Skeleton className="skeleton--linha" />
          <Skeleton className="skeleton--linha" />
          <Skeleton className="skeleton--linha skeleton--curta" />
        </div>
      )}
      {estado === 'erro' && (
        <EmptyState erro titulo="Pedido não encontrado.">
          <Button to="/">Voltar ao catálogo</Button>
        </EmptyState>
      )}
      {estado === 'ok' && (
        <section className="cartao-central">
          <div className="selo selo--sucesso" aria-hidden="true">
            <IconCheck width={36} height={36} />
          </div>
          <h1>Pedido confirmado!</h1>
          <p className="cartao-central__texto">Seu cupcake está a caminho!</p>
          <p className="chip">Pedido nº {pedido.id}</p>
          <ul className="pedido-itens">
            {pedido.itens.map((i) => (
              <li key={i.produto_id}>
                <div>
                  <strong>{i.nome}</strong>
                  <span>
                    {i.quantidade} × {formatarPreco(i.preco_unitario)}
                  </span>
                </div>
                <strong>{formatarPreco(i.subtotal)}</strong>
              </li>
            ))}
          </ul>
          <p className="pedido-total">
            <span>Total</span>
            <span>{formatarPreco(pedido.valor_total)}</span>
          </p>
          <Button to="/">Voltar ao catálogo</Button>
        </section>
      )}
    </Layout>
  )
}
