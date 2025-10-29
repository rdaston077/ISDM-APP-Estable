// screens/Contacto.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Platform, KeyboardAvoidingView, TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { isEmail } from '../utils/validation';
import ISDMAlert from '../components/ISDMAlert';

// --- Regla: permitir solo letras (con acentos/ñ), espacios, guion y apóstrofo ---
const onlyLetters = (s = '') =>
  s.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñÀ-ÿ' -]/g, '');

// Lista de carreras disponibles
const CARRERAS = [
  'Tec. Análisis de Sistemas',
  'Profesorado de Inglés',
  'Profesorado de Educación Inicial',
  'Profesorado de Educación Primaria',
  'Psicopedagogía',
  'Educación Especial (Discapacidad Intelectual)',
];

export default function Contacto({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [mail, setMail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [provincia, setProvincia] = useState('');
  const [carrera, setCarrera] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [sending, setSending] = useState(false);

  // --- ALERTA personalizada ---
  const [alert, setAlert] = useState({
    visible: false, title: '', message: '', type: 'info',
    onConfirm: () => setAlert(a => ({ ...a, visible: false })),
  });
  const showAlert = (opts) =>
    setAlert(a => ({ ...a, visible: true, ...opts, onConfirm: opts?.onConfirm || (() => setAlert(p => ({ ...p, visible: false }))) }));

  const handleSend = () => {
    if (sending) return;
    Keyboard.dismiss();

    const vNombre = nombre.trim();
    const vMail = mail.trim().toLowerCase();
    const vTel = telefono.trim();
    const vProv = provincia.trim();
    const vCarr = carrera.trim();
    const vMsg = mensaje.trim();

    if (!vNombre || !vMail || !vTel || !vProv || !vCarr || !vMsg) {
      showAlert({ title: 'Todos los campos son obligatorios', type: 'warning' });
      return;
    }
    if (!isEmail(vMail)) {
      showAlert({ title: 'Email inválido', message: 'Ingresá un email válido.', type: 'error' });
      return;
    }

    setSending(true);

    setTimeout(() => {
      setSending(false);
      showAlert({
        title: 'Enviado',
        message: `¡Gracias ${vNombre}! Te contactaremos a la brevedad sobre ${vCarr}.`,
        type: 'success',
        onConfirm: () => {
          setAlert(a => ({ ...a, visible: false }));
          navigation.goBack();
        },
      });
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

          {/*Nombre*/}
          <Text style={s.label}>Nombre</Text>
          <TextInput
            style={s.input}
            placeholder="Tu nombre y apellido"
            placeholderTextColor="#6b7280"
            value={nombre}
            onChangeText={(t) => setNombre(onlyLetters(t))}
            returnKeyType="next"
          />

          {/*Correo*/}
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

          {/*Teléfono*/}
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

          {/*Provincia*/}
          <Text style={s.label}>Provincia</Text>
          <TextInput
            style={s.input}
            placeholder="Ej: Salta"
            placeholderTextColor="#6b7280"
            value={provincia}
            onChangeText={(t) => setProvincia(onlyLetters(t))}
            returnKeyType="next"
          />

          {/* Carrera - Picker con estilos PROBADOS de StudentForm */}
          <Text style={s.label}>Carrera </Text>
          <View style={s.pickerContainer}>
            <Picker
              mode="dropdown"
              selectedValue={carrera}
              onValueChange={(itemValue) => setCarrera(itemValue)}
              dropdownIconColor={COLORS.primary}
              style={s.picker}
            >
              <Picker.Item
                label="Seleccionar carrera"
                value=""
                color="#9ca3af"
              />
              {CARRERAS.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>

          {/*Mensaje*/}
          <Text style={s.label}>Mensaje</Text>
          <TextInput
            style={[s.input, s.textarea]}
            placeholder="Contanos en qué podemos ayudarte…"
            placeholderTextColor="#6b7280"
            value={mensaje}
            onChangeText={setMensaje}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={{ height: SPACING.md }} />

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
  scroll: { 
    paddingHorizontal: SPACING.lg, 
    paddingTop: SPACING.md, 
    paddingBottom: SPACING.lg 
  },
  header: { 
    color: COLORS.text, 
    fontWeight: '700', 
    marginBottom: SPACING.md,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  label: { 
    color: COLORS.text, 
    marginTop: SPACING.md, 
    marginBottom: 6, 
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    color: COLORS.text,
    fontSize: 14,
  },
  textarea: { 
    height: 120, 
    textAlignVertical: 'top', 
    paddingTop: 12, 
    paddingBottom: 12,
    fontSize: 14,
  },
  
  // Picker: sin recortes (59 en Android, 48 iOS) - ESTILOS PROBADOS
pickerContainer: {
  backgroundColor: '#fff',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e5e7eb',
  height: Platform.OS === 'android' ? 59 : 48,
  paddingVertical: Platform.OS === 'android' ? 1 : 0,
  marginBottom: SPACING.md,
},
picker: {
  width: '100%',
  height: '100%',
  color: COLORS.text,
  fontSize: 14, // ← AGREGAR ESTO para que sea igual a los inputs
  marginTop: Platform.OS === 'android' ? -2 : 0,
},
  
  cta: {
    width: '50%',
    alignSelf: 'center',
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  ctaText: { 
    color: '#fff', 
    fontWeight: '800',
    fontSize: 16,
  },
});