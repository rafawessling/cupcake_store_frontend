import { Navigate, Route, Routes } from 'react-router-dom'
import { RotaProtegida } from './components/Layout'
import Cadastro from './pages/Cadastro'
import Carrinho from './pages/Carrinho'
import Catalogo from './pages/Catalogo'
import Erro from './pages/Erro'
import Login from './pages/Login'
import Produto from './pages/Produto'
import Sucesso from './pages/Sucesso'

export default function App() {
  return (
    <Routes>
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route element={<RotaProtegida />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/pedido/erro" element={<Erro />} />
        <Route path="/pedido/:id/sucesso" element={<Sucesso />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
