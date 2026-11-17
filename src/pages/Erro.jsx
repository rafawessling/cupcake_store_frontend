import { useLocation } from 'react-router-dom'
import Button from '../components/Button'
import { IconX } from '../components/Icons'
import Layout from '../components/Layout'

const MENSAGEM_PADRAO = 'Não foi possível concluir o pedido. Tente novamente em instantes.'

// Heurística simples: acentos/cedilha ou palavras comuns do português.
const PALAVRAS_PT = /\b(não|nao|de|do|da|dos|das|o|a|os|as|um|uma|para|com|em|ao|ou|erro|pedido|produto|itens?|conectar|servidor|inválido|invalido|indisponível|existe|está|quantidade|token|acesso)\b/i
function emPortugues(texto) {
  if (typeof texto !== 'string' || !texto.trim()) return false
  return /[áàâãéêíóôõúç]/i.test(texto) || PALAVRAS_PT.test(texto)
}

export default function Erro() {
  const { state } = useLocation()
  const mensagem = emPortugues(state?.mensagem) ? state.mensagem : MENSAGEM_PADRAO
  return (
    <Layout>
      <section className="cartao-central cartao-central--estreito">
        <div className="selo selo--erro" aria-hidden="true">
          <IconX width={36} height={36} />
        </div>
        <h1>Oops! Algo deu errado.</h1>
        <p className="cartao-central__texto">
          Não foi possível concluir o pedido. Por favor, tente novamente, ou contate o suporte se o problema persistir.
        </p>
        <p className="cartao-central__apoio">{mensagem}</p>
        <Button to="/carrinho">Voltar ao carrinho</Button>
      </section>
    </Layout>
  )
}
