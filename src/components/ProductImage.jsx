import { useEffect, useState } from 'react'
import { CupcakeSvg } from './Logo'

// Imagem do produto; sem arquivo ou com erro mostra o placeholder de cupcake.
export default function ProductImage({ produto, className = '' }) {
  const [quebrada, setQuebrada] = useState(false)
  useEffect(() => setQuebrada(false), [produto.imagem_url])

  return (
    <div className={`produto-img ${className}`.trim()}>
      {produto.imagem_url && !quebrada ? (
        <img src={produto.imagem_url} alt={produto.nome} loading="lazy" onError={() => setQuebrada(true)} />
      ) : (
        <div className="produto-img__placeholder" role="img" aria-label={produto.nome}>
          <CupcakeSvg tamanho={64} />
        </div>
      )}
    </div>
  )
}
