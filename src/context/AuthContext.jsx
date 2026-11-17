import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler, tokenStore } from '../api/client'

const AuthContext = createContext(null)
const USER_KEY = 'cupcake_usuario'

function lerUsuario() {
  try {
    return tokenStore.get() ? JSON.parse(localStorage.getItem(USER_KEY)) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuario)
  const [sessaoExpirada, setSessaoExpirada] = useState(false)

  const sair = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem(USER_KEY)
    setUsuario(null)
  }, [])

  const entrar = useCallback(async (email, senha) => {
    const { token, usuario: u } = await api.login(email, senha)
    tokenStore.set(token)
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setSessaoExpirada(false)
    setUsuario(u)
  }, [])

  // 401 em chamada autenticada: limpa a sessão e avisa no login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      sair()
      setSessaoExpirada(true)
    })
  }, [sair])

  const valor = useMemo(
    () => ({ usuario, entrar, sair, sessaoExpirada, limparAviso: () => setSessaoExpirada(false) }),
    [usuario, entrar, sair, sessaoExpirada],
  )
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
