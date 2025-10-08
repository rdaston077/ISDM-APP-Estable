import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export default function HeaderBar({
  title = 'Instituto Superior del Milagro',
  onPressBell,
  showBack = false,
  onBackPress,
  bottomSpacing = 6, // más fino
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={['top']}
      style={[s.safe, { paddingTop: insets.top, marginBottom: bottomSpacing }]}
    >
      <View style={s.wrap}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={s.leftBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Ionicons name="chevron-back" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        <Text style={s.title} numberOfLines={1}>{title}</Text>

        <TouchableOpacity onPress={onPressBell} style={s.rightBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Ionicons name="notifications-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { backgroundColor: COLORS.primary },
  wrap: {
    minHeight: 22,            // ↓ ~50%
    paddingHorizontal: 8,     // ↓
    paddingVertical: 2,       // ↓
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontWeight: '700', fontSize: 15 }, // ↓
  leftBtn:  { position: 'absolute', left: 6,  height: 22, justifyContent: 'center' },
  rightBtn: { position: 'absolute', right: 6, height: 22, justifyContent: 'center' },
});
