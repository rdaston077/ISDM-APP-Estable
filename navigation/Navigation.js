// navigation/Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        {/* Contenedor de tabs (Inicio, Estudiantes, Perfil, Cerrar sesión).
            Dentro del tab “Inicio” está el HomeStack con Home, Carreras y Contacto. */}
        <Stack.Screen name="Home" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
