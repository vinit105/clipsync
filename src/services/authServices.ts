// src/services/authService.ts
import { auth } from '../firebase/firebase'
import { db } from '../firebase/firebase'

import {
  collection,
  addDoc,
  doc,
  setDoc,
  increment,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = async () => {
  return await signOut(auth)
}


export const saveToUserCollection = async (
  uid: string,
  type: 'text' | 'link' | 'code',
  content: string
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'users', uid, type), {
    content,
      createdAt: serverTimestamp(),
  })
  return docRef.id
}
export const deleteFromUserCollection = async (
  uid: string,
  category: 'code' | 'link' | 'text',
  docId: string
) => {
  try {
    const docRef = doc(db, 'users', uid, category, docId)
    await deleteDoc(docRef)
  } catch (err) {
    console.error('❌ Firestore Delete Error:', err)
  }
}
export const incrementVisitCount = async () => {
  const dateKey = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const docRef = doc(collection(db, 'clipsync'), dateKey)
  await setDoc(
    docRef,
    {
      count: increment(1),
      lastVisit: serverTimestamp(),
    },
    { merge: true }
  )
}
