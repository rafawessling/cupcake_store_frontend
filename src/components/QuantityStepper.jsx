import { IconMais, IconMenos } from './Icons'

export default function QuantityStepper({ nome, quantidade, max = 99, onChange }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantidade de ${nome}`}>
      <button
        type="button"
        onClick={() => onChange(quantidade - 1)}
        disabled={quantidade <= 1}
        aria-label={`Diminuir quantidade de ${nome}`}
      >
        <IconMenos width={18} height={18} />
      </button>
      <output aria-live="polite">{quantidade}</output>
      <button
        type="button"
        onClick={() => onChange(quantidade + 1)}
        disabled={quantidade >= max}
        aria-label={`Aumentar quantidade de ${nome}`}
      >
        <IconMais width={18} height={18} />
      </button>
    </div>
  )
}
