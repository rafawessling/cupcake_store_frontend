import { useState } from 'react'
import { IconOlho, IconOlhoCortado } from './Icons'

export function Input({ id, rotulo, erro, ...rest }) {
  const erroId = `${id}-erro`
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <input
        id={id}
        className="input"
        aria-invalid={erro ? 'true' : undefined}
        aria-describedby={erro ? erroId : undefined}
        {...rest}
      />
      {erro && (
        <p id={erroId} className="campo__erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

export function PasswordInput({ id, rotulo, erro, ...rest }) {
  const [visivel, setVisivel] = useState(false)
  const erroId = `${id}-erro`
  return (
    <div className="campo">
      <label htmlFor={id}>{rotulo}</label>
      <div className="input-senha">
        <input
          id={id}
          className="input"
          type={visivel ? 'text' : 'password'}
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? erroId : undefined}
          {...rest}
        />
        <button
          type="button"
          className="input-senha__olho"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
        >
          {visivel ? <IconOlhoCortado /> : <IconOlho />}
        </button>
      </div>
      {erro && (
        <p id={erroId} className="campo__erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}

export function Checkbox({ id, erro, children, ...rest }) {
  const erroId = `${id}-erro`
  return (
    <div className="campo">
      <label className="checkbox" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          aria-invalid={erro ? 'true' : undefined}
          aria-describedby={erro ? erroId : undefined}
          {...rest}
        />
        <span>{children}</span>
      </label>
      {erro && (
        <p id={erroId} className="campo__erro" role="alert">
          {erro}
        </p>
      )}
    </div>
  )
}
