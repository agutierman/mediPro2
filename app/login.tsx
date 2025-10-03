import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

// Usa la IP LAN que te salió en ipconfig
const API_URL = 'http://localhost:3000';
console.log('[API_URL]', API_URL);

//const API_URL = 'http://localhost:3000'; // cambia por tu IP si usas Expo Go en celular


export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!usuario.trim() || !contrasenia.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu usuario y contraseña.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasenia }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message || 'Credenciales inválidas');

      router.replace('/(tabs)/citas');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Inicio de sesión</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            placeholder="tu.usuario"
            autoCapitalize="none"
            autoCorrect={false}
            value={usuario}
            onChangeText={setUsuario}
            style={styles.input}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="********"
              secureTextEntry={!mostrar}
              value={contrasenia}
              onChangeText={setContrasenia}
              style={[styles.input, { flex: 1 }]}
              returnKeyType="done"
              onSubmitEditing={onLogin}
            />
            <TouchableOpacity onPress={() => setMostrar(v => !v)} style={styles.showBtn}>
              <Text style={styles.showBtnText}>{mostrar ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={onLogin} style={[styles.btn, loading && { opacity: 0.7 }]} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Entrar</Text>}
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text>¿No tienes cuenta? <Link href="/register">Regístrate</Link></Text>
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
  passwordRow:{ flexDirection:'row', alignItems:'center', gap:8 },
  showBtn:{ paddingHorizontal:12, height:44, justifyContent:'center', borderRadius:10, borderWidth:1, borderColor:'#E3E3E3', backgroundColor:'#FAFAFA' },
  showBtnText:{ fontWeight:'600' },
  btn:{ height:48, backgroundColor:'#111827', borderRadius:12, alignItems:'center', justifyContent:'center', marginTop:8 },
  btnText:{ color:'#fff', fontSize:16, fontWeight:'700', letterSpacing:0.3 },
});
