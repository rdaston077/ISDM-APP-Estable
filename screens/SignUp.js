import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { isEmail, hasMin6 } from '../utils/validation';

export default function SignUp({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nombre: '', apellido: '', email: '', pass: '', confirm: ''
  });

  const handleSignUp = async () => {
    const e = { nombre:'', apellido:'', email:'', pass:'', confirm:'' };

    if (!nombre) e.nombre = 'El nombre es obligatorio';
    if (!apellido) e.apellido = 'El apellido es obligatorio';

    if (!email) e.email = 'El email es obligatorio';
    else if (!isEmail(email)) e.email = 'Ingresá un email válido';

    if (!pass) e.pass = 'La contraseña es obligatoria';
    else if (!hasMin6(pass)) e.pass = 'Mínimo 6 caracteres';

    if (!confirm) e.confirm = 'Confirmá la contraseña';
    else if (pass !== confirm) e.confirm = 'Las contraseñas no coinciden';

    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      Alert.alert('Éxito', 'Cuenta creada. Ingresando…');
    } catch {
      Alert.alert('Error', 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.safe}>
      <View style={s.topBar}><Text style={s.topText}>Instituto Superior del Milagro</Text></View>

      <View style={s.container}>
        <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.title}>Regístrate</Text>

        {/* Nombre */}
        <Text style={s.label}>Nombre</Text>
        <View style={[s.field, errors.nombre && s.fieldError]}>
          <Ionicons name="person" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Ingrese su nombre"
            placeholderTextColor="#6b7280"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>
        {!!errors.nombre && <Text style={s.error}>{errors.nombre}</Text>}

        {/* Apellido */}
        <Text style={s.label}>Apellido</Text>
        <View style={[s.field, errors.apellido && s.fieldError]}>
          <Ionicons name="person" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Ingrese su apellido"
            placeholderTextColor="#6b7280"
            value={apellido}
            onChangeText={setApellido}
          />
        </View>
        {!!errors.apellido && <Text style={s.error}>{errors.apellido}</Text>}

        {/* Correo */}
        <Text style={s.label}>Ingrese su correo electronico</Text>
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

        {/* Contraseña */}
        <Text style={s.label}>Ingrese una contraseña</Text>
        <Text style={s.hint}>(La contraseña debe tener como mínimo 6 caracteres, una mayúscula y un número)</Text>
        <View style={[s.field, errors.pass && s.fieldError]}>
          <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Contraseña"
            placeholderTextColor="#6b7280"
            secureTextEntry={!show1}
            value={pass}
            onChangeText={setPass}
          />
          <TouchableOpacity style={s.rightIcon} onPress={() => setShow1(v => !v)}>
            <MaterialCommunityIcons name={show1 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {!!errors.pass && <Text style={s.error}>{errors.pass}</Text>}

        {/* Confirmar (SIN título, solo campo) */}
        <View style={[s.field, { marginTop: SPACING.md }, errors.confirm && s.fieldError]}>
          <Ionicons name="lock-closed" size={20} color="#6b7280" style={s.leftIcon} />
          <TextInput
            style={s.input}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#6b7280"
            secureTextEntry={!show2}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity style={s.rightIcon} onPress={() => setShow2(v => !v)}>
            <MaterialCommunityIcons name={show2 ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {!!errors.confirm && <Text style={s.error}>{errors.confirm}</Text>}

        {/* Botón 50% */}
        <TouchableOpacity disabled={loading} onPress={handleSignUp} activeOpacity={0.9} style={[s.cta, loading && { opacity: 0.7 }]}>
          <Text style={s.ctaText}>{loading ? 'Creando…' : 'Crear cuenta'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={s.link}>Volver al inicio</Text>
        </TouchableOpacity>
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
  title: { fontSize: 26, fontWeight: '800', marginBottom: SPACING.sm, color: COLORS.text },

  label: { width: '100%', color: COLORS.text, marginTop: SPACING.md, marginBottom: 6, fontWeight: '600' },

  field: {
    width: '100%', backgroundColor: '#f8fafc',
    borderColor: COLORS.border, borderWidth: 1, borderRadius: 10,
    paddingLeft: 40, paddingRight: 40, height: 48, justifyContent: 'center',
  },
  fieldError: { borderColor: COLORS.error },
  input: { color: COLORS.text, fontSize: 16, padding: 0 },
  leftIcon: { position: 'absolute', left: 12 },
  rightIcon: { position: 'absolute', right: 12 },

  hint: { width: '100%', color: '#9b1c1c', fontSize: 12, marginBottom: 6 },
  error: { width: '100%', color: COLORS.error, fontSize: 12, marginTop: 6 },

  cta: {
    width: '50%', alignSelf: 'center',
    marginTop: SPACING.lg, height: 46, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary,
  },
  ctaText: { color: '#fff', fontWeight: '800' },

  link: { color: '#2563eb', marginTop: SPACING.md },
});
