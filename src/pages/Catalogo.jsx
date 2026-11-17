import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import Skeleton from '../components/Skeleton'
import { SearchInput } from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { primeiroNome } from '../utils/format'

export default function Catalogo() {
  const { usuario } = useAuth()
  const [params, setParams] = useSearchParams()
  const busca = params.get('busca') || ''
  const [produtos, setProdutos] = useState(null)
  const [erro, setErro] = useState(false)

  const carregar = useCallback(() => {
    let cancelado = false
    setErro(false)
    setProdutos(null)
    api
      .listarProdutos(busca)
      .then((lista) => !cancelado && setProdutos(lista))
      .catch(() => !cancelado && setErro(true))
    return () => {
      cancelado = true
    }
  }, [busca])

  useEffect(() => carregar(), [carregar])

  const limparBusca = () => setParams({}, { replace: true })

  return (
    <Layout comBusca>
      <section className="boas-vindas">
        <h1>Olá, {primeiroNome(usuario?.nome)}!</h1>
        <p>Hoje é dia de se presentear!</p>
      </section>

      <div className="busca-mobile">
        <SearchInput />
      </div>

      <div className="faixa">Confira as opções para deixar o seu dia melhor em apenas 3 mordidas</div>

      <div className="secao-titulo">
        <h2>Nossos cupcakes</h2>
        {produtos && produtos.length > 0 && (
          <span>
            {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
          </span>
        )}
      </div>

      {erro ? (
        <EmptyState erro titulo="Não foi possível carregar os cupcakes.">
          <Button onClick={carregar}>Tentar novamente</Button>
        </EmptyState>
      ) : !produtos ? (
        <div className="grade" aria-busy="true" aria-label="Carregando cupcakes">
          {Array.from({ length: 8 }, (_, i) => (
            <div className="card-produto" key={i}>
              <Skeleton className="skeleton--img" />
              <Skeleton className="skeleton--linha" />
              <Skeleton className="skeleton--linha skeleton--curta" />
            </div>
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <EmptyState titulo="Nenhum cupcake encontrado" texto="Tente buscar por outro nome.">
          {busca && (
            <Button variante="secundario" onClick={limparBusca}>
              Limpar busca
            </Button>
          )}
        </EmptyState>
      ) : (
        <div className="grade">
          {produtos.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </Layout>
  )
}
