// screens/Profile.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut, sendPasswordResetEmail, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';
import { auth } from '../src/config/firebaseConfig';

export default function Profile({ navigation }) {
  const [user, setUser] = useState(auth.currentUser);
  const [showLogout, setShowLogout] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', type: 'info' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // Importante: NO redirigir a Login cuando se cierra sesión aquí,
      // El flujo de Tabs maneja qué hacer (volver a Inicio).
    });
    return () => unsub();
  }, []);

  const avatarUri = user?.photoURL || null;
  const displayName = user?.displayName || 'Usuario';
  const email = user?.email || '—';
  const emailVerified = !!user?.emailVerified;
  const provider = user?.providerData?.[0]?.providerId || '—';
  const uidShort = useMemo(() => (user?.uid ? `${user.uid.slice(0, 6)}…${user.uid.slice(-4)}` : '—'), [user?.uid]);

  const showMsg = (title, message, type = 'info') => setAlert({ visible: true, title, message, type });

  const handleResetPassword = async () => {
    if (!user?.email) return showMsg('Sin email', 'Este usuario no tiene un correo asociado.', 'warning');
    try {
      await sendPasswordResetEmail(auth, user.email);
      showMsg('Correo enviado', 'Te enviamos un enlace para restablecer tu contraseña.', 'success');
    } catch {
      showMsg('Error', 'No pudimos enviar el correo de recuperación.', 'error');
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    if (user.emailVerified) return showMsg('Ya verificado', 'Tu correo ya está verificado.', 'success');
    try {
      await sendEmailVerification(user);
      showMsg('Correo de verificación', 'Te enviamos un enlace para verificar tu correo.', 'success');
    } catch {
      showMsg('Error', 'No pudimos enviar el correo de verificación.', 'error');
    }
  };

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.setItem('rememberMe', 'false');
      setShowLogout(false);
      // Ir al tab Inicio (Home) desde un screen dentro del stack de Perfil:
      navigation.getParent()?.navigate('Inicio');
    } catch {
      setShowLogout(false);
      showMsg('Error', 'No pudimos cerrar la sesión.', 'error');
    }
  };

  // Vista bloqueada si no hay sesión
  if (!user) {
    return (
      <View style={s.safe}>
        <HeaderBar title="Perfil" />
        <View style={[s.section, { alignItems: 'center', paddingVertical: 24 }]}>
          <View style={{ alignItems: 'center', gap: 10 }}>
            <View style={s.avatarPlaceholder}>
              <Ionicons name="person" size={36} color="#9ca3af" />
            </View>
            <Text style={{ fontWeight: '800', color: COLORS.text, fontSize: 16 }}>Acceso restringido</Text>
            <Text style={{ color: '#6b7280', textAlign: 'center', paddingHorizontal: 16 }}>
              Iniciá sesión para acceder a tu perfil.
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.9}
              style={s.loginBtn}
            >
              <Text style={s.loginBtnText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={s.safe}>
      <HeaderBar title="Perfil" />

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
          <View style={s.badgesRow}>
            <View style={[s.badge, emailVerified ? s.badgeOk : s.badgeWarn]}>
              <Ionicons name={emailVerified ? 'shield-checkmark' : 'shield-outline'} size={14} />
              <Text style={s.badgeText}>{emailVerified ? 'Email verificado' : 'Email no verificado'}</Text>
            </View>
            <View style={s.badge}>
              <Ionicons name="id-card-outline" size={14} />
              <Text style={s.badgeText}>{provider}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <ActionRow icon="pencil" label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
        <ActionRow icon="mail-outline" label={emailVerified ? 'Reenviar verificación' : 'Verificar correo'} onPress={handleVerifyEmail} />
        <ActionRow icon="key-outline" label="Cambiar contraseña" onPress={handleResetPassword} />
      </View>

      <View style={s.section}>
        <ActionRow icon="exit-outline" label="Cerrar sesión" danger onPress={() => setShowLogout(true)} />
      </View>

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
        <Ionicons name={icon} size={18} />
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

  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f9fafb', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1, borderColor: '#e5e7eb',
  },
  badgeOk: { backgroundColor: '#ecfdf5', borderColor: '#d1fae5' },
  badgeWarn: { backgroundColor: '#fff7ed', borderColor: '#ffedd5' },
  badgeText: { fontSize: 12 },

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

  // CTA login en vista bloqueada
  loginBtn: {
    marginTop: SPACING.sm,
    backgroundColor: '#7c2325',
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { color: '#fff', fontWeight: '700' },
});
