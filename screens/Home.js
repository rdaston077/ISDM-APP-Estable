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


const getSource = (img) => (typeof img === 'string' ? { uri: img } : img);

const { width: WIN_W } = Dimensions.get('window');
const MAX_CONTENT = 420;

const HERO = {
  title: '¡Inscripciones Abiertas 2025 y 2026!',
  subtitle: 'Una educación pensada para que descubras la grandeza que llevas dentro',
  cta: 'MÁS INFORMACIÓN',
  image: require('../assets/home/hero-inscripciones.jpg'),
};


const STATS = [
  { id: 'k1', number: '6', label: 'Carreras con propósito' },
  { id: 'k2', number: '2', label: 'Carreras 100% virtual' },
  { id: 'k3', number: '30', label: 'Años de trayectoria' },
  { id: 'k4', number: '1000 +', label: 'Egresados' },
];

const WHY_US = ['Enfoque Especializado', 'Trayectoria Comprobada', 'Flexibilidad Moderna', 'Comunidad Cercana'];

export default function Home({ navigation }) {
  return (
    <View style={s.safe}>
      <HeaderBar title="Instituto Superior del Milagro" onPressBell={() => {}} bottomSpacing={12} showBack={false} />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.centerWrap}>
          
          <View style={s.welcomeRow}>
            <Image source={require('../assets/logo.png')} style={s.smallSeal} resizeMode="contain" />
            <Text style={s.h1}>Bienvenido</Text>
          </View>

          {/* HERO */}
          <ImageBackground source={getSource(HERO.image)} style={s.hero} imageStyle={s.heroImg}>
            <View style={s.heroOverlay}>
              <Text style={s.heroTitle}>{HERO.title}</Text>
              <Text style={s.heroSubtitle}>{HERO.subtitle}</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={s.heroBtn}
                onPress={() => navigation.navigate('Contacto')}
              >
                <Text style={s.heroBtnText}>{HERO.cta}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* NUESTRAS CARRERAS */}
          <Text style={s.sectionTitle}>NUESTRAS CARRERAS</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Carreras')}>
            <ImageBackground
              source={require('../assets/home/nuestras-carreras.jpg')}
              style={s.careerCard}
              imageStyle={s.careerImg}
            >
              <View style={s.careerOverlay}>
                <Text style={[s.careerTitle, { fontSize: 16 }]}>Ver carreras</Text>
                <Text style={{ color: '#fff', opacity: 0.9, fontSize: 12 }}>
                  Explorá todas nuestras opciones académicas
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* KPIs */}
          <View style={s.statsWrap}>
            <Text style={s.statsHeader}>NUESTROS NÚMEROS HABLAN POR{'\n'}NOSOTROS</Text>
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
  scroll: { alignItems: 'center', paddingBottom: SPACING.lg },
  centerWrap: { width: '100%', maxWidth: MAX_CONTENT, paddingHorizontal: COL_PAD },

  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.sm },
  smallSeal: { width: 80, height: 80 },
  h1: { fontSize: 22, fontWeight: '800', color: COLORS.text },


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
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', padding: 14, justifyContent: 'flex-end' },
  heroTitle: { color: '#fff', fontWeight: '800', fontSize: 16, marginBottom: 6 },
  heroSubtitle: { color: '#f3f4f6', fontSize: 12, marginBottom: 10 },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffffee',
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
  },
  heroBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 12 },

  sectionTitle: { color: COLORS.text, fontWeight: '800', marginBottom: SPACING.sm },
  careerCard: {
    width: '100%',
    height: 160,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    backgroundColor: '#ddd',
    ...Platform.select({
      android: { elevation: 2 },
      default: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6 },
    }),
  },
  careerImg: { borderRadius: CARD_RADIUS },
  careerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end', padding: 12 },
  careerTitle: { color: '#fff', fontWeight: '800', fontSize: 12 },


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
  statsHeader: { textAlign: 'center', fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#fafafa', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center' },
  statNumber: { fontWeight: '800', color: COLORS.text, fontSize: 18 },
  statLabel: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginTop: 4 },


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
  whyHeader: { textAlign: 'center', fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.sm },
  whyList: { gap: 12 },
  whyItem: { flexDirection: 'row', alignItems: 'center' },
  bullet: { width: 8, height: 8, borderRadius: 8, backgroundColor: COLORS.primary, marginRight: 8 },
  whyText: { color: COLORS.text },
});
