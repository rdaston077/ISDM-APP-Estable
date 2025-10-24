import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, Platform, KeyboardAvoidingView,
  ScrollView, Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail } from '../utils/validation';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';

const WIN_H = Dimensions.get('window').height;
const BOTTOM_6P = Math.max(12, Math.round(WIN_H * 0.06));

// Reglas de contraseña ---
const hasMin6 = (v = '') => String(v).length >= 6;
const hasUpper = (v = '') => /[A-ZÁÉÍÓÚÑ]/.test(v);
const hasDigit = (v = '') => /\d/.test(v);
const passValidAll = (v = '') => hasMin6(v) && hasUpper(v) && hasDigit(v);

// --- Regla: permitir solo letras (con acentos/ñ), espacios y apóstrofo ---
const onlyLetters = (s = '') =>
  s.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñÀ-ÿ' -]/g, '');

export default function SignUp({ navigation }) {
  const [nombre, setNombre]     = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [show1, setShow1]       = useState(false);
  const [show2, setShow2]       = useState(false);
  const [loading, setLoading]   = useState(false);

  // --- ALERTA personalizada ---
  const [alert, setAlert] = useState({
    visible: false, title: '', message: '', type: 'info',
    onConfirm: () => setAlert(a => ({ ...a, visible: false })),
  });
  const showAlert = (opts) =>
    setAlert(a => ({ ...a, visible: true, ...opts, onConfirm: opts?.onConfirm || (() => setAlert(p => ({ ...p, visible: false }))) }));

  const handleSignUp = async () => {
    if (!nombre || !apellido || !email || !pass || !confirm) {
      showAlert({ title: 'Todos los campos son obligatorios', type: 'warning' });
      return;
    }
    if (!isEmail(email)) {
      showAlert({ title: 'Email inválido', message: 'Ingresá un email válido.', type: 'error' });
      return;
    }
    if (!passValidAll(pass)) {
      showAlert({
        title: 'Contraseña débil',
        message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minuscula y un número.',
        type: 'warning',
      });
      return;
    }
    if (pass !== confirm) {
      showAlert({ title: 'Verifica las contraseñas', message: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      showAlert({
        title: 'Éxito',
        message: 'Cuenta creada. Ahora podés iniciar sesión.',
        type: 'success',
        onConfirm: () => {
          setAlert(a => ({ ...a, visible: false }));
          navigation.navigate('Login');
        },
      });
    } catch (err) {
      showAlert({ title: 'Error', message: 'No se pudo crear la cuenta.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const isPassOk = passValidAll(pass);

  return (
    <View style={s.safe}>
      {/* Header sin campana */}
      <HeaderBar
        showBack
        onBackPress={() => navigation.goBack()}
        showBell={false}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}>
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.lg + BOTTOM_6P }]}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
          <Text style={s.title}>Regístrate</Text>

          {/* Nombre */}
          <Text style={s.label}>Nombre</Text>
          <View style={s.field}>
            <Ionicons name="person" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={s.input}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#6b7280"
              value={nombre}
              onChangeText={(t) => setNombre(onlyLetters(t))}
              returnKeyType="next"
            />
          </View>

          {/* Apellido */}
          <Text style={s.label}>Apellido</Text>
          <View style={s.field}>
            <Ionicons name="person" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={s.input}
              placeholder="Ingresa tu apellido"
              placeholderTextColor="#6b7280"
              value={apellido}
              onChangeText={(t) => setApellido(onlyLetters(t))}
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <Text style={s.label}>Ingresa tu correo electronico</Text>
          <View style={s.field}>
            <MaterialIcons name="email" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput style={s.input} placeholder="tucorreo@ejemplo.com" placeholderTextColor="#6b7280"
              autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} returnKeyType="next" />
          </View>

          {/* Contraseña */}
          <Text style={s.label}>Ingresa una contraseña</Text>
          <View style={s.field}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={[s.input, isPassOk && s.inputValid]}
              placeholder="Contraseña"
              placeholderTextColor="#6b7280"
              secureTextEntry={!show1}
              value={pass}
              onChangeText={setPass}
              returnKeyType="next"
            />
            <TouchableOpacity style={s.rightIcon} onPress={() => setShow1(v => !v)}>
              <MaterialCommunityIcons name={show1 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <Text style={s.hint}>(La contraseña debe tener como mínimo 6 caracteres, una mayúscula, una minuscula y un número)</Text>

          {/* Confirmar Contraseña */}
          <Text style={s.label}>Repite la contraseña</Text>
          <View style={s.field}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={s.input}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#6b7280"
              secureTextEntry={!show2}
              value={confirm}
              onChangeText={setConfirm}
              returnKeyType="done"
            />
            <TouchableOpacity style={s.rightIcon} onPress={() => setShow2(v => !v)}>
              <MaterialCommunityIcons name={show2 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity disabled={loading} onPress={handleSignUp} activeOpacity={0.9} style={[s.cta, loading && { opacity: 0.7 }]}>
            <Text style={s.ctaText}>{loading ? 'Creando…' : 'Crear cuenta'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>Volver al inicio</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ISDMAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
        onClose={() => setAlert(a => ({ ...a, visible: false }))}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, alignItems: 'center' },

  logo: { width: 140, height: 140, marginBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: '800', marginBottom: SPACING.sm, color: COLORS.text },

  label: { width: '100%', color: COLORS.text, marginTop: SPACING.md, marginBottom: 6, fontWeight: '600' },
  field:
  {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 40,
    height: 48,
    justifyContent: 'center',
  },
  input: { color: COLORS.text, fontSize: 16, padding: 0 },
  inputValid: { color: '#10b981' },
  leftIcon: { position: 'absolute', left: 12 },
  rightIcon: { position: 'absolute', right: 12 },

  hint: { width: '100%', color: '#6b7280', fontSize: 12, marginTop: 6 },
  cta:
  {
    width: '50%',
    alignSelf: 'center',
    marginTop: SPACING.lg,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  ctaText: { color: '#fff', fontWeight: '800' },

  link: { color: '#2563eb', marginTop: SPACING.md },
});
