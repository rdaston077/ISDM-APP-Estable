import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, Pressable, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail, hasMin6 } from '../utils/validation';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    const e = { email: '', password: '' };

    if (!email) e.email = 'El email es obligatorio';
    else if (!isEmail(email)) e.email = 'Ingresá un email válido';

    if (!password) e.password = 'La contraseña es obligatoria';
    else if (!hasMin6(password)) e.password = 'Mínimo 6 caracteres';

    setErrors(e);
    if (e.email || e.password) return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      Alert.alert('Error', 'No se pudo iniciar sesión. Verificá tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.safe}>
      {/* Barra superior */}
      <View style={s.topBar}><Text style={s.topText}>Instituto Superior del Milagro</Text></View>

      <View style={s.container}>
        <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.title}>Iniciar sesión</Text>

        {/* Email */}
        <View style={[s.field, errors.email && s.fieldError]}>
          <MaterialIcons name="email" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {!!errors.email && <Text style={s.error}>{errors.email}</Text>}

        {/* Password */}
        <View style={[s.field, errors.password && s.fieldError]}>
          <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Ingrese su contraseña"
            placeholderTextColor="#6b7280"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={s.rightIcon} onPress={() => setShowPass(v => !v)}>
            <MaterialCommunityIcons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {!!errors.password && <Text style={s.error}>{errors.password}</Text>}

        {/* Forgot password */}
        <TouchableOpacity onPress={() => Alert.alert('Recuperar', 'Implementaremos recuperación más adelante.')}>
          <Text style={s.link}>¿Olvidó su contraseña?</Text>
        </TouchableOpacity>

        {/* Botón 50% */}
        <TouchableOpacity disabled={loading} onPress={handleLogin} activeOpacity={0.9} style={[s.cta, loading && { opacity: 0.7 }]}>
          <Text style={s.ctaText}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</Text>
        </TouchableOpacity>

        {/* Remember me */}
        <Pressable onPress={() => setRemember(r => !r)} style={s.rememberRow}>
          <View style={[s.radio, remember && s.radioChecked]} />
          <Text style={s.rememberText}>No cerrar sesión</Text>
        </Pressable>

        {/* Ir a registro */}
        <Text style={s.small}>
          ¿No tienes cuenta?{' '}
          <Text style={s.link} onPress={() => navigation.navigate('SignUp')}>
            Crear una cuenta
          </Text>
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { height: 44, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  topText: { color: '#fff', fontWeight: '700' },

  container: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  logo: { width: 120, height: 120, marginBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: '800', marginBottom: SPACING.md, color: COLORS.text },

  field: {
    width: '100%', backgroundColor: '#f8fafc',
    borderColor: COLORS.border, borderWidth: 1, borderRadius: 10,
    marginTop: SPACING.sm, paddingLeft: 40, paddingRight: 40, height: 48, justifyContent: 'center',
  },
  fieldError: { borderColor: COLORS.error },
  input: { color: COLORS.text, fontSize: 16, padding: 0 },
  leftIcon: { position: 'absolute', left: 12 },
  rightIcon: { position: 'absolute', right: 12 },

  error: { width: '100%', color: COLORS.error, fontSize: 12, marginTop: 6 },

  link: { color: '#2563eb', marginTop: SPACING.sm, marginBottom: SPACING.sm },

  cta: {
    width: '50%', alignSelf: 'center',
    marginTop: SPACING.sm, height: 46, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary,
    ...Platform.select({ default: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 } }),
  },
  ctaText: { color: '#fff', fontWeight: '800' },

  rememberRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: SPACING.md },
  radio: { width: 18, height: 18, borderRadius: 18, borderWidth: 2, borderColor: '#9ca3af' },
  radioChecked: { borderColor: COLORS.primary, backgroundColor: '#fff' },
  rememberText: { color: COLORS.text },

  small: { marginTop: SPACING.md, color: COLORS.text },
});
