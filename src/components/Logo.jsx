import { Link } from 'react-router-dom'

export function CupcakeSvg({ tamanho = 32 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M14 34h36l-4 22a3 3 0 0 1-3 2H21a3 3 0 0 1-3-2z" fill="#F0B3B0" />
      <path d="M24 34l2 24M32 34v24M40 34l-2 24" stroke="#EC7680" strokeWidth="1.5" opacity=".6" />
      <path d="M12 34c0-8 6-12 10-13 0-6 5-11 10-11s10 5 10 11c4 1 10 5 10 13z" fill="#EC7680" />
      <circle cx="33" cy="9" r="4" fill="#DA3738" />
    </svg>
  )
}

// Logo (imagem). `grande` é usado nas telas de login/cadastro (sempre o logo vertical).
// No cabeçalho (não `grande`), o celular usa a versão horizontal.
export default function Logo({ grande = false, link = true }) {
  const img = <img src="/img/cupcake_store_logo.png" alt="Cupcake Store" width="338" height="162" />
  const conteudo = grande ? (
    img
  ) : (
    <picture>
      <source media="(max-width: 639px)" srcSet="/img/cupcake_store_logo_mobile.png" />
      {img}
    </picture>
  )
  const classe = `logo${grande ? ' logo--grande' : ''}`
  return link ? (
    <Link to="/" className={classe}>
      {conteudo}
    </Link>
  ) : (
    <div className={classe}>{conteudo}</div>
  )
}
