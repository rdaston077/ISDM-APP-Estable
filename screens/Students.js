// screens/Students.js
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

const TAB_GAP_6P = Math.round(Dimensions.get('window').height * 0.06);

// ——— Datos de ejemplo (Remplazar por datos reales de Firebase) ———
const STUDENTS = [
  {
    id: '1',
    firstName: 'Sofía',
    lastName: 'García',
    dni: '12.345.678-9',
    career: 'Ingeniería\nInformática',
    status: 'activo', // 'activo' | 'pendiente' | 'inactivo'
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'López',
    dni: '98.765.432-1',
    career: 'Derecho',
    status: 'pendiente',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Martínez',
    dni: '11.223.344-5',
    career: 'Medicina',
    status: 'activo',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: '4',
    firstName: 'Miguel',
    lastName: 'Pérez',
    dni: '55.667.788-9',
    career: 'Administración\nde Empresas',
    status: 'inactivo',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: '5',
    firstName: 'Laura',
    lastName: 'Sánchez',
    dni: '99.887.766-0',
    career: 'Diseño\nGráfico',
    status: 'activo',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: '6',
    firstName: 'Javier',
    lastName: 'Ruiz',
    dni: '10.203.040-5',
    career: 'Psicología',
    status: 'pendiente',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
  },
  {
    id: '7',
    firstName: 'Isabel',
    lastName: 'Fernández',
    dni: '23.456.789-0',
    career: 'Arquitectura',
    status: 'activo',
    avatar: 'https://randomuser.me/api/portraits/women/14.jpg',
  },
  {
    id: '8',
    firstName: 'Ricardo',
    lastName: 'Gómez',
    dni: '34.567.890-1',
    career: 'Comunicación\nAudiovisual',
    status: 'inactivo',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
  },
];

// Chip de estado
function StatusChip({ value }) {
  const map = {
    activo: { label: 'Activo', bg: '#16a34a22', fg: '#16a34a' },
    pendiente: { label: 'Pendiente', bg: '#eab30822', fg: '#eab308' },
    inactivo: { label: 'Inactivo', bg: '#dc262622', fg: '#dc2626' },
  };
  const { label, bg, fg } = map[value] ?? map.activo;
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export default function Students({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STUDENTS;
    return STUDENTS.filter((s) => {
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();
      return name.includes(q) || s.dni.replaceAll('.', '').toLowerCase().includes(q);
    });
  }, [query]);

  const onView = (s) => Alert.alert('Ver', `${s.firstName} ${s.lastName}`);
  const onEdit = (s) => Alert.alert('Editar', `${s.firstName} ${s.lastName}`);
  const onDelete = (s) =>
    Alert.alert('Eliminar', `¿Eliminar a ${s.firstName} ${s.lastName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <View style={styles.safe}>
      <HeaderBar title="Gestión de Alumnos" showBack={false} bottomSpacing={8} />

      {/* Buscador */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar alumnos por nombre o DNI…"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {filtered.map((s) => (
          <View key={s.id} style={styles.card}>
            {/* Col izq: avatar */}
            <Image source={{ uri: s.avatar }} style={styles.avatar} />

            {/* Centro: datos */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {s.firstName}{' '}
                <Text style={{ fontWeight: '800' }}>{s.lastName}</Text>
              </Text>
              <Text style={styles.meta}>DNI: {s.dni}</Text>

              <View style={{ height: 4 }} />
              <StatusChip value={s.status} />

              <View style={{ height: 10 }} />
              <Text style={styles.meta}>
                <Text style={{ fontWeight: '700', color: COLORS.text }}>Carrera:{'\n'}</Text>
                {s.career}
              </Text>
            </View>

            {/* Derecha: acciones */}
            <View style={styles.actions}>
              {/* Estado visual ya está a la izquierda con chip; acá dejamos el ícono de “estado” como en wireframe */}
              <View style={styles.iconBtn}>
                <MaterialCommunityIcons
                  name={
                    s.status === 'activo'
                      ? 'check-decagram-outline'
                      : s.status === 'pendiente'
                      ? 'progress-clock'
                      : 'close-octagon-outline'
                  }
                  size={18}
                  color={s.status === 'activo' ? '#16a34a' : s.status === 'pendiente' ? '#eab308' : '#dc2626'}
                />
              </View>

              <TouchableOpacity onPress={() => onView(s)} style={styles.iconBtn}>
                <Ionicons name="eye-outline" size={18} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onEdit(s)} style={styles.iconBtn}>
                <Ionicons name="pencil-outline" size={18} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onDelete(s)} style={[styles.iconBtn, styles.deleteRing]}>
                <Ionicons name="trash-outline" size={18} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* respiración para que no “choque” con la tab bar elevada */}
        <View style={{ height: TAB_GAP_6P + SPACING.lg }} />
      </ScrollView>
    </View>
  );
}

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      android: { elevation: 1 },
      default: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3 },
    }),
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14, padding: 0 },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: SPACING.md,
    ...Platform.select({
      android: { elevation: 1 },
      default: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
    }),
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginTop: 2 },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  meta: { color: '#6b7280', fontSize: 12, lineHeight: 16 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
  actions: { marginLeft: 8, alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  deleteRing: { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
});
