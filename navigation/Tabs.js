// navigation/Tabs.js
import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../screens/Home';
import Carreras from '../screens/Carreras';
import Contacto from '../screens/Contacto';
import StudentsStack from './StudentsStack';
import ProfileStack from './ProfileStack';
import { COLORS } from '../constants/colors';
import { auth } from '../src/config/firebaseConfig';
import ISDMAlert from '../components/ISDMAlert';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const GAP6 = Math.round(Dimensions.get('window').height * 0.06);
const TAB_HEIGHT = 62;

function VoidScreen() {
  return null;
}

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={Home} />
      <HomeStack.Screen name="Carreras" component={Carreras} />
      <HomeStack.Screen name="Contacto" component={Contacto} />
    </HomeStack.Navigator>
  );
}

export default function Tabs() {
  const [user, setUser] = useState(auth.currentUser);
  const [lockAlert, setLockAlert] = useState({ visible: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const showRequireLogin = () => setLockAlert({ visible: true });

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#6b7280',
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: '#faf7ef',
            height: TAB_HEIGHT,
            paddingBottom: 8,
            paddingTop: 8,
            marginBottom: GAP6,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Inicio') return <Ionicons name="home-outline" size={size} color={color} />;
            if (route.name === 'Estudiantes') return <Ionicons name="people-outline" size={size} color={color} />;
            if (route.name === 'Perfil') return <Ionicons name="person-outline" size={size} color={color} />;
            if (route.name === 'Cerrar sesión') return <MaterialCommunityIcons name="logout" size={size} color={color} />;
            return null;
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeStackNav} />

        <Tab.Screen
          name="Estudiantes"
          component={StudentsStack}
          options={{ tabBarLabelStyle: { opacity: user ? 1 : 0.6 } }}
          listeners={{
            tabPress: (e) => {
              if (!user) {
                e.preventDefault();
                showRequireLogin();
              }
            },
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfileStack}
          options={{ tabBarLabelStyle: { opacity: user ? 1 : 0.6 } }}
          listeners={{
            tabPress: (e) => {
              if (!user) {
                e.preventDefault();
                showRequireLogin();
              }
            },
          }}
        />

        <Tab.Screen
          name="Cerrar sesión"
          component={VoidScreen}
          listeners={({ navigation }) => ({
            tabPress: async (e) => {
              e.preventDefault();
              if (!user) return; // sin sesión: no hace nada
              try {
                await signOut(auth);
                await AsyncStorage.removeItem('rememberMe');
                // dirigir al tab Inicio
                navigation.navigate('Inicio');
              } catch {
                // opcional: podrías mostrar un ISDMAlert de error si lo deseas
              }
            },
          })}
        />
      </Tab.Navigator>

      {/* Modal consistente al diseño para requerir login */}
      <ISDMAlert
        visible={lockAlert.visible}
        title="Iniciá sesión"
        message="Inicia sesión para acceder a esta función."
        type="info"
        confirmText="Aceptar"
        onConfirm={() => setLockAlert({ visible: false })}
        onClose={() => setLockAlert({ visible: false })}
      />
    </>
  );
}
