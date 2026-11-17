import { CupcakeSvg } from './Logo'
import { IconX } from './Icons'

export default function EmptyState({ titulo, texto, erro = false, children }) {
  return (
    <div className="estado-vazio">
      <div className={`estado-vazio__icone${erro ? ' estado-vazio__icone--erro' : ''}`}>
        {erro ? <IconX width={32} height={32} /> : <CupcakeSvg tamanho={64} />}
      </div>
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      {children}
    </div>
  )
}
