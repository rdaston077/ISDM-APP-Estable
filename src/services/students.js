// src/services/students.js
import {
  collection, doc, getDoc, addDoc, setDoc,
  updateDoc, deleteDoc, onSnapshot, query, orderBy
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const colRef = collection(db, 'students');

/** Estructura de doc sugerida:
 * {
 *  firstName, lastName, dni, birthDate, gender,
 *  phoneMobile, phoneHome, email, career, status, avatar
 * }
 */

export function subscribeStudents(cb) {
  const q = query(colRef, orderBy('lastName'), orderBy('firstName'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function getStudent(id) {
  const ref = doc(db, 'students', id);
  const d = await getDoc(ref);
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

export async function createStudent(payload) {
  const res = await addDoc(colRef, payload);
  return res.id;
}

export async function updateStudent(id, payload) {
  const ref = doc(db, 'students', id);
  await updateDoc(ref, payload);
}

export async function upsertStudent(id, payload) {
  const ref = doc(db, 'students', id);
  await setDoc(ref, payload, { merge: true });
}

export async function removeStudent(id) {
  const ref = doc(db, 'students', id);
  await deleteDoc(ref);
}
