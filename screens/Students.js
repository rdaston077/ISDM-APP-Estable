// screens/Students.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Image, TouchableOpacity,
  Platform, Dimensions, FlatList, Modal, ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { subscribeStudents, removeStudent } from '../src/services/students';
import ISDMAlert from '../components/ISDMAlert';

const TAB_GAP_6P = Math.round(Dimensions.get('window').height * 0.06);
const FAB_DOWN_4P = Math.round(Dimensions.get('window').height * 0.04);

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

// Modal de filtros
function FilterModal({ visible, title, options, selected, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalOptions}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selected === option.value && styles.optionSelected
                ]}
                onPress={() => onSelect(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  selected === option.value && styles.optionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selected === option.value && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Students({ navigation }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  
  // Filtros
  const [sortBy, setSortBy] = useState('a-z');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [careerFilter, setCareerFilter] = useState('todas');
  
  // Modales
  const [showSortModal, setShowSortModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);

  // ISDMAlert states
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStudent, setPendingStudent] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('No se pudo eliminar');

  useEffect(() => {
    const unsub = subscribeStudents(setItems);
    return () => unsub && unsub();
  }, []);

  // Opciones de filtros
  const sortOptions = [
    { label: 'A-Z', value: 'a-z' },
    { label: 'Z-A', value: 'z-a' },
    { label: 'Reciente', value: 'reciente' },
    { label: 'Antiguo', value: 'antiguo' },
  ];

  const statusOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Activo', value: 'activo' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Inactivo', value: 'inactivo' },
  ];

  const careerOptions = [
    { label: 'Todas', value: 'todas' },
    { label: 'Tec. Análisis de Sistemas', value: 'Tec. Análisis de Sistemas' },
    { label: 'Profesorado de Inglés', value: 'Profesorado de Inglés' },
    { label: 'Profesorado de Educación Inicial', value: 'Profesorado de Educación Inicial' },
    { label: 'Profesorado de Educación Primaria', value: 'Profesorado de Educación Primaria' },
    { label: 'Psicopedagogía', value: 'Psicopedagogía' },
    { label: 'Educación Especial (Discapacidad Intelectual)', value: 'Educación Especial (Discapacidad Intelectual)' },
  ];

  const filteredAndSorted = useMemo(() => {
    let result = items.filter((s) => {
      // Filtro de búsqueda
      const q = query.trim().toLowerCase();
      if (q) {
        const name = `${s.firstName ?? ''} ${s.lastName ?? ''}`.toLowerCase();
        const dni = String(s.dni ?? '').replace(/\./g, '').toLowerCase();
        if (!name.includes(q) && !dni.includes(q)) return false;
      }

      // Filtro de estado
      if (statusFilter !== 'todos' && s.status !== statusFilter) return false;

      // Filtro de carrera
      if (careerFilter !== 'todas' && s.career !== careerFilter) return false;

      return true;
    });

    // Ordenamiento
    result.sort((a, b) => {
      switch (sortBy) {
        case 'a-z':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'z-a':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'reciente':
          return (b.createdAt || 0) - (a.createdAt || 0);
        case 'antiguo':
          return (a.createdAt || 0) - (b.createdAt || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [items, query, sortBy, statusFilter, careerFilter]);

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

  const getFilterLabel = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : '';
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
        />
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.filterText}>Orden: {getFilterLabel(sortBy, sortOptions)}</Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowStatusModal(true)}
        >
          <Text style={styles.filterText}>Estado: {getFilterLabel(statusFilter, statusOptions)}</Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowCareerModal(true)}
        >
          <Text style={styles.filterText}>Carrera: {getFilterLabel(careerFilter, careerOptions)}</Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Contador */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Mostrando: {filteredAndSorted.length} de {items.length}
        </Text>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredAndSorted}
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

      {/* Modales de filtros */}
      <FilterModal
        visible={showSortModal}
        title="Ordenar por"
        options={sortOptions}
        selected={sortBy}
        onSelect={setSortBy}
        onClose={() => setShowSortModal(false)}
      />

      <FilterModal
        visible={showStatusModal}
        title="Filtrar por estado"
        options={statusOptions}
        selected={statusFilter}
        onSelect={setStatusFilter}
        onClose={() => setShowStatusModal(false)}
      />

      <FilterModal
        visible={showCareerModal}
        title="Filtrar por carrera"
        options={careerOptions}
        selected={careerFilter}
        onSelect={setCareerFilter}
        onClose={() => setShowCareerModal(false)}
      />

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
  
  // Filtros
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  
  // Contador
  counterContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: SPACING.sm,
  },
  counterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Card (manteniendo el estilo original)
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
      default: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 } 
    }),
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginTop: 2 
  },
  avatarPlaceholder: {
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    marginTop: 2,
    backgroundColor: '#e5e7eb', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1, 
    borderColor: '#d1d5db',
  },
  name: { 
    color: COLORS.text, 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 2 
  },
  meta: { 
    color: '#6b7280', 
    fontSize: 12, 
    lineHeight: 16 
  },
  chip: { 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999 
  },
  chipText: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  actions: { 
    marginLeft: 8, 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 10 
  },
  iconBtn: {
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f9fafb', 
    borderWidth: 1, 
    borderColor: '#e5e7eb',
  },
  deleteRing: { 
    borderColor: '#fecaca', 
    backgroundColor: '#fef2f2' 
  },
  fab: {
    position: 'absolute', 
    right: 20,
    bottom: Math.max(12, TAB_GAP_6P + 24 - FAB_DOWN_4P),
    width: 56, 
    height: 56,
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.primary,
    ...Platform.select({ 
      android: { elevation: 4 }, 
      default: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 } 
    }),
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  modalOptions: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionSelected: {
    backgroundColor: '#f8fafc',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
});