import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import { Input, PasswordInput } from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const { usuario, entrar, sessaoExpirada, limparAviso } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (sessaoExpirada) {
      toast.erro('Sua sessão expirou. Entre novamente.')
      limparAviso()
    }
  }, [sessaoExpirada, toast, limparAviso])

  if (usuario) return <Navigate to="/" replace />

  async function enviar(ev) {
    ev.preventDefault()
    const e = {}
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    if (!senha) e.senha = 'Informe sua senha.'
    setErros(e)
    setErroGeral('')
    if (Object.keys(e).length) return
    setEnviando(true)
    try {
      await entrar(email.trim(), senha)
      navigate('/', { replace: true })
    } catch (err) {
      setErroGeral(err.message)
      toast.erro(err.message)
      setEnviando(false)
    }
  }

  return (
    <AuthCard subtitulo="Entre e descubra o lado mais doce da sua região!" rodape="Feito com açúcar e amor!">
      <form onSubmit={enviar} noValidate className="form">
        <Input id="email" rotulo="E-mail:" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} erro={erros.email} />
        <PasswordInput id="senha" rotulo="Senha:" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} erro={erros.senha} />
        {erroGeral && (
          <p className="campo__erro campo__erro--geral" role="alert">
            {erroGeral}
          </p>
        )}
        <Button type="submit" bloco carregando={enviando} carregandoTexto="Entrando…">
          Entrar
        </Button>
      </form>
      <p className="auth__alt">
        Não tem uma conta? <Link to="/cadastro">Cadastrar-se</Link>
      </p>
    </AuthCard>
  )
}
