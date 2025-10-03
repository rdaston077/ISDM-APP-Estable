// src/config/firebaseConfig.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);
