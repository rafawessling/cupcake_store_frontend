const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatarPreco = (valor) => brl.format(valor)

export const primeiroNome = (nome = '') => nome.trim().split(/\s+/)[0] || ''

export const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
