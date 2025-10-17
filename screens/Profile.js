// screens/Profile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import HeaderBar from '../components/HeaderBar';

export default function Profile() {
  return (
    <View style={s.safe}>
      <HeaderBar title="Perfil" />
      <View style={s.body}>
        <Text style={s.text}>Perfil (pronto)</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: COLORS.text },
});
