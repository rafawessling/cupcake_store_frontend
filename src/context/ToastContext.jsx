import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext(null)
let proximoId = 1

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remover = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const mostrar = useCallback(
    (tipo, titulo, texto) => {
      const id = proximoId++
      setToasts((t) => [...t, { id, tipo, titulo, texto }])
      setTimeout(() => remover(id), tipo === 'erro' ? 7000 : 4000)
    },
    [remover],
  )

  const valor = useMemo(
    () => ({
      sucesso: (titulo, texto) => mostrar('sucesso', titulo, texto),
      erro: (titulo, texto) => mostrar('erro', titulo, texto),
    }),
    [mostrar],
  )

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div className="toast-area">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onFechar={() => remover(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
