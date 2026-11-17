import { IconCheck, IconX } from './Icons'

export default function Toast({ tipo, titulo, texto, onFechar }) {
  const erro = tipo === 'erro'
  return (
    <div className={`toast toast--${tipo}`} role={erro ? 'alert' : 'status'}>
      <span className="toast__icone" aria-hidden="true">
        {erro ? <IconX width={20} height={20} /> : <IconCheck width={20} height={20} />}
      </span>
      <div>
        <p className="toast__titulo">{titulo}</p>
        {texto && <p className="toast__texto">{texto}</p>}
      </div>
      <button type="button" className="toast__fechar" onClick={onFechar} aria-label="Fechar aviso">
        <IconX width={16} height={16} />
      </button>
    </div>
  )
}
