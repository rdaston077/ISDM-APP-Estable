// navigation/StudentsStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Students from '../screens/Students';
import StudentDetail from '../screens/StudentDetail';
import StudentForm from '../screens/StudentForm';

const Stack = createNativeStackNavigator();

export default function StudentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentsList" component={Students} />
      <Stack.Screen name="StudentDetail" component={StudentDetail} />
      <Stack.Screen name="StudentForm" component={StudentForm} />
    </Stack.Navigator>
  );
}
