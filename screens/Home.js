// screens/Home.js
import React, { useEffect, useState, useRef } from 'react';
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
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Video } from 'expo-av';
import HeaderBar from '../components/HeaderBar';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/spacing';
import { auth } from '../src/config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import WelcomeToast from '../components/WelcomeToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

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
  const [user, setUser] = useState(auth.currentUser);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomedOnce, setWelcomedOnce] = useState(false);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showSecondTitle, setShowSecondTitle] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [currentLoop, setCurrentLoop] = useState(0);
  
  // Hook para detectar si la pantalla está enfocada
  const isFocused = useIsFocused();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user && !welcomedOnce) {
      setShowWelcome(true);
      setWelcomedOnce(true);
    }
  }, [user, welcomedOnce]);

  // Efecto para pausar el video cuando no está en foco
  useEffect(() => {
    const handleVideoPlayback = async () => {
      if (videoRef.current && status.isLoaded) {
        if (isFocused) {
          // Si la pantalla está enfocada, reproducir
          await videoRef.current.playAsync();
        } else {
          // Si la pantalla no está enfocada, pausar
          await videoRef.current.pauseAsync();
        }
      }
    };

    handleVideoPlayback();
  }, [isFocused, status.isLoaded]);

  // Efecto para reiniciar títulos en cada loop
  useEffect(() => {
    if (status.didJustFinish) {
      // El video terminó y va a reiniciar (loop)
      resetTitles();
    }
  }, [status.didJustFinish]);

  // Efecto para la secuencia de títulos
  useEffect(() => {
    if (!isLoading && showTitles) {
      let timer1, timer2;

      timer1 = setTimeout(() => {
        // Animación de fade out del primer título
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setShowSecondTitle(true);
          // Animación de slide up del segundo título
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();

          // Timer para desaparecer el segundo título después de 15 segundos
          timer2 = setTimeout(() => {
            Animated.timing(fadeOutAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }).start(() => {
              setShowTitles(false);
            });
          }, 15000); // 15 segundos
        });
      }, 3000); // Cambia después de 3 segundos

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isLoading, showTitles, currentLoop]);

  // Función para reiniciar los títulos
  const resetTitles = () => {
    // Resetear estados de animación
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
    fadeOutAnim.setValue(1);
    
    // Resetear estados
    setShowSecondTitle(false);
    setShowTitles(true);
    
    // Incrementar contador de loop para forzar re-render
    setCurrentLoop(prev => prev + 1);
  };

  const handleAuthCta = async () => {
    if (!user) {
      navigation.navigate('Login');
    } else {
      try {
        await signOut(auth);
        await AsyncStorage.setItem('rememberMe', 'false');
        setShowWelcome(false);
      } catch (e) {
        console.log('Error al cerrar sesión:', e);
      }
    }
  };

  const togglePlayback = async () => {
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  return (
    <View style={s.safe}>
      <HeaderBar
        title="Instituto Superior del Milagro"
        onPressBell={user ? () => {} : undefined}
        bottomSpacing={12}
        showBack={false}
      />

      <WelcomeToast
        visible={showWelcome}
        text={`¡Bienvenido, ${user?.displayName || 'usuario'}!`}
        onHide={() => setShowWelcome(false)}
        duration={2500}
      />

      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.centerWrap}>
          {/* Bienvenida */}
          <View style={s.welcomeBlock}>
            <Image source={require('../assets/logo.png')} style={s.logoCenter} resizeMode="contain" />
            <Text style={s.h1Center}>{user ? (user.displayName || 'Usuario') : 'Bienvenido'}</Text>

            {!user && (
              <TouchableOpacity
                style={s.loginBtn}
                onPress={handleAuthCta}
              >
                <Text style={s.loginBtnText}>Iniciar sesión</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* SECCIÓN DE VIDEO CON TÍTULOS ANIMADOS */}
          <View style={s.videoSection}>
            <View style={s.videoContainer}>
              {isLoading && (
                <View style={s.videoLoader}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={s.loadingText}>Cargando video institucional...</Text>
                </View>
              )}
              
              <Video
                ref={videoRef}
                source={require('../assets/Video.mp4')}
                style={s.videoPlayer}
                resizeMode="cover"
                shouldPlay={isFocused} // Solo reproducir si está en foco
                isLooping={true}
                onPlaybackStatusUpdate={status => {
                  setStatus(() => status);
                  if (status.isLoaded) {
                    setIsLoading(false);
                  }
                }}
              />
              
              {/* Overlay con títulos animados */}
              {showTitles && (
                <View style={s.videoOverlay}>
                  
                  {/* Primer título - Se muestra primero por 3 segundos */}
                  {!showSecondTitle && (
                    <Animated.View style={[s.titleContainer, { opacity: fadeAnim }]}>
                      <Text style={s.mainTitle}>
                        INSTITUTO SUPERIOR{'\n'}DEL MILAGRO
                      </Text>
                      <Text style={s.subTitle}>
                        2024
                      </Text>
                    </Animated.View>
                  )}
                  
                  {/* Segundo título - Aparece después de 3 segundos y dura 15 segundos */}
                  {showSecondTitle && (
                    <Animated.View style={[
                      s.titleContainer, 
                      { 
                        transform: [{
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          })
                        }],
                        opacity: fadeOutAnim
                      }
                    ]}>
                      <Text style={s.secondMainTitle}>
                        Instituto Superior del Milagro
                      </Text>
                      <Text style={s.secondSubTitle}>
                        Formando los profesionales del futuro
                      </Text>
                    </Animated.View>
                  )}
                  
                </View>
              )}
              
              {/* Controles de video */}
              <TouchableOpacity
                style={s.controlButton}
                onPress={togglePlayback}
              >
                <Text style={s.controlText}>
                  {status.isPlaying ? '⏸️' : '▶️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Resto del código igual... */}
          <ImageBackground source={HERO.image} style={s.hero} imageStyle={s.heroImg}>
            <View style={s.heroOverlay}>
              <Text style={s.heroTitle}>{HERO.title}</Text>
              <Text style={s.heroSubtitle}>{HERO.subtitle}</Text>
              <TouchableOpacity
                style={s.heroBtn}
                onPress={() => navigation.navigate('Contacto')}
              >
                <Text style={s.heroBtnText}>{HERO.cta}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          {/* CARRERAS */}
          <Text style={s.sectionTitle}>NUESTRAS CARRERAS</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Carreras')}>
            <ImageBackground
              source={require('../assets/home/nuestras-carreras.jpg')}
              style={s.careerCard}
              imageStyle={s.careerImg}
            >
              <View style={s.careerOverlay}>
                <Text style={s.careerTitle}>Ver carreras</Text>
                <Text style={s.careerSubtitle}>Explorá todas nuestras opciones académicas</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* ESTADÍSTICAS */}
          <View style={s.statsWrap}>
            <Text style={s.statsHeader}>NUESTROS NÚMEROS HABLAN POR NOSOTROS</Text>
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

          <View style={s.spacer} />
        </View>
      </ScrollView>
    </View>
  );
}

