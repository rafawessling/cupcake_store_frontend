import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

// variante: 'primario' | 'secundario' | 'link'. `to` renderiza um <Link>.
const Button = forwardRef(function Button({
  variante = 'primario',
  bloco = false,
  carregando = false,
  carregandoTexto = 'Aguarde…',
  to,
  children,
  className = '',
  ...rest
}, ref) {
  const classe = `btn btn--${variante}${bloco ? ' btn--bloco' : ''} ${className}`.trim()
  if (to) {
    return (
      <Link ref={ref} to={to} className={classe} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} type="button" className={classe} {...rest} disabled={rest.disabled || carregando}>
      {carregando ? (
        <>
          <span className="spinner" aria-hidden="true" />
          {carregandoTexto}
        </>
      ) : (
        children
      )}
    </button>
  )
})

export default Button
