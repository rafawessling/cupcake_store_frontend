import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import AuthCard from '../components/AuthCard'
import Button from '../components/Button'
import { Checkbox, Input, PasswordInput } from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { emailValido } from '../utils/format'

function validar(v) {
  const e = {}
  if (!v.nome.trim()) e.nome = 'Informe seu nome.'
  if (!emailValido(v.email.trim())) e.email = 'Informe um e-mail válido.'
  if (v.senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres.'
  if (v.confirmacao !== v.senha || !v.confirmacao) e.confirmacao = 'As senhas não conferem.'
  if (!v.termos) e.termos = 'É necessário aceitar os termos.'
  return e
}

export default function Cadastro() {
  const { usuario } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [valores, setValores] = useState({ nome: '', email: '', senha: '', confirmacao: '', termos: false })
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  const alterar = (campo) => (ev) =>
    setValores((v) => ({ ...v, [campo]: ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value }))

  async function enviar(ev) {
    ev.preventDefault()
    const e = validar(valores)
    setErros(e)
    if (Object.keys(e).length) {
      // Foca o primeiro campo com erro.
      const primeiro = formRef.current.querySelector('[aria-invalid="true"]')
      primeiro?.focus()
      return
    }
    setEnviando(true)
    try {
      await api.cadastrar({
        nome: valores.nome.trim(),
        email: valores.email.trim(),
        senha: valores.senha,
        confirmacao_senha: valores.confirmacao,
      })
      toast.sucesso('Cadastro realizado!', 'Faça seu login para continuar.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.erro(err.message)
      setEnviando(false)
    }
  }

  return (
    <AuthCard
      rodape={<>Copyright 2026. Todos os direitos reservados.</>}
    >
      <form ref={formRef} onSubmit={enviar} noValidate className="form">
        <Input id="nome" rotulo="Nome:" autoComplete="name" value={valores.nome} onChange={alterar('nome')} erro={erros.nome} />
        <Input id="email" rotulo="E-mail:" type="email" autoComplete="email" value={valores.email} onChange={alterar('email')} erro={erros.email} />
        <PasswordInput id="senha" rotulo="Senha:" autoComplete="new-password" value={valores.senha} onChange={alterar('senha')} erro={erros.senha} />
        <PasswordInput id="confirmacao" rotulo="Confirmar senha:" autoComplete="new-password" value={valores.confirmacao} onChange={alterar('confirmacao')} erro={erros.confirmacao} />
        <Checkbox id="termos" checked={valores.termos} onChange={alterar('termos')} erro={erros.termos}>
          Declaro que li e aceito os <u>termos e condições</u>.
        </Checkbox>
        <Button type="submit" bloco carregando={enviando} carregandoTexto="Cadastrando…">
          Cadastrar
        </Button>
      </form>
      <p className="auth__alt">
        Já tem uma conta? <Link to="/login">Faça seu login</Link>
      </p>
    </AuthCard>
  )
}
