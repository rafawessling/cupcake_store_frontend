import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from './Header'

// Rota protegida: sem sessão, vai para /login.
export function RotaProtegida() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return <Outlet />
}

export default function Layout({ comBusca = false, voltar = false, children }) {
  return (
    <>
      <Header comBusca={comBusca} voltar={voltar} />
      <main id="conteudo" className="conteudo">
        {children}
      </main>
      <footer className="rodape">Feito com açúcar e amor!</footer>
    </>
  )
}
