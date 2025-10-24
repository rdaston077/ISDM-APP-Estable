// screens/Students.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image, TouchableOpacity,
  Platform, Dimensions, FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { subscribeStudents, removeStudent } from '../src/services/students';
import ISDMAlert from '../components/ISDMAlert';

const TAB_GAP_6P = Math.round(Dimensions.get('window').height * 0.06);
const FAB_DOWN_4P = Math.round(Dimensions.get('window').height * 0.04); // ↓ mover FAB ~4%

// Chip de estado
function StatusChip({ value }) {
  const map = {
    activo: { label: 'ACTIVO', bg: '#16a34a22', fg: '#16a34a' },
    pendiente: { label: 'PENDIENTE', bg: '#eab30822', fg: '#eab308' },
    inactivo: { label: 'INACTIVO', bg: '#dc262622', fg: '#dc2626' },
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
  const [items, setItems] = useState([]);

  // ISDMAlert states
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('No se pudo eliminar');

  useEffect(() => {
    const unsub = subscribeStudents(setItems);
    return () => unsub && unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => {
      const name = `${s.firstName ?? ''} ${s.lastName ?? ''}`.toLowerCase();
      const dni = String(s.dni ?? '').replace(/\./g, '').toLowerCase();
      return name.includes(q) || dni.includes(q);
    });
  }, [items, query]);

  const onView = (s) => navigation.navigate('StudentDetail', { id: s.id });
  const onEdit = (s) => navigation.navigate('StudentForm', { id: s.id });

  const onDelete = (s) => {
    setPendingStudent(s);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingStudent) return;
    try {
      await removeStudent(pendingStudent.id);
      setShowConfirm(false);
      setPendingStudent(null);
    } catch (e) {
      setShowConfirm(false);
      setErrorMsg('No se pudo eliminar');
      setShowError(true);
    }
  };

  const renderItem = ({ item: s }) => (
    <View style={styles.card}>
      {s.avatar ? (
        <Image source={{ uri: s.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={26} color="#9ca3af" />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>
          {s.firstName} <Text style={{ fontWeight: '800' }}>{s.lastName}</Text>
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

      <View style={styles.actions}>
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
  );

  return (
    <View style={styles.safe}>
      <HeaderBar title="Gestión de Alumnos" showBack={false} bottomSpacing={8} />

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar alumnos por nombre o DNI…"
          placeholderTextColor="#9ca3af"
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: TAB_GAP_6P + SPACING.lg }}
      />

      {/* FAB crear */}
      <TouchableOpacity
        onPress={() => navigation.navigate('StudentForm')}
        style={styles.fab}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Confirmar eliminación */}
      <ISDMAlert
        visible={showConfirm}
        title="Eliminar"
        message={
          pendingStudent
            ? `¿Esta seguro que desea eliminar a ${pendingStudent.firstName} ${pendingStudent.lastName}?`
            : '¿Esta seguro que desea eliminar a ?'
        }
        type="warning"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => { setShowConfirm(false); setPendingStudent(null); }}
      />

      {/* Error */}
      <ISDMAlert
        visible={showError}
        title="Error"
        message={errorMsg}
        type="error"
        confirmText="Entendido"
        onConfirm={() => setShowError(false)}
      />
    </View>
  );
}

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: {
    marginHorizontal: SPACING.lg, marginTop: SPACING.md, marginBottom: SPACING.sm,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb',
    paddingHorizontal: 12, height: 40, alignItems: 'center', flexDirection: 'row',
    ...Platform.select({ android: { elevation: 1 }, default: { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3 } }),
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14, padding: 0 },
  
  card:
  {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#fff',
    borderRadius: CARD_RADIUS, borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: SPACING.md,
    ...Platform.select({ android: { elevation: 1 }, default: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 } }),
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginTop: 2 },
  avatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22, marginTop: 2,
    backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#d1d5db',
  },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  meta: { color: '#6b7280', fontSize: 12, lineHeight: 16 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 12, fontWeight: '700' },
  actions: { marginLeft: 8, alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb',
  },
  deleteRing: { borderColor: '#fecaca', backgroundColor: '#fef2f2' },
  fab: {
    position: 'absolute', right: 20,
    bottom: Math.max(12, TAB_GAP_6P + 24 - FAB_DOWN_4P), // ↓ 4% más abajo
    width: 56, height: 56,
    borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary,
    ...Platform.select({ android: { elevation: 4 }, default: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 } }),
  },
});
