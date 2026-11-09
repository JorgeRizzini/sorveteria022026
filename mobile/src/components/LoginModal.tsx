import { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { api } from '../lib/api'
import { colors } from '../theme'
import type { User } from '../types'

export function LoginModal({ visible, onClose, onAuthenticated }: { visible: boolean; onClose: () => void; onAuthenticated: (user: User) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setError(''); setMessage('')
    try {
      if (mode === 'login') onAuthenticated(await api.login(email.trim(), password))
      else {
        const result = await api.register(fullName.trim(), email.trim(), password)
        if (result.session) onAuthenticated(result.user)
        else { setMessage('Conta criada. Confirme seu e-mail antes de entrar.'); setMode('login'); return }
      }
      onClose()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível continuar.') }
    finally { setLoading(false) }
  }

  return <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}><Pressable style={StyleSheet.absoluteFill} onPress={onClose} /><View style={styles.sheet}><View style={styles.handle} /><ScrollView keyboardShouldPersistTaps="handled"><Text style={styles.icon}>🍦</Text><Text style={styles.title}>{mode === 'login' ? 'Que bom ter você aqui' : 'Crie sua conta'}</Text><Text style={styles.copy}>{mode === 'login' ? 'Entre para acompanhar seus pedidos.' : 'Cadastre-se para finalizar seus pedidos.'}</Text>{mode === 'register' && <><Text style={styles.label}>Nome completo</Text><TextInput autoComplete="name" onChangeText={setFullName} placeholder="Seu nome" style={styles.input} value={fullName} /></>}<Text style={styles.label}>E-mail</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="voce@email.com" style={styles.input} value={email} /><Text style={styles.label}>Senha</Text><TextInput autoComplete={mode === 'login' ? 'current-password' : 'new-password'} onChangeText={setPassword} placeholder="Mínimo de 10 caracteres" secureTextEntry style={styles.input} value={password} />{error ? <Text style={styles.error}>{error}</Text> : null}{message ? <Text style={styles.message}>{message}</Text> : null}<Pressable disabled={loading} onPress={submit} style={styles.button}>{loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>}</Pressable><Pressable onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}><Text style={styles.switch}>{mode === 'login' ? 'Ainda não tenho conta' : 'Já tenho uma conta'}</Text></Pressable></ScrollView></View></KeyboardAvoidingView></Modal>
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: '#0008', flex: 1, justifyContent: 'flex-end' }, sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', padding: 24, paddingBottom: 36 }, handle: { alignSelf: 'center', backgroundColor: '#ccc', borderRadius: 4, height: 5, marginBottom: 12, width: 44 }, icon: { fontSize: 38, textAlign: 'center' }, title: { color: colors.black, fontFamily: 'serif', fontSize: 27, fontWeight: '900', marginTop: 8, textAlign: 'center' }, copy: { color: colors.muted, lineHeight: 20, marginBottom: 14, marginTop: 7, textAlign: 'center' }, label: { color: colors.black, fontSize: 13, fontWeight: '800', marginBottom: 6, marginTop: 10 }, input: { backgroundColor: '#f4f3ef', borderRadius: 12, fontSize: 16, paddingHorizontal: 15, paddingVertical: 14 }, error: { color: '#a52a2a', marginTop: 12 }, message: { color: '#397232', marginTop: 12 }, button: { alignItems: 'center', backgroundColor: colors.black, borderRadius: 24, marginTop: 20, paddingVertical: 15 }, buttonText: { color: colors.white, fontWeight: '900' }, switch: { color: colors.black, fontWeight: '800', marginTop: 18, textAlign: 'center' },
})
