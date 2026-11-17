import { useRef } from 'react'
import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) {
  const cancelarRef = useRef(null)
  return (
    <Modal aberto={aberto} onFechar={onCancelar} titulo={titulo} descricao={descricao} focoInicial={cancelarRef}>
      <div className="modal__acoes">
        <Button ref={cancelarRef} variante="secundario" onClick={onCancelar}>
          {textoCancelar}
        </Button>
        <Button onClick={onConfirmar}>{textoConfirmar}</Button>
      </div>
    </Modal>
  )
}
