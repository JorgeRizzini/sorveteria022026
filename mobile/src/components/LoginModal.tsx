import { useState } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { api } from '../lib/api'
import { colors } from '../theme'

export function LoginModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async () => {
    setLoading(true); setError('')
    try { await api.login(email, password); onClose() }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.') }
    finally { setLoading(false) }
  }
  return <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}><Pressable style={StyleSheet.absoluteFill} onPress={onClose} /><View style={styles.sheet}><View style={styles.handle} /><Text style={styles.icon}>🍦</Text><Text style={styles.title}>Que bom ter você aqui</Text><Text style={styles.copy}>Entre para acompanhar seus pedidos e sabores favoritos.</Text><Text style={styles.label}>E-mail</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="voce@email.com" style={styles.input} value={email} /><Text style={styles.label}>Senha</Text><TextInput autoComplete="current-password" onChangeText={setPassword} placeholder="••••••••" secureTextEntry style={styles.input} value={password} />{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable disabled={loading} onPress={submit} style={styles.button}>{loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>Entrar</Text>}</Pressable></View></KeyboardAvoidingView></Modal>
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: '#0008', flex: 1, justifyContent: 'flex-end' }, sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  handle: { alignSelf: 'center', backgroundColor: '#ccc', borderRadius: 4, height: 5, marginBottom: 18, width: 44 }, icon: { fontSize: 38, textAlign: 'center' },
  title: { color: colors.black, fontFamily: 'serif', fontSize: 27, fontWeight: '900', marginTop: 8, textAlign: 'center' }, copy: { color: colors.muted, lineHeight: 20, marginBottom: 20, marginTop: 7, textAlign: 'center' },
  label: { color: colors.black, fontSize: 13, fontWeight: '800', marginBottom: 6, marginTop: 10 }, input: { backgroundColor: '#f4f3ef', borderRadius: 12, fontSize: 16, paddingHorizontal: 15, paddingVertical: 14 },
  error: { color: '#a52a2a', marginTop: 12 }, button: { alignItems: 'center', backgroundColor: colors.black, borderRadius: 24, marginTop: 20, paddingVertical: 15 }, buttonText: { color: colors.white, fontWeight: '900' },
})
