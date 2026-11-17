import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { IconLixeira } from '../components/Icons'
import Layout from '../components/Layout'
import ProductImage from '../components/ProductImage'
import QuantityStepper from '../components/QuantityStepper'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatarPreco } from '../utils/format'

export default function Carrinho() {
  const { itens, quantidadeTotal, subtotal, total, alterarQuantidade, remover, limpar, MAX } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)

  async function finalizar() {
    if (enviando || itens.length === 0) return
    setEnviando(true)
    try {
      const pedido = await api.criarPedido(itens)
      limpar() // só após o 201
      toast.sucesso('Pedido confirmado!', 'Seu cupcake está a caminho!')
      navigate(`/pedido/${pedido.id}/sucesso`, { state: { pedido } })
    } catch (err) {
      if (err.status === 401) return // sessão expirada: tratada pelo AuthContext
      toast.erro('Oops! Algo deu errado.', 'Não foi possível concluir o pedido.')
      navigate('/pedido/erro', { state: { mensagem: err.message } })
    }
  }

  return (
    <Layout voltar>
      <h1 className="titulo-pagina">
        Seu carrinho doce <span aria-hidden="true">🧁</span>
      </h1>

      {itens.length === 0 ? (
        <EmptyState titulo="Seu carrinho está vazio" texto="Que tal escolher um cupcake?">
          <Button to="/">Ver catálogo</Button>
        </EmptyState>
      ) : (
        <div className="carrinho">
          <section aria-label="Itens do carrinho">
            <p className="carrinho__contagem">
              {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
            </p>
            <ul className="carrinho__lista">
              {itens.map((item) => (
                <li key={item.id} className="item">
                  <ProductImage produto={item} className="item__img" />
                  <div className="item__info">
                    <Link to={`/produto/${item.id}`} className="item__nome">
                      {item.nome}
                    </Link>
                    <span className="item__preco">{formatarPreco(item.preco)}</span>
                    <QuantityStepper
                      nome={item.nome}
                      quantidade={item.quantidade}
                      max={MAX}
                      onChange={(q) => alterarQuantidade(item.id, q)}
                    />
                  </div>
                  <span className="item__subtotal">{formatarPreco(item.preco * item.quantidade)}</span>
                  <button
                    type="button"
                    className="item__remover"
                    onClick={() => remover(item.id)}
                    aria-label={`Remover ${item.nome}`}
                  >
                    <IconLixeira />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <aside className="resumo" aria-label="Resumo do pedido">
            <h2>Resumo do pedido</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatarPreco(subtotal)}</dd>
              </div>
              <div className="resumo__total">
                <dt>Total</dt>
                <dd>{formatarPreco(total)}</dd>
              </div>
            </dl>
            <Button bloco onClick={finalizar} carregando={enviando} carregandoTexto="Finalizando…" disabled={itens.length === 0}>
              Finalizar pedido
            </Button>
            <Button bloco variante="secundario" to="/">
              Continuar comprando
            </Button>
          </aside>
        </div>
      )}
    </Layout>
  )
}
