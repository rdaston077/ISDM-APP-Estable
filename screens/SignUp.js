import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, Alert, Platform,
  KeyboardAvoidingView, ScrollView, Dimensions,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail, hasMin6 } from '../utils/validation';
import HeaderBar from '../components/HeaderBar';

const WIN_H = Dimensions.get('window').height;
const BOTTOM_6P = Math.max(12, Math.round(WIN_H * 0.06)); // margen inferior 6%

export default function SignUp({ navigation }) {
  const [nombre, setNombre]     = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [confirm, setConfirm]   = useState('');
  const [show1, setShow1]       = useState(false);
  const [show2, setShow2]       = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSignUp = async () => {
    if (!nombre || !apellido || !email || !pass || !confirm) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }
    if (!isEmail(email)) {
      Alert.alert('Email inválido', 'Ingresá un email válido.');
      return;
    }
    if (!hasMin6(pass)) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (pass !== confirm) {
      Alert.alert('No coinciden', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      Alert.alert('Éxito', 'Cuenta creada. Ahora podés iniciar sesión.');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.safe}>
      <HeaderBar onPressBell={() => alert('Próximamente: notificaciones')} showBack onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={[
            s.scroll,
            {
              paddingHorizontal: SPACING.lg,
              paddingTop: SPACING.xl,
              paddingBottom: SPACING.lg + BOTTOM_6P,
            },
          ]}
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
              placeholder="Ingrese su nombre"
              placeholderTextColor="#6b7280"
              value={nombre}
              onChangeText={setNombre}
              returnKeyType="next"
            />
          </View>

          {/* Apellido */}
          <Text style={s.label}>Apellido</Text>
          <View style={s.field}>
            <Ionicons name="person" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={s.input}
              placeholder="Ingrese su apellido"
              placeholderTextColor="#6b7280"
              value={apellido}
              onChangeText={setApellido}
              returnKeyType="next"
            />
          </View>

          {/* Correo */}
          <Text style={s.label}>Ingrese su correo electronico</Text>
          <View style={s.field}>
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

          {/* Contraseña */}
          <Text style={s.label}>Ingrese una contraseña</Text>
          <View style={s.field}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
            <TextInput
              style={s.input}
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
          <Text style={s.hint}>
            (La contraseña debe tener como mínimo 6 caracteres, una mayúscula y un número)
          </Text>

          {/* Confirmar */}
          <Text style={s.label}>Repita la contraseña</Text>
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

          {/* CTA */}
          <TouchableOpacity
            disabled={loading}
            onPress={handleSignUp}
            activeOpacity={0.9}
            style={[s.cta, loading && { opacity: 0.7 }]}
          >
            <Text style={s.ctaText}>{loading ? 'Creando…' : 'Crear cuenta'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={s.link}>Volver al inicio</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, alignItems: 'center' },

  logo: { width: 140, height: 140, marginBottom: SPACING.md },
  title: { fontSize: 26, fontWeight: '800', marginBottom: SPACING.sm, color: COLORS.text },

  label: { width: '100%', color: COLORS.text, marginTop: SPACING.md, marginBottom: 6, fontWeight: '600' },

  field: {
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
  leftIcon: { position: 'absolute', left: 12 },
  rightIcon: { position: 'absolute', right: 12 },

  hint: { width: '100%', color: '#6b7280', fontSize: 12, marginTop: 6 },

  cta: {
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
