// screens/Login.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, Platform, KeyboardAvoidingView,
  Pressable, ActivityIndicator, ScrollView,
  ImageBackground
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail } from '../utils/validation';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '' });

  // --- ALERTA personalizada ---
  const [alert, setAlert] = useState({
    visible: false, title: '', message: '', type: 'info',
    onConfirm: () => setAlert(a => ({ ...a, visible: false })),
  });
  const showAlert = (opts) =>
    setAlert(a => ({ ...a, visible: true, ...opts, onConfirm: opts?.onConfirm || (() => setAlert(p => ({ ...p, visible: false }))) }));

  // Auto-redirect si ya hay sesión + "Recuérdame" activo
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remembered = await AsyncStorage.getItem('rememberMe');
        if (mounted && remembered === 'true' && auth.currentUser) {
          navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
        }
      } catch (e) {
        // no-op
      }
    })();
    return () => { mounted = false; };
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrors({ email: '' });
      showAlert({ title: 'Todos los campos son obligatorios', type: 'warning' });
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

      await AsyncStorage.setItem('rememberMe', remember ? 'true' : 'false');

      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });

    } catch (err) {
      switch (err?.code) {
        case 'auth/user-not-found':
          showAlert({ title: 'Correo no registrado', message: 'Ese correo no está registrado.', type: 'error' });
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          showAlert({ title: 'Verificá tus datos', message: 'Mail no registrado ó contraseña incorrecta.', type: 'error' });
          break;
        case 'auth/invalid-email':
          showAlert({ title: 'Email inválido', message: 'Revisá el formato del correo.', type: 'error' });
          break;
        case 'auth/too-many-requests':
          showAlert({ title: 'Demasiados intentos', message: 'Probá más tarde.', type: 'warning' });
          break;
        default:
          console.error(err);
          showAlert({ title: 'Error', message: 'No se pudo iniciar sesión. Verificá tus datos.', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Recuperación de contraseña
  const handleForgotPassword = async () => {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm) {
      showAlert({ title: 'Recuperar contraseña', message: 'Ingresá tu correo para enviarte el enlace de recuperación.', type: 'info' });
      return;
    }
    if (!isEmail(emailNorm)) {
      showAlert({ title: 'Email inválido', message: 'Ingresá un correo válido para continuar.', type: 'warning' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailNorm);
      showAlert({
        title: 'Revisá tu correo',
        message: 'Te enviamos un enlace para restablecer tu contraseña.',
        type: 'success',
      });
    } catch (err) {
      switch (err?.code) {
        case 'auth/user-not-found':
          showAlert({ title: 'Correo no registrado', message: 'No encontramos una cuenta con ese correo.', type: 'error' });
          break;
        case 'auth/invalid-email':
          showAlert({ title: 'Email inválido', message: 'Revisá el formato del correo.', type: 'error' });
          break;
        default:
          console.error(err);
          showAlert({ title: 'Error', message: 'No pudimos enviar el correo de recuperación.', type: 'error' });
      }
    }
  };

  const goToSignUp = () => navigation.navigate('SignUp');

  return (
    <ImageBackground 
      source={require('../assets/classroom_background.png')} 
      style={s.backgroundContainer}
      imageStyle={s.backgroundImage} 
    >
      <View style={s.overlay}>
        {/* Header original */}
        <HeaderBar 
          bottomSpacing={10} 
          showBell={false} 
        />

        <KeyboardAvoidingView
          style={s.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
        >
          <ScrollView
            style={s.scrollView}
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={s.content}>
              {/* Logo */}
              <View style={s.logoContainer}>
                <Image
                  source={require('../assets/logo.png')}
                  style={s.logo}
                  resizeMode="contain"
                />
              </View>

              {/* Formulario */}
              <View style={s.formCard}>
                <Text style={s.title}>Iniciar sesión</Text>

                {/* Email */}
                <View style={[s.field, errors.email && s.fieldError]}>
                  <MaterialIcons name="email" size={20} color="#6B7280" style={s.leftIcon} />
                  <TextInput
                    style={s.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                  />
                </View>
                {!!errors.email && <Text style={s.error}>{errors.email}</Text>}

                {/* Contraseña */}
                <View style={[s.field, { marginTop: SPACING.sm }]}>
                  <Ionicons name="lock-closed" size={20} color="#6B7280" style={s.leftIcon} />
                  <TextInput
                    style={s.input}
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPass}
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity style={s.rightIcon} onPress={() => setShowPass(v => !v)}>
                    <MaterialCommunityIcons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Recordarme y Olvidó su contraseña */}
                <View style={s.rowRememberForgot}>
                  <Pressable style={s.rememberRow} onPress={() => setRemember(r => !r)}>
                    <View style={[s.checkbox, remember && s.checkboxOn]}>
                      {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
                    </View>
                    <Text style={s.rememberText}>Recuérdame</Text>
                  </Pressable>

                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={s.link}>¿Olvidó su contraseña?</Text>
                  </TouchableOpacity>
                </View>

                {/* CTA Ingresar */}
                <TouchableOpacity
                  disabled={loading}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  style={[s.cta, loading && { opacity: 0.7 }]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.ctaText}>Iniciar sesión</Text>
                  )}
                </TouchableOpacity>

                {/* Ir a SignUp */}
                <View style={s.signupRow}>
                  <Text style={s.small}>¿No tenes cuenta?</Text>
                  <TouchableOpacity onPress={goToSignUp} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={s.linkInline}>Crear una cuenta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* Modal de alerta personalizada */}
      <ISDMAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
        onClose={() => setAlert(a => ({ ...a, visible: false }))}
      />
    </ImageBackground>
  );
}

// -------------------------------------------------------------------
// ESTILOS CON SCROLL VIEW
// -------------------------------------------------------------------
const s = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    resizeMode: 'cover', 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(249, 249, 249, 0.6)', 
  },
  
  keyboardAvoiding: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  
  // Contenido principal
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%', // Asegura que ocupe toda la altura
    paddingVertical: 20,
  },
  
  // Logo
  logoContainer: {
    marginBottom: 20,
  },
  logo: { 
    width: 250, 
    height: 250, 
  },
  
  // Formulario
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF', 
    padding: SPACING.lg,
    borderRadius: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20, // Espacio en la parte inferior para el scroll
  },
  
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: SPACING.md, 
    color: '#333333', 
    textAlign: 'center' 
  },

  field: {
    width: '100%',
    backgroundColor: '#FFFFFF', 
    borderColor: '#D1D5DB', 
    borderWidth: 1,
    borderRadius: 10,
    marginTop: SPACING.sm,
    height: 50, 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md, 
  },
  fieldError: { borderColor: '#dc2626' },
  
  leftIcon: { marginRight: 12 },
  rightIcon: { 
    position: 'absolute', 
    right: SPACING.md, 
    padding: 4 
  }, 

  input: { 
    flex: 1, 
    color: '#333333', 
    fontSize: 16, 
    paddingVertical: 0, 
  },
  error: { 
    width: '100%', 
    color: '#dc2626', 
    fontSize: 12, 
    marginTop: 4 
  },

  rowRememberForgot: {
    width: '100%',
    marginTop: SPACING.md, 
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 20, height: 20, borderRadius: 6, 
    borderWidth: 1.5, borderColor: '#9ca3af',
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxOn: { 
    backgroundColor: COLORS.primary || '#2563eb', 
    borderColor: COLORS.primary || '#2563eb' 
  },
  rememberText: { 
    color: '#333333', 
    fontSize: 14 
  },

  link: { 
    color: COLORS.primary || '#2563eb', 
    fontSize: 14, 
    fontWeight: '600' 
  }, 
  small: { 
    color: '#666666', 
    fontSize: 14 
  },
  linkInline: { 
    color: COLORS.primary || '#2563eb', 
    fontSize: 14, 
    fontWeight: '600' 
  },

  cta: {
    width: '100%',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    height: 50, 
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary || '#2563eb',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 16 
  }, 

  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});