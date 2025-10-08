// screens/Home.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';

// Helper: permite pasar requeridas (local) o URL remota si algún día las traes de la web
const getSource = (img) => (typeof img === 'string' ? { uri: img } : img);

const { width: WIN_W } = Dimensions.get('window');
const MAX_CONTENT = 420; // ancho máx. de la columna central

// Hero “Inscripciones…”
const HERO = {
  title: '¡Inscripciones Abiertas 2025 y 2026!',
  subtitle:
    'Una educación pensada para que descubras la gratificante vida llevada dentro',
  cta: 'MÁS INFORMACIÓN',
  image: require('../assets/home/hero-inscripciones.jpg'),
};

// Carreras (cards apiladas)
const CAREERS = [
  {
    id: 'ed-esp',
    title:
      'PROFESORADO DE EDUCACIÓN ESPECIAL CON ORIENTACIÓN EN DISCAPACIDAD INTELECTUAL',
    image: require('../assets/home/carrera-educacion-especial.jpg'),
  },
  {
    id: 'primaria',
    title: 'PROFESORADO DE EDUCACIÓN PRIMARIA',
    image: require('../assets/home/carrera-primaria.jpg'),
  },
  {
    id: 'ingles',
    title: 'PROFESORADO DE INGLÉS',
    image: require('../assets/home/carrera-ingles.jpg'),
  },
  {
    id: 'inicial',
    title: 'PROFESORADO DE EDUCACIÓN INICIAL',
    image: require('../assets/home/carrera-inicial.jpg'),
  },
  {
    id: 'psico',
    title: 'PSICOPEDAGOGÍA',
    image: require('../assets/home/carrera-psicopedagogia.jpg'),
  },
  {
    id: 'tss',
    title:
      'TECNICATURA SUPERIOR EN ANÁLISIS DE SISTEMAS INFORMÁTICOS',
    image: require('../assets/home/carrera-analisis-sistemas.jpg'),
  },
];

// KPIs
const STATS = [
  { id: 'k1', number: '6', label: 'Carreras con propósito' },
  { id: 'k2', number: '2', label: 'Carreras 100% virtual' },
  { id: 'k3', number: '30', label: 'Años de trayectoria' },
  { id: 'k4', number: '1000 +', label: 'Egresados' },
];

const WHY_US = [
  'Enfoque Especializado',
  'Trayectoria Comprobada',
  'Flexibilidad Moderna',
  'Comunidad Cercana',
];

export default function Home({ navigation }) {
  return (
    <View style={s.safe}>
      {/* Header compacto (como Login/SignUp) */}
      <HeaderBar
        title="Instituto Superior del Milagro"
        onPressBell={() => {}}
        bottomSpacing={12}
        showBack={false}
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Columna central */}
        <View style={s.centerWrap}>
          {/* Bienvenido + logo redondo arriba a la izquierda (mini “sello”) */}
          <View style={s.welcomeRow}>
            <Image
              source={require('../assets/logo.png')}
              style={s.smallSeal}
              resizeMode="contain"
            />
            <Text style={s.h1}>Bienvenido</Text>
          </View>

          {/* HERO */}
          <ImageBackground
            source={getSource(HERO.image)}
            style={s.hero}
            imageStyle={s.heroImg}
          >
            <View style={s.heroOverlay}>
              <Text style={s.heroTitle}>{HERO.title}</Text>
              <Text style={s.heroSubtitle}>{HERO.subtitle}</Text>
              <TouchableOpacity activeOpacity={0.9} style={s.heroBtn}>
                <Text style={s.heroBtnText}>{HERO.cta}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* Nuestras Carreras */}
          <Text style={s.sectionTitle}>NUESTRAS CARRERAS</Text>

          {CAREERS.map((item) => (
            <ImageBackground
              key={item.id}
              source={getSource(item.image)}
              style={s.careerCard}
              imageStyle={s.careerImg}
            >
              <View style={s.careerOverlay}>
                <Text style={s.careerTitle}>{item.title}</Text>
              </View>
            </ImageBackground>
          ))}

          {/* KPIs / NUESTROS NÚMEROS… */}
          <View style={s.statsWrap}>
            <Text style={s.statsHeader}>
              NUESTROS NÚMEROS HABLAN POR{'\n'}NOSOTROS
            </Text>

            <View style={s.statsGrid}>
              {STATS.map((st) => (
                <View key={st.id} style={s.statCard}>
                  <Text style={s.statNumber}>{st.number}</Text>
                  <Text style={s.statLabel}>{st.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ¿POR QUÉ ELEGIRNOS? */}
          <View style={s.whyWrap}>
            <Text style={s.whyHeader}>¿PORQUÉ ELEGIRNOS?</Text>
            <View style={s.whyList}>
              {WHY_US.map((w, idx) => (
                <View key={idx} style={s.whyItem}>
                  <View style={s.bullet} />
                  <Text style={s.whyText}>{w}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Espacio inferior para respirar con la barra del sistema */}
          <View style={{ height: SPACING.xl }} />
        </View>
      </ScrollView>
    </View>
  );
}

const CARD_RADIUS = 14;
const COL_PAD = SPACING.lg;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  centerWrap: {
    width: '100%',
    maxWidth: MAX_CONTENT,
    paddingHorizontal: COL_PAD,
  },

  // Bienvenida
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.sm,
  },
  smallSeal: {
    width: 46,
    height: 46,
  },
  h1: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },

  // HERO
  hero: {
    width: '100%',
    height: WIN_W > 420 ? 200 : 180,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    backgroundColor: '#ddd',
    ...Platform.select({
      android: { elevation: 2 },
      default: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
    }),
  },
  heroImg: { borderRadius: CARD_RADIUS },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 14,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#f3f4f6',
    fontSize: 12,
    marginBottom: 10,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffffee',
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
  },
  heroBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  // Carreras
  sectionTitle: {
    color: COLORS.text,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  careerCard: {
    width: '100%',
    height: 160,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: '#ddd',
    ...Platform.select({
      android: { elevation: 2 },
      default: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
    }),
  },
  careerImg: { borderRadius: CARD_RADIUS },
  careerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  careerTitle: { color: '#fff', fontWeight: '800', fontSize: 12 },

  // KPIs
  statsWrap: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    ...Platform.select({
      android: { elevation: 1 },
      default: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
    }),
  },
  statsHeader: {
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statNumber: { fontWeight: '800', color: COLORS.text, fontSize: 18 },
  statLabel: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 4 },

  // Por qué elegirnos
  whyWrap: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    ...Platform.select({
      android: { elevation: 1 },
      default: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4 },
    }),
  },
  whyHeader: {
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  whyList: { gap: 12 },
  whyItem: { flexDirection: 'row', alignItems: 'center' },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  whyText: { color: COLORS.text },
});
