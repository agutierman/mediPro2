import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

// Usa la IP LAN que te salió en ipconfig
const API_URL = 'http://localhost:3000';
console.log('[API_URL]', API_URL);

//const API_URL = 'http://localhost:3000'; // cambia por tu IP si usas Expo Go en celular

export default function RegisterScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [tipo, setTipo] = useState('2');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert('Campos requeridos', 'Completa usuario y contraseña.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasenia, tipo: Number(tipo) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message || 'No se pudo registrar');

      Alert.alert('Éxito', 'Registro exitoso. Inicia sesión.');
      router.replace('/login');
    } catch (e:any) {
      Alert.alert('Error', e?.message ?? 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput placeholder="tu.usuario" autoCapitalize="none" value={usuario} onChangeText={setUsuario} style={styles.input} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput placeholder="********" secureTextEntry value={contrasenia} onChangeText={setContrasenia} style={styles.input} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tipo (1=admin, 2=usuario)</Text>
          <TextInput placeholder="2" keyboardType="numeric" value={tipo} onChangeText={setTipo} style={styles.input} />
        </View>

        <TouchableOpacity onPress={onRegister} style={[styles.btn, loading && { opacity: 0.7 }]} disabled={loading}>
          {loading ? <ActivityIndicator/> : <Text style={styles.btnText}>Registrarme</Text>}
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text>¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff', padding:24, justifyContent:'center' },
  card:{ backgroundColor:'#fff', borderRadius:16, padding:20, gap:16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:12, shadowOffset:{width:0,height:6}, elevation:4, borderWidth:1, borderColor:'#F1F1F1' },
  title:{ fontSize:22, fontWeight:'700', textAlign:'center' },
  field:{ gap:6 },
  label:{ fontSize:14, color:'#333', fontWeight:'600' },
  input:{ height:44, borderWidth:1, borderColor:'#E3E3E3', borderRadius:10, paddingHorizontal:12, fontSize:16, backgroundColor:'#FFF' },
  btn:{ height:48, backgroundColor:'#111827', borderRadius:12, alignItems:'center', justifyContent:'center', marginTop:8 },
  btnText:{ color:'#fff', fontSize:16, fontWeight:'700' },
});
