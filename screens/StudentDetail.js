// screens/StudentDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { getStudent, removeStudent } from '../src/services/students';
import ISDMAlert from '../components/ISDMAlert';

function Chip({ value }) {
  const map = {
    activo: { label: 'ACTIVO', bg: '#16a34a22', fg: '#16a34a' },
    pendiente: { label: 'PENDIENTE', bg: '#eab30822', fg: '#eab308' },
    inactivo: { label: 'INACTIVO', bg: '#dc262622', fg: '#dc2626' },
  };
  const { label, bg, fg } = map[value] ?? map.activo;
  return <View style={[s.chip, { backgroundColor: bg }]}><Text style={[s.chipText, { color: fg }]}>{label}</Text></View>;
}

export default function StudentDetail({ route, navigation }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);

  // ISDMAlert states
  const [showConfirm, setShowConfirm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('No se pudo eliminar');

  useEffect(() => {
    (async () => {
      const st = await getStudent(id);
      setData(st);
    })();
  }, [id]);

  const onDelete = () => setShowConfirm(true);

  const confirmDelete = async () => {
    try {
      await removeStudent(id);
      setShowConfirm(false);
      navigation.goBack();
    } catch (e) {
      setShowConfirm(false);
      setErrorMsg('No se pudo eliminar');
      setShowError(true);
    }
  };

  if (!data) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <HeaderBar title="Detalle de Alumno" showBack onBackPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <HeaderBar title="Detalle de Alumno" showBack onBackPress={() => navigation.goBack()} />
      <View style={{ alignItems: 'center', paddingTop: SPACING.md }}>
        {data.avatar ? (
          <Image source={{ uri: data.avatar }} style={s.avatarLg} />
        ) : (
          <View style={s.avatarPlaceholder}>
            <Ionicons name="person" size={42} color="#9ca3af" />
          </View>
        )}
      </View>

      <View style={s.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={s.h1}>{data.lastName}, {data.firstName}</Text>
            <Text style={s.sub}>DNI: {data.dni}</Text>
          </View>
          <Chip value={data.status} />
        </View>

        <View style={s.grid}>
          <View style={s.col}>
            <Text style={s.label}>Nacimiento</Text>
            <Text style={s.val}>{data.birthDate || '-'}</Text>

            <Text style={s.label}>Celular</Text>
            <Text style={s.val}>{data.phoneMobile || '-'}</Text>

            <Text style={s.label}>Email</Text>
            <Text style={s.val}>{data.email || '-'}</Text>
          </View>

          <View style={s.col}>
            {/* Sexo eliminado */}
            <Text style={s.label}>Teléfono</Text>
            <Text style={s.val}>{data.phoneHome || '-'}</Text>

            <Text style={s.label}>Carrera</Text>
            <Text style={s.val}>{data.career || '-'}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: SPACING.md }}>
          <TouchableOpacity
            style={[s.btn, { backgroundColor: COLORS.primary }]}
            onPress={() => navigation.navigate('StudentForm', { id })}
          >
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={s.btnText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.btn, { backgroundColor: '#b91c1c' }]} onPress={onDelete}>
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={s.btnText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirmar eliminación */}
      <ISDMAlert
        visible={showConfirm}
        title="Eliminar"
        message={`¿Esta seguro que desea eliminar a ${data?.firstName} ${data?.lastName}?`}
        type="warning"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
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

const s = StyleSheet.create({
  avatarLg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
  avatarPlaceholder: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#e5e7eb',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#d1d5db',
  },
  card: {
    margin: SPACING.lg, backgroundColor: '#fff', borderRadius: 12, padding: SPACING.md,
    borderWidth: 1, borderColor: '#eee',
  },
  h1: { fontWeight: '800', fontSize: 18, color: '#111827' },
  sub: { color: '#6b7280', marginTop: 2 },
  chip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start' },
  chipText: { fontWeight: '700', fontSize: 12 },
  grid: { flexDirection: 'row', gap: 20, marginTop: SPACING.md },
  col: { flex: 1, gap: 10 },
  label: { color: '#6b7280', fontSize: 12 },
  val: { color: '#111827', fontSize: 14 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 40, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '800' },
});
