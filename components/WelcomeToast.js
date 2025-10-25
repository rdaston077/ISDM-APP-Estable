// components/WelcomeToast.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function WelcomeToast({ visible, text = '¡Bienvenido!', onHide, duration = 2500 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    let timer;
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start(() => {
        timer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -10, duration: 220, useNativeDriver: true }),
          ]).start(() => onHide?.());
        }, duration);
      });
    }
    return () => timer && clearTimeout(timer);
  }, [visible, duration, onHide, opacity, translateY]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={s.wrapper}>
      <Animated.View style={[s.toast, { opacity, transform: [{ translateY }] }]}>
        <Text style={s.text}>{text}</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 72, // debajo del HeaderBar
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  toast: {
    maxWidth: '90%',
    backgroundColor: 'rgba(17,17,17,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: { color: '#fff', fontWeight: '700' },
});
