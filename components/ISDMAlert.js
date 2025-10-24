// components/ISDMAlert.js
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';

const DEFAULTS = {
  vino: '#7c2325',
  dorado: '#b08a4b',
  beige: '#f6efe2',
  overlay: 'rgba(0,0,0,0.45)',
};

export default function ISDMAlert({
  visible,
  title = 'Aviso',
  message = '',
  type = 'info', // 'success' | 'error' | 'warning' | 'info'
  confirmText = 'Aceptar',
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  colors = DEFAULTS,
  autoCloseMs,
}) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const palette = { ...DEFAULTS, ...(colors || {}) };
  const toneByType = {
    success: { bar: '#2e7d32' },
    error:   { bar: '#c62828' },
    warning: { bar: '#ed6c02' },
    info:    { bar: palette.dorado },
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
      ]).start();

      if (autoCloseMs && autoCloseMs > 0) {
        const t = setTimeout(() => onConfirm?.(), autoCloseMs);
        return () => clearTimeout(t);
      }
    } else {
      Animated.parallel([
        Animated.timing(fade, { toValue: 0, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 140, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { backgroundColor: palette.overlay, opacity: fade }]}>
        <Animated.View style={[styles.card, { transform: [{ scale }], backgroundColor: palette.beige }]}>
          <View style={[styles.typeBar, { backgroundColor: (toneByType[type]?.bar) || palette.dorado }]} />
          {!!title && <Text style={[styles.title, { color: palette.vino }]}>{title}</Text>}
          {!!message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.actions}>
            {cancelText ? (
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [styles.btn, styles.btnGhost, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.btnGhostText, { color: palette.vino }]}>{cancelText}</Text>
              </Pressable>
            ) : null}

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [styles.btn, { backgroundColor: palette.vino, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={styles.btnText}>{
                confirmText || 'Aceptar'
              }</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, padding: 24, justifyContent: 'center' },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  typeBar: { height: 6, width: '20%', borderRadius: 6, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  message: { fontSize: 15, lineHeight: 22, marginBottom: 16, color: '#3b3b3b' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  btn: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, minWidth: 96, alignItems: 'center' },
  btnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#7c2325' },
  btnGhostText: { fontSize: 15, fontWeight: '600' },
});
