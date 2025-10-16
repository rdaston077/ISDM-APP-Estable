// screens/Carreras.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

// mismas imágenes que usás en Home
const CAREERS = [
  {
    id: 'ed-esp',
    title:
      'PROFESORADO DE EDUCACIÓN ESPECIAL CON ORIENTACIÓN EN DISCAPACIDAD INTELECTUAL',
    image: require('../assets/home/carrera-educacion-especial.jpg'),
  },
  { id: 'primaria', title: 'PROFESORADO DE EDUCACIÓN PRIMARIA', image: require('../assets/home/carrera-primaria.jpg') },
  { id: 'ingles', title: 'PROFESORADO DE INGLÉS', image: require('../assets/home/carrera-ingles.jpg') },
  { id: 'inicial', title: 'PROFESORADO DE EDUCACIÓN INICIAL', image: require('../assets/home/carrera-inicial.jpg') },
  { id: 'psico', title: 'PSICOPEDAGOGÍA', image: require('../assets/home/carrera-psicopedagogia.jpg') },
  {
    id: 'tss',
    title: 'TECNICATURA SUPERIOR EN ANÁLISIS DE SISTEMAS INFORMÁTICOS',
    image: require('../assets/home/carrera-analisis-sistemas.jpg'),
  },
];

export default function Carreras({ navigation }) {
  return (
    <View style={s.safe}>
      <HeaderBar
        title="Instituto Superior del Milagro"
        showBack
        onBackPress={() => navigation.goBack()}
        bottomSpacing={12}
      />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo centrado + título centrado */}
        <View style={s.centerHead}>
          <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
          <Text style={s.centerTitle}>NUESTRAS CARRERAS</Text>
        </View>

        {/* Cards apiladas (sin cambios) */}
        {CAREERS.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => {
              // luego podés navegar a un detalle
              // navigation.navigate('CarreraDetalle', { id: item.id })
            }}
          >
            <ImageBackground source={item.image} style={s.card} imageStyle={s.cardImg}>
              <View style={s.cardOverlay} />
              <Text style={s.cardTitle}>{item.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}

        {/* Respiro para la tab bar */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  // Encabezado centrado
  centerHead: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logo: { width: 100, height: 100, marginBottom: SPACING.xs },
  centerTitle: {
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  // Card de carrera
  card: {
    height: 160,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#ddd',
    ...Platform.select({
      android: { elevation: 2 },
      default: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
    }),
  },
  cardImg: { borderRadius: 14 },
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  cardTitle: { color: '#fff', fontWeight: '800', fontSize: 12, padding: 12 },
});
