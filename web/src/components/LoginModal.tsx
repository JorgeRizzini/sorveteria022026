import { useState, type FormEvent } from 'react'
import { api } from '../lib/apiClient'

export function LoginModal({onClose}:{onClose:()=>void}){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)

  const submit=async(event:FormEvent)=>{
    event.preventDefault(); setError(''); setLoading(true)
    try { await api.login(email,password); onClose() }
    catch(loginError){ setError(loginError instanceof Error?loginError.message:'Não foi possível entrar.') }
    finally { setLoading(false) }
  }

  return <div className="overlay modal-overlay" onMouseDown={onClose}><form className="login-modal" onSubmit={submit} onMouseDown={event=>event.stopPropagation()}><button type="button" className="close" onClick={onClose}>×</button><span className="login-icon">🍦</span><h2>Que bom ter você aqui</h2><p>Entre para acompanhar seus pedidos e sabores favoritos.</p><label>E-mail<input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="voce@email.com" autoComplete="email" required/></label><label>Senha<input type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="••••••••" autoComplete="current-password" required/></label>{error&&<p className="login-error" role="alert">{error}</p>}<button className="dark-button checkout" disabled={loading}>{loading?'Entrando...':'Entrar'}</button></form></div>
}
