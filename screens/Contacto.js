// screens/Contacto.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { isEmail } from '../utils/validation';

export default function Contacto({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [provincia, setProvincia] = useState('');
  const [carrera, setCarrera] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (sending) return;
    Keyboard.dismiss();

    // espacios nermalizados
    const vNombre = nombre.trim();
    const vMail = mail.trim().toLowerCase();
    const vTel = telefono.trim();
    const vProv = provincia.trim();
    const vCarr = carrera.trim();
    const vMsg = mensaje.trim();

    // Validaciones
    if (!vNombre || !vMail || !vTel || !vProv || !vCarr || !vMsg) {
      Alert.alert('Todos los campos son obligatorios');
      return;
    }
    if (!isEmail(vMail)) {
      Alert.alert('Email inválido', 'Ingresá un email válido.');
      return;
    }

    setSending(true);
    // para integrar con email/Firestore/Cloud Function más adelante.
    setTimeout(() => {
      setSending(false);
      Alert.alert('Enviado', '¡Gracias! Te contactaremos a la brevedad.');
      navigation.goBack();
    }, 600);
  };

  return (
    <View style={s.safe}>
      <HeaderBar title="Contacto" showBack onBackPress={() => navigation.goBack()} bottomSpacing={8} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.header}>
            Contactanos para recibir más información sobre nuestras carreras.
          </Text>

          <Text style={s.label}>Nombre</Text>
          <TextInput
            style={s.input}
            placeholder="Tu nombre y apellido"
            placeholderTextColor="#6b7280"
            value={nombre}
            onChangeText={setNombre}
            returnKeyType="next"
          />

          <Text style={s.label}>Mail</Text>
          <TextInput
            style={s.input}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={mail}
            onChangeText={setMail}
            returnKeyType="next"
          />

          <Text style={s.label}>Teléfono / WhatsApp</Text>
          <TextInput
            style={s.input}
            placeholder="Tu número de contacto"
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
            value={telefono}
            onChangeText={setTelefono}
            returnKeyType="next"
          />

          <Text style={s.label}>Provincia</Text>
          <TextInput
            style={s.input}
            placeholder="Ej: Salta"
            placeholderTextColor="#6b7280"
            value={provincia}
            onChangeText={setProvincia}
            returnKeyType="next"
          />

          <Text style={s.label}>Carrera</Text>
          <TextInput
            style={s.input}
            placeholder="Carrera de tu interés"
            placeholderTextColor="#6b7280"
            value={carrera}
            onChangeText={setCarrera}
            returnKeyType="next"
          />

          <Text style={s.label}>Mensaje</Text>
          <TextInput
            style={[s.input, s.textarea]}
            placeholder="Contanos en qué podemos ayudarte…"
            placeholderTextColor="#6b7280"
            value={mensaje}
            onChangeText={setMensaje}
            multiline
            numberOfLines={4}
          />

          <View style={{ height: SPACING.md }} />

          {/* Botón enviar */}
          <TouchableOpacity
            style={[s.cta, sending && { opacity: 0.7 }]}
            activeOpacity={0.9}
            onPress={handleSend}
            disabled={sending}
            accessibilityRole="button"
            accessibilityLabel="Enviar consulta"
          >
            <Text style={s.ctaText}>{sending ? 'Enviando…' : 'Enviar'}</Text>
          </TouchableOpacity>

          <View style={{ height: SPACING.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.lg },
  header: { color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md },
  label: { color: COLORS.text, marginTop: SPACING.md, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    color: COLORS.text,
  },
  textarea: { height: 120, textAlignVertical: 'top', paddingTop: 12, paddingBottom: 12 },
  cta: {
    width: '50%',
    alignSelf: 'center',
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800' },
});
