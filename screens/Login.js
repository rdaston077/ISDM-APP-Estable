import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, Alert, Platform,
  KeyboardAvoidingView, ScrollView,
  Dimensions, Pressable,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail } from '../utils/validation';
import HeaderBar from '../components/HeaderBar';

const WIN_H = Dimensions.get('window').height;
// Mantenemos la variable, aunque no se usará en s.centerWrap para centrado puro.
const TOP_TWEAK = Math.max(16, Math.min(80, Math.round(WIN_H * 0.05)));
const LOGO_GAP = Math.max(8, Math.min(96, Math.round(WIN_H * 0.03)));
const BOTTOM_6P = Math.max(12, Math.round(WIN_H * 0)); // margen inferior 0% para login

export default function Login({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({ email: '' });

  const handleLogin = async () => {
    // Validación básica
    if (!email || !password) {
      setErrors({ email: '' });
      Alert.alert('Todos los campos son obligatorios');
      return;
    }
    const e = { email: '' };
    if (!isEmail(email)) e.email = 'Ingresá un email válido';
    setErrors(e);
    if (e.email) return;

    try {
      setLoading(true);
      const emailNorm = email.trim().toLowerCase();

      await signInWithEmailAndPassword(auth, emailNorm, password);

      // Redirecciona a 'Home' y resetea la pila de navegación
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err) {
      // Mensajes claros para los casos más comunes
      switch (err?.code) {
        case 'auth/user-not-found':
          Alert.alert('Correo no registrado', 'Ese correo no está registrado.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          Alert.alert('Verificá tus datos', 'Mail no registrado ó contraseña incorrecta.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Email inválido', 'Revisá el formato del correo.');
          break;
        case 'auth/too-many-requests':
          Alert.alert('Demasiados intentos', 'Probá más tarde.');
          break;
        default:
          console.error(err); // Se agregó el console.error del Código 1
          Alert.alert('Error', 'No se pudo iniciar sesión. Verificá tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => navigation.navigate('SignUp');

  return (
    <View style={s.safe}>
      {/* Header fijo */}
      <HeaderBar onPressBell={() => Alert.alert('Notificaciones', 'Próximamente.')} bottomSpacing={16} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={[
            s.scroll,
            {
              paddingHorizontal: SPACING.lg,
              paddingBottom: SPACING.lg + BOTTOM_6P,
              // CLAVE: Centrado vertical puro
              justifyContent: 'center', 
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.centerWrap}>
            <Image
              source={require('../assets/logo.png')}
              style={[s.logo, { marginBottom: SPACING.md + LOGO_GAP }]}
              resizeMode="contain"
            />

            {/* CLAVE: Contenedor del Formulario con estilo de TARJETA (formCard) */}
            <View style={s.formCard}> 
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
                  returnKeyType="next"
                />
              </View>
              {!!errors.email && <Text style={s.error}>{errors.email}</Text>}

              {/* Password */}
              <View style={s.field}>
                <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Ingrese su contraseña"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
                <TouchableOpacity style={s.rightIcon} onPress={() => setShowPass(v => !v)}>
                  <MaterialCommunityIcons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Recuérdame + ¿Olvidó? */}
              <View style={s.rowRememberForgot}>
                <Pressable style={s.rememberRow} onPress={() => setRemember(r => !r)}>
                  <View style={[s.checkbox, remember && s.checkboxOn]}>
                    {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={s.rememberText}>Recuérdame</Text>
                </Pressable>

                <TouchableOpacity onPress={() => Alert.alert('Recuperar', 'Implementaremos recuperación más adelante.')}>
                  <Text style={s.link}>¿Olvidó su contraseña?</Text>
                </TouchableOpacity>
              </View>

              {/* CTA */}
              <TouchableOpacity
                disabled={loading}
                onPress={handleLogin}
                activeOpacity={0.9}
                style={[s.cta, loading && { opacity: 0.7 }]}
              >
                <Text style={s.ctaText}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</Text>
              </TouchableOpacity>

              {/* Link a SignUp */}
              <View style={s.signupRow}>
                <Text style={s.small}>¿No tenes cuenta?</Text>
                <TouchableOpacity onPress={goToSignUp} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={s.signupBtn}>
                  <Text style={s.linkInline}>Crear una cuenta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// -------------------------------------------------------------------
// ESTILOS UNIFICADOS
// -------------------------------------------------------------------
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  // flexGrow: 1 y alignItems: 'center' es clave para el centrado horizontal en el ScrollView
  scroll: { flexGrow: 1, alignItems: 'center' },

  // CLAVE: Se elimina 'marginTop: -TOP_TWEAK' para centrado puro (como en Codigo 1)
  centerWrap: { width: '100%', alignItems: 'center' },
  logo: { width: 140, height: 140 },
  // Se añade 'textAlign: 'center'' para el título dentro de la tarjeta
  title: { fontSize: 26, fontWeight: '800', marginBottom: SPACING.md, color: COLORS.text, textAlign: 'center' },

  // CLAVE: Estilo de la tarjeta del formulario (tomado del Codigo 1)
  formCard: {
    width: '100%',
    backgroundColor: 'hsla(300, 33%, 99%, 1.00)',
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  field: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: SPACING.sm,
    paddingLeft: 40,
    paddingRight: 40,
    height: 48,
    justifyContent: 'center',
  },
  fieldError: { borderColor: COLORS.error },
  input: { color: COLORS.text, fontSize: 16, padding: 0 },
  leftIcon: { position: 'absolute', left: 12 },
  rightIcon: { position: 'absolute', right: 12 },

  error: { width: '100%', color: COLORS.error, fontSize: 12, marginTop: 6 },

  rowRememberForgot: {
    width: '100%',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#9ca3af',
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginRight: 8,
  },
  checkboxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  rememberText: { color: COLORS.text },

  link: { color: '#2563eb' },
  small: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
  linkInline: { color: '#2563eb', fontSize: 14, lineHeight: 20 },

  cta: {
    width: '50%',
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    ...Platform.select({ default: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 } }),
  },
  ctaText: { color: '#fff', fontWeight: '800' },

  signupRow: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
  },
  signupBtn: { paddingHorizontal: 2, paddingVertical: 2 },
});
