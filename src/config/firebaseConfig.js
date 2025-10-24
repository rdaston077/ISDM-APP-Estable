// src/config/firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
//  Firestore
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAZeciSqy6qRlqS1ncWxTTYUL1UXWGzfoE",
  authDomain: "isdm-app.firebaseapp.com",
  projectId: "isdm-app",
  storageBucket: "isdm-app.firebasestorage.app",
  messagingSenderId: "820334655109",
  appId: "1:820334655109:web:eaaf86046dbdb83fa79bec"
};

// Evitar inicializar dos veces si Expo recarga
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

//   Persistencia real en React Native con AsyncStorage.
//   Si el módulo de auth ya fue creado, usamos getAuth.
//   Caso contrario, lo inicializamos con persistencia RN.
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Ya existe una instancia de Auth, tomamos esa.
  authInstance = getAuth(app);
}

export const auth = authInstance;

// 🔹 Firestore (exportamos db para el CRUD de alumnos)
export const db = getFirestore(app);

/* ──────────────────────────────────────────────────────────────
   OPCIONAL (solo desarrollo): conectar a Emulators
   - Reemplazá HOST por la IP de tu PC si probás en dispositivo físico.
   - Requiere haber iniciado: `firebase emulators:start`
------------------------------------------------------------------
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectAuthEmulator } from 'firebase/auth';
import { Platform } from 'react-native';

if (__DEV__) {
  const HOST = Platform.select({ ios: 'localhost', android: '10.0.2.2', default: '192.168.0.X' });
  connectFirestoreEmulator(db, HOST, 8080);
  connectAuthEmulator(auth, `http://${HOST}:9099`);
}
------------------------------------------------------------------ */