// Los estilos se mantienen igual...
const CARD_RADIUS = 14;
const COL_PAD = SPACING.lg;

const s = StyleSheet.create({
  // ... (todos los estilos igual que antes)
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.bg 
  },
  scroll: { 
    alignItems: 'center', 
    paddingBottom: SPACING.lg 
  },
  centerWrap: { 
    width: '100%', 
    maxWidth: MAX_CONTENT, 
    paddingHorizontal: COL_PAD 
  },
  spacer: {
    height: SPACING.xl
  },
  welcomeBlock: { 
    alignItems: 'center', 
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm
  },
  logoCenter: { 
    width: 100, 
    height: 100 
  },
  h1Center: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: COLORS.text, 
    marginTop: 6, 
    textAlign: 'center' 
  },
  loginBtn: {
    marginTop: SPACING.md,
    backgroundColor: '#7c2325',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16
  },
  videoSection: {
    marginBottom: SPACING.lg,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    lineHeight: 32,
    marginBottom: 8,
  },
  subTitle: {
    color: '#f0f0f0',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  secondMainTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    lineHeight: 28,
    marginBottom: 8,
  },
  secondSubTitle: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  controlButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
  },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  heroImg: { 
    borderRadius: CARD_RADIUS 
  },
  heroOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    padding: SPACING.lg, 
    justifyContent: 'flex-end' 
  },
  heroTitle: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 18, 
    marginBottom: 8 
  },
  heroSubtitle: { 
    color: '#f3f4f6', 
    fontSize: 14, 
    marginBottom: SPACING.md,
    lineHeight: 20
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    borderRadius: 8,
  },
  heroBtnText: { 
    color: COLORS.primary, 
    fontWeight: '700', 
    fontSize: 14 
  },
  sectionTitle: { 
    color: COLORS.text, 
    fontWeight: '800', 
    fontSize: 20,
    marginBottom: SPACING.md,
    textAlign: 'center'
  },
  careerCard: {
    width: '100%',
    height: 160,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  careerImg: { 
    borderRadius: CARD_RADIUS 
  },
  careerOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end', 
    padding: SPACING.lg 
  },
  careerTitle: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 18,
    marginBottom: 4
  },
  careerSubtitle: { 
    color: '#fff', 
    opacity: 0.9, 
    fontSize: 14 
  },
  statsWrap: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsHeader: { 
    textAlign: 'center', 
    fontWeight: '800', 
    color: COLORS.primary, 
    fontSize: 18,
    marginBottom: SPACING.lg,
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statCard: { 
    width: '47%', 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    padding: SPACING.md,
    alignItems: 'center',
  },
  statNumber: { 
    fontWeight: '900', 
    color: COLORS.primary, 
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: { 
    color: '#6b7280', 
    fontSize: 12, 
    textAlign: 'center',
    fontWeight: '500',
  },
  whyWrap: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  whyHeader: { 
    textAlign: 'center', 
    fontWeight: '800', 
    color: COLORS.primary, 
    fontSize: 18,
    marginBottom: SPACING.lg,
  },
  whyList: { 
    gap: SPACING.md 
  },
  whyItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  bullet: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: COLORS.primary, 
    marginRight: 12 
  },
  whyText: { 
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
});