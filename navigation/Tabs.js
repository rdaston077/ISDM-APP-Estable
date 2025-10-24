// navigation/Tabs.js
import React from 'react';
import { Alert, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../screens/Home';
import Carreras from '../screens/Carreras';
import Contacto from '../screens/Contacto';
import Profile from '../screens/Profile';
import StudentsStack from './StudentsStack';
import { COLORS } from '../constants/colors';
import { auth } from '../src/config/firebaseConfig';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const GAP6 = Math.round(Dimensions.get('window').height * 0.06);
const TAB_HEIGHT = 62;

function VoidScreen() { return null; }

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
  const rootNav = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('rememberMe'); // limpiar flag
      rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
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
          switch (route.name) {
            case 'Inicio':
              return <Ionicons name="home-outline" size={size} color={color} />;
            case 'Estudiantes':
              return <Ionicons name="people-outline" size={size} color={color} />;
            case 'Perfil':
              return <Ionicons name="person-outline" size={size} color={color} />;
            case 'Cerrar sesión':
              return <MaterialCommunityIcons name="logout" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackNav} />
      <Tab.Screen name="Estudiantes" component={StudentsStack} />
      <Tab.Screen name="Perfil" component={Profile} />
      <Tab.Screen
        name="Cerrar sesión"
        component={VoidScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}
