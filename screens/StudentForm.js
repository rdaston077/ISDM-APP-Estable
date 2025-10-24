// screens/StudentForm.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, Platform, Pressable, Modal
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import ISDMAlert from '../components/ISDMAlert';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { getStudent, createStudent, updateStudent } from '../src/services/students';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CAREERS = [
  'Tec. Análisis de Sistemas',
  'Profesorado de Inglés',
  'Profesorado de Educación Inicial',
  'Profesorado de Educación Primaria',
  'Psicopedagogía',
  'Educación Especial (Discapacidad Intelectual)',
];

const STATUSES = ['activo', 'pendiente', 'inactivo'];

// Utilidad: Date -> "DD/MM/YYYY"
const toDDMMYYYY = (dateObj) => {
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Email básico (robusto y simple)
const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());

export default function StudentForm({ route, navigation }) {
  const { id } = route.params || {};
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '', // string DD/MM/YYYY
    phoneMobile: '',
    phoneHome: '',
    email: '',
    // 👇 Solo en NUEVO usamos placeholder vacío; en EDITAR se completa luego con los datos
    career: isEdit ? CAREERS[0] : '',
    status: isEdit ? 'activo' : '',
    avatar: '', // URL (vacío => silueta)
  });

  const [saving, setSaving] = useState(false);

  // DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateTmp, setDateTmp] = useState(new Date(2000, 0, 1));

  // Modal URL foto
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  // ISDMAlert
  const [alert, setAlert] = useState({
    visible: false, title: '', message: '', type: 'info',
    onConfirm: () => setAlert(a => ({ ...a, visible: false })),
  });
  const showAlert = (opts) =>
    setAlert(a => ({
      ...a,
      visible: true,
      ...opts,
      onConfirm: opts?.onConfirm || (() => setAlert(p => ({ ...p, visible: false }))),
    }));

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const d = await getStudent(id);
      if (d) {
        setForm((p) => ({
          ...p,
          ...d,
          birthDate: d.birthDate || '',
          avatar: d.avatar || '',
          // career/status vienen del doc
        }));
        if (d?.birthDate) {
          const [dd, mm, yyyy] = d.birthDate.split('/');
          const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
          if (!isNaN(parsed.getTime())) setDateTmp(parsed);
        }
      }
    })();
  }, [id, isEdit]);

  // ✅ Validación suave (obligatorios excepto Teléfono fijo)
  const isValid = useMemo(() => {
    return (
      form.firstName?.trim() &&
      form.lastName?.trim() &&
      form.dni?.trim() &&
      form.birthDate?.trim() &&
      form.phoneMobile?.trim() &&
      form.email?.trim() &&
      isEmail(form.email) &&
      form.career?.trim() &&
      form.status?.trim()
    );
  }, [form]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = async () => {
    if (!isValid) {
      showAlert({
        title: 'Aviso',
        message: 'Complete los campos obligatorios.',
        type: 'warning',
      });
      return;
    }
    try {
      setSaving(true);
      if (isEdit) {
        await updateStudent(id, form);
      } else {
        await createStudent(form);
      }
      navigation.goBack();
    } catch (e) {
      showAlert({
        title: 'Error',
        message: 'No se pudo guardar.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const openDatePicker = () => {
    if (form.birthDate) {
      const [dd, mm, yyyy] = form.birthDate.split('/');
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (!isNaN(parsed.getTime())) setDateTmp(parsed);
    }
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDateTmp(selectedDate);
      set('birthDate', toDDMMYYYY(selectedDate));
    }
  };

  // DNI solo números
  const onChangeDni = (text) => {
    const digits = text.replace(/[^0-9]/g, '');
    set('dni', digits);
  };

  // Nombre/Apellido: solo letras (con acentos), espacio, ñ y apóstrofe
  const cleanName = (text) =>
    text.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ' ]/g, '');

  // Modal URL handlers
  const openUrlModal = () => {
    setTempUrl(form.avatar || '');
    setShowUrlModal(true);
  };
  const applyUrl = () => {
    set('avatar', tempUrl.trim());
    setShowUrlModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar
        title="Instituto Superior del Milagro"
        showBack
        onBackPress={() => navigation.goBack()}
        bottomSpacing={12}
      />

      {/* Scroll que se ajusta al teclado */}
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={140}
        keyboardOpeningTime={0}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xl + 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.screenTitle}>{isEdit ? 'Editar Alumno' : 'Nuevo Alumno'}</Text>

        {/* Avatar / Silueta */}
        <View style={{ alignItems: 'center', marginBottom: SPACING.md }}>
          {form.avatar ? (
            <Image source={{ uri: form.avatar }} style={s.avatarImg} />
          ) : (
            <View style={s.avatarPlaceholder}>
              <Ionicons name="person" size={42} color="#9ca3af" />
            </View>
          )}

        <TouchableOpacity style={s.btnGhost} onPress={openUrlModal}>
            <Text style={s.btnGhostText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Campos */}
        <Labeled label="Apellido *">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.lastName}
              onChangeText={(v) => set('lastName', cleanName(v))}
            />
          </View>
        </Labeled>

        <Labeled label="Nombre *">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.firstName}
              onChangeText={(v) => set('firstName', cleanName(v))}
            />
          </View>
        </Labeled>

        <Labeled label="Fecha de Nacimiento *">
          <Pressable style={[s.field, s.fieldRow]} onPress={openDatePicker}>
            <Text style={{ color: form.birthDate ? COLORS.text : '#9ca3af' }}>
              {form.birthDate || 'Seleccionar fecha'}
            </Text>
            <Ionicons name="calendar" size={18} color={COLORS.primary} />
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={dateTmp}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
              themeVariant="light"
            />
          )}
        </Labeled>

        <Labeled label="DNI *">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.dni}
              onChangeText={onChangeDni}
              keyboardType="numeric"
            />
          </View>
        </Labeled>

        <Labeled label="Celular *">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.phoneMobile}
              onChangeText={(v) => set('phoneMobile', v)}
              keyboardType="phone-pad"
            />
          </View>
        </Labeled>

        <Labeled label="Teléfono">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.phoneHome}
              onChangeText={(v) => set('phoneHome', v)}
              keyboardType="phone-pad"
            />
          </View>
        </Labeled>

        <Labeled label="Email *">
          <View style={s.field}>
            <TextInput
              style={s.input}
              value={form.email}
              onChangeText={(v) => set('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </Labeled>

        {/* Picker Carrera (con placeholder en NUEVO) */}
        <Labeled label="Carrera *">
          <View style={s.pickerContainer}>
            <Picker
              mode="dropdown"
              selectedValue={form.career}
              onValueChange={(v) => set('career', v)}
              dropdownIconColor={COLORS.primary}
              style={s.picker}
            >
              {!isEdit && (
                <Picker.Item
                  label="Seleccionar carrera"
                  value=""
                  enabled={false}
                  color="#9ca3af"
                />
              )}
              {CAREERS.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
          </View>
        </Labeled>

        {/* Picker Estado (con placeholder en NUEVO) */}
        <Labeled label="Estado *">
          <View style={s.pickerContainer}>
            <Picker
              mode="dropdown"
              selectedValue={form.status}
              onValueChange={(v) => set('status', v)}
              dropdownIconColor={COLORS.primary}
              style={s.picker}
            >
              {!isEdit && (
                <Picker.Item
                  label="Seleccionar estado"
                  value=""
                  enabled={false}
                  color="#9ca3af"
                />
              )}
              <Picker.Item label="Activo" value="activo" />
              <Picker.Item label="Pendiente" value="pendiente" />
              <Picker.Item label="Inactivo" value="inactivo" />
            </Picker>
          </View>
        </Labeled>

        {/* Leyenda de campos obligatorios */}
        <Text style={s.requiredNote}>* Campos obligatorios</Text>

        {/* Acciones */}
        <View style={s.actions}>
          <TouchableOpacity style={[s.btn, s.btnGhost2]} onPress={() => navigation.goBack()}>
            <Text style={[s.btnText, { color: COLORS.text }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: COLORS.primary }]}
            onPress={onSave}
            disabled={saving}
          >
            <Text style={s.btnText}>{saving ? 'Guardando…' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal URL */}
      <Modal
        visible={showUrlModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUrlModal(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>URL de la foto</Text>
            <View style={{ height: 8 }} />
            <TextInput
              style={[s.input, { width: '100%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12 }]}
              placeholder="https://…"
              placeholderTextColor="#9ca3af"
              value={tempUrl}
              onChangeText={setTempUrl}
              autoCapitalize="none"
            />
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity style={[s.btn, s.btnGhost2]} onPress={() => setShowUrlModal(false)}>
                <Text style={[s.btnText, { color: COLORS.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.primary }]} onPress={applyUrl}>
                <Text style={s.btnText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ISDMAlert */}
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

// 🔧 Labeled ya NO envuelve con s.field (evita doble contenedor)
function Labeled({ label, children }) {
  return (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'left',
    marginBottom: SPACING.md,
  },
  // Avatar
  avatarImg: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eee' },
  avatarPlaceholder: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#e5e7eb',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#d1d5db',
  },
  btnGhost: {
    marginTop: 10, alignSelf: 'center', paddingHorizontal: 14, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  btnGhostText: { color: COLORS.text, fontWeight: '700' },

  // Campos
  label: { color: '#374151', marginBottom: 6, fontWeight: '700' },
  field: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: { color: COLORS.text, padding: 0, height: 48 },

  // Picker: sin recortes (59 en Android, 48 iOS)
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: Platform.OS === 'android' ? 59 : 48,
    paddingVertical: Platform.OS === 'android' ? 1 : 0,
  },
  picker: {
    width: '100%',
    height: '100%',
    color: COLORS.text,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },

  // Leyenda y acciones
  requiredNote: { color: '#7c2325', fontSize: 13, marginTop: 6, marginBottom: SPACING.sm, textAlign: 'right' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: SPACING.md },
  btn: { paddingHorizontal: 16, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnGhost2: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnText: { color: '#fff', fontWeight: '800' },

  // Modal URL
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalCard: {
    width: '86%', backgroundColor: '#fff', borderRadius: 12, padding: SPACING.md,
  },
  modalTitle: { fontWeight: '800', color: COLORS.text, fontSize: 16 },
});
