import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const FOCAVEIS = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Modal acessível: role=dialog, aria-modal, foco preso, Esc e clique no fundo fecham,
// foco volta ao elemento que abriu. `focoInicial` (ref) escolhe o elemento focado ao abrir.
export default function Modal({ aberto, onFechar, titulo, descricao, focoInicial, children }) {
  const dialogoRef = useRef(null)
  const gatilhoRef = useRef(null)
  const iniciouNoFundo = useRef(false)
  const idTitulo = 'modal-titulo'
  const idDescricao = 'modal-descricao'

  useEffect(() => {
    if (!aberto) return undefined
    gatilhoRef.current = document.activeElement
    const sobrescrita = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const alvo = focoInicial?.current || dialogoRef.current
    alvo.focus()

    function aoTeclar(ev) {
      if (ev.key === 'Escape') {
        ev.stopPropagation()
        onFechar()
        return
      }
      if (ev.key !== 'Tab') return
      const itens = dialogoRef.current.querySelectorAll(FOCAVEIS)
      if (!itens.length) return
      const primeiro = itens[0]
      const ultimo = itens[itens.length - 1]
      if (ev.shiftKey && document.activeElement === primeiro) {
        ev.preventDefault()
        ultimo.focus()
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault()
        primeiro.focus()
      } else if (!dialogoRef.current.contains(document.activeElement)) {
        ev.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = sobrescrita
      // Devolve o foco ao gatilho (se ainda estiver na página).
      if (gatilhoRef.current?.isConnected) gatilhoRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto])

  if (!aberto) return null

  return createPortal(
    <div
      className="modal-fundo"
      onMouseDown={(ev) => {
        iniciouNoFundo.current = ev.target === ev.currentTarget
      }}
      onClick={(ev) => {
        // Fecha só se o clique começou e terminou no fundo; o foco volta depois do clique.
        if (iniciouNoFundo.current && ev.target === ev.currentTarget) onFechar()
      }}
    >
      <div
        ref={dialogoRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descricao ? idDescricao : undefined}
        tabIndex={-1}
      >
        <h2 id={idTitulo} className="modal__titulo">
          {titulo}
        </h2>
        {descricao && (
          <p id={idDescricao} className="modal__texto">
            {descricao}
          </p>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
