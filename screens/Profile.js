// screens/Profile.js
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';
import { auth } from '../src/config/firebaseConfig';

export default function Profile({ navigation }) {
  const user = auth.currentUser; // puede ser null si no hay sesión
  const [showLogout, setShowLogout] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' });

  const avatarUri = user?.photoURL || null;
  const displayName = user?.displayName || 'Usuario';
  const email = user?.email || '—';
  const uidShort = useMemo(() => (user?.uid ? `${user.uid.slice(0, 6)}…${user.uid.slice(-4)}` : '—'), [user?.uid]);

  const showMsg = (title, message, type = 'info') =>
    setAlert({ visible: true, title, message, type });

  const handleResetPassword = async () => {
    if (!user?.email) {
      showMsg('Sin email', 'Este usuario no tiene un correo asociado.', 'warning');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      showMsg('Correo enviado', 'Te enviamos un enlace para restablecer tu contraseña.', 'success');
    } catch (err) {
      console.error(err);
      showMsg('Error', 'No pudimos enviar el correo de recuperación.', 'error');
    }
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.setItem('rememberMe', 'false');
      setShowLogout(false);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (err) {
      console.error(err);
      setShowLogout(false);
      showMsg('Error', 'No pudimos cerrar la sesión.', 'error');
    }
  };

  return (
    <View style={s.safe}>
      <HeaderBar title="Perfil" />

      {/* Header de usuario */}
      <View style={s.headerCard}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={s.avatar} />
        ) : (
          <View style={s.avatarPlaceholder}>
            <Ionicons name="person" size={36} color="#9ca3af" />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{displayName}</Text>
          <Text style={s.email}>{email}</Text>
          <Text style={s.uid}>ID: {uidShort}</Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={s.section}>
        <ActionRow
          icon="pencil"
          label="Editar perfil"
          onPress={() => {
            // si luego creamos una pantalla EditProfile, navega allí
            // navigation.navigate('EditProfile');
            showMsg('Próximamente', 'La edición de perfil estará disponible pronto.', 'info');
          }}
        />
        <ActionRow
          icon="key-outline"
          label="Cambiar contraseña"
          onPress={handleResetPassword}
        />
        <ActionRow
          icon="settings-outline"
          label="Preferencias"
          onPress={() => {
            // navigation.navigate('Preferences');
            showMsg('Próximamente', 'Las preferencias estarán disponibles pronto.', 'info');
          }}
        />
      </View>

      <View style={s.section}>
        <ActionRow
          icon="exit-outline"
          label="Cerrar sesión"
          danger
          onPress={() => setShowLogout(true)}
        />
      </View>

      {/* Modal confirm LOGOUT */}
      <ISDMAlert
        visible={showLogout}
        title="Cerrar sesión"
        message="¿Desea cerrar la sesión actual?"
        type="warning"
        cancelText="Cancelar"
        confirmText="Aceptar"
        onCancel={() => setShowLogout(false)}
        onConfirm={confirmLogout}
      />

      {/* Alert informativo */}
      <ISDMAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
}

function ActionRow({ icon, label, onPress, danger = false }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={s.row}>
      <View style={[s.rowIcon, danger && s.rowIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? '#dc2626' : '#374151'} />
      </View>
      <Text style={[s.rowText, danger && s.rowTextDanger]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  avatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#d1d5db',
  },
  name: { fontSize: 18, fontWeight: '800', color: '#111827' },
  email: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  uid: { fontSize: 12, color: '#9ca3af', marginTop: 2 },

  section: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  rowIcon: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb',
  },
  rowIconDanger: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  rowText: { flex: 1, color: COLORS.text, fontSize: 15, fontWeight: '600' },
  rowTextDanger: { color: '#dc2626' },
});
