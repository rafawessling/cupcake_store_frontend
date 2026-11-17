import { Link } from 'react-router-dom'
import { formatarPreco } from '../utils/format'
import Button from './Button'
import ProductImage from './ProductImage'

export default function ProductCard({ produto }) {
  return (
    <article className="card-produto">
      <ProductImage produto={produto} />
      <h3 className="card-produto__nome" title={produto.nome}>
        <Link to={`/produto/${produto.id}`}>{produto.nome}</Link>
      </h3>
      <p className="card-produto__preco">{formatarPreco(produto.preco)}</p>
      <Button to={`/produto/${produto.id}`} bloco>
        Detalhes
      </Button>
    </article>
  )
}
