// screens/EditProfile.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { updateProfile } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

export default function EditProfile({ navigation }) {
  const u = auth.currentUser;
  const [displayName, setDisplayName] = useState(u?.displayName || '');
  const [photoURL, setPhotoURL] = useState(u?.photoURL || '');
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!u) navigation.replace('Login'); }, [u, navigation]);

  const showMsg = (title, message, type = 'info') =>
    setAlert({ visible: true, title, message, type });

  const onSave = async () => {
    if (!auth.currentUser) return;
    const name = displayName.trim();
    const url = photoURL.trim() || null;
    if (!name) return showMsg('Faltan datos', 'El nombre no puede estar vacío.', 'warning');

    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: url });
      showMsg('Perfil actualizado', 'Tus cambios se guardaron correctamente.', 'success');
    } catch (err) {
      console.error(err);
      showMsg('Error', 'No se pudo actualizar el perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.safe}>
      <HeaderBar title="Editar perfil" showBack onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.label}>Nombre para mostrar</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={s.input}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor="#9ca3af"
          />

          <Text style={[s.label, { marginTop: SPACING.md }]}>URL de foto (opcional)</Text>
          <TextInput
            value={photoURL}
            onChangeText={setPhotoURL}
            style={s.input}
            placeholder="https://…"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity onPress={onSave} disabled={saving} activeOpacity={0.85} style={[s.btn, saving && { opacity: 0.6 }]}>
            <Text style={s.btnText}>{saving ? 'Guardando…' : 'Guardar cambios'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ISDMAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={() => {
          setAlert({ ...alert, visible: false });
          if (alert.type === 'success') navigation.goBack();
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  body: { padding: SPACING.lg, gap: 8 },
  label: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: COLORS.text,
  },
  btn: {
    marginTop: SPACING.lg,
    backgroundColor: '#7c2325',
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
