import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { IconMais, IconSeta } from '../components/Icons'
import Layout from '../components/Layout'
import ProductImage from '../components/ProductImage'
import Skeleton from '../components/Skeleton'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatarPreco } from '../utils/format'

export default function Produto() {
  const { id } = useParams()
  const { itens, adicionar, MAX } = useCart()
  const toast = useToast()
  const [produto, setProduto] = useState(null)
  const [estado, setEstado] = useState('carregando') // carregando | ok | naoEncontrado | erro

  const carregar = useCallback(() => {
    let cancelado = false
    setEstado('carregando')
    api
      .obterProduto(id)
      .then((p) => {
        if (cancelado) return
        setProduto(p)
        setEstado('ok')
      })
      .catch((err) => {
        if (cancelado) return
        setEstado(err.status === 404 || err.status === 400 ? 'naoEncontrado' : 'erro')
      })
    return () => {
      cancelado = true
    }
  }, [id])

  useEffect(() => carregar(), [carregar])

  const noCarrinho = itens.find((i) => i.id === produto?.id)?.quantidade || 0
  const noLimite = noCarrinho >= MAX

  function handleAdicionar() {
    adicionar(produto)
    toast.sucesso('Adicionado ao carrinho!', `${produto.nome} foi adicionado.`)
  }

  return (
    <Layout voltar>
      {estado === 'carregando' && (
        <div className="detalhe" aria-busy="true">
          <Skeleton className="skeleton--img" />
          <div className="detalhe__info">
            <Skeleton className="skeleton--linha" />
            <Skeleton className="skeleton--linha" />
            <Skeleton className="skeleton--linha skeleton--curta" />
          </div>
        </div>
      )}
      {estado === 'naoEncontrado' && (
        <EmptyState erro titulo="Cupcake não encontrado.">
          <Button to="/">Voltar ao catálogo</Button>
        </EmptyState>
      )}
      {estado === 'erro' && (
        <EmptyState erro titulo="Não foi possível carregar o cupcake.">
          <Button onClick={carregar}>Tentar novamente</Button>
        </EmptyState>
      )}
      {estado === 'ok' && (
        <article className="detalhe">
          <ProductImage produto={produto} className="detalhe__img" />
          <div className="detalhe__info">
            <Button to="/" variante="link" className="detalhe__voltar-topo">
              <IconSeta width={18} height={18} /> Voltar ao catálogo
            </Button>
            <h1>{produto.nome}</h1>
            <p className="detalhe__descricao">{produto.descricao}</p>
            <div className="detalhe__compra">
              <p className="detalhe__preco">{formatarPreco(produto.preco)}</p>
              <Button onClick={handleAdicionar} disabled={noLimite}>
                {noLimite ? (
                  'Limite de 99 unidades'
                ) : (
                  <>
                    Adicionar ao carrinho <IconMais width={18} height={18} />
                  </>
                )}
              </Button>
            </div>
            <Button to="/" variante="secundario" className="detalhe__voltar">
              Voltar ao catálogo
            </Button>
          </div>
        </article>
      )}
    </Layout>
  )
}
