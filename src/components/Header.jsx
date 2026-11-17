import { useEffect, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { primeiroNome } from '../utils/format'
import { IconCasa, IconCarrinho, IconLupa, IconSair, IconSeta, IconUsuario, IconX } from './Icons'
import Logo from './Logo'

function Badge({ quantidade }) {
  if (!quantidade) return null
  return (
    <span className="badge" aria-hidden="true">
      {quantidade > 99 ? '99+' : quantidade}
    </span>
  )
}

export function SearchInput() {
  const [params, setParams] = useSearchParams()
  const [texto, setTexto] = useState(params.get('busca') || '')

  // Debounce de ~300ms ao digitar.
  useEffect(() => {
    const t = setTimeout(() => {
      const atual = params.get('busca') || ''
      if (texto.trim() !== atual) setParams(texto.trim() ? { busca: texto.trim() } : {}, { replace: true })
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto])

  // Mantém o campo sincronizado quando a busca é limpa por outro botão.
  useEffect(() => {
    setTexto(params.get('busca') || '')
  }, [params])

  return (
    <div className="busca">
      <IconLupa width={18} height={18} className="busca__lupa" />
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Buscar cupcake…"
        aria-label="Pesquisar cupcakes"
      />
      {texto && (
        <button type="button" className="busca__limpar" onClick={() => setTexto('')} aria-label="Limpar busca">
          <IconX width={16} height={16} />
        </button>
      )}
    </div>
  )
}

export default function Header({ comBusca = false, voltar = false }) {
  const { usuario, sair } = useAuth()
  const { quantidadeTotal } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [confirmandoSaida, setConfirmandoSaida] = useState(false)
  const rotuloCarrinho = `Carrinho, ${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'}`

  return (
    <>
      <a href="#conteudo" className="pular">
        Pular para o conteúdo
      </a>
      <header className="header">
        <div className="header__interno">
          {voltar && (
            <button type="button" className="header__voltar" onClick={() => navigate(-1)} aria-label="Voltar">
              <IconSeta />
            </button>
          )}
          <Logo />
          <nav className="header__nav" aria-label="Principal">
            <NavLink to="/" end>
              Catálogo
            </NavLink>
            <NavLink to="/carrinho">Carrinho</NavLink>
          </nav>
          {comBusca && (
            <div className="header__busca">
              <SearchInput />
            </div>
          )}
          <div className="header__acoes">
            <Link to="/carrinho" className="header__carrinho" aria-label={rotuloCarrinho}>
              <IconCarrinho />
              <Badge quantidade={quantidadeTotal} />
            </Link>
            <span className="header__usuario">
              <IconUsuario width={20} height={20} />
              {primeiroNome(usuario?.nome)}
            </span>
            <button type="button" className="btn-link" onClick={() => setConfirmandoSaida(true)}>
              Sair
            </button>
          </div>
        </div>
      </header>
      <BottomNav quantidade={quantidadeTotal} onSair={() => setConfirmandoSaida(true)} pathname={pathname} />
      <ConfirmDialog
        aberto={confirmandoSaida}
        titulo="Deseja sair?"
        descricao="Você precisará entrar novamente para continuar comprando."
        textoConfirmar="Sair"
        onCancelar={() => setConfirmandoSaida(false)}
        onConfirmar={() => {
          setConfirmandoSaida(false)
          sair()
        }}
      />
    </>
  )
}

// Barra inferior (apenas celular, via CSS).
function BottomNav({ quantidade, onSair, pathname }) {
  const emCarrinho = pathname === '/carrinho'
  return (
    <nav className="bottom-nav" aria-label="Navegação inferior">
      <NavLink to="/" end>
        {({ isActive }) => (
          <>
            <IconCasa preenchido={isActive} width={28} height={28} />
            <span>Catálogo</span>
          </>
        )}
      </NavLink>
      <Link to="/carrinho" aria-current={emCarrinho ? 'page' : undefined} aria-label={`Carrinho, ${quantidade} itens`}>
        <span className="bottom-nav__icone">
          <IconCarrinho preenchido={emCarrinho} width={28} height={28} />
          <Badge quantidade={quantidade} />
        </span>
        <span>Carrinho</span>
      </Link>
      <button type="button" onClick={onSair}>
        <IconSair width={28} height={28} />
        <span>Sair</span>
      </button>
    </nav>
  )
}
