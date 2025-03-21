import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, doc, query, where, getDocs, Timestamp, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace this with your actual Firebase config from the console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ set' : '✗ missing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ set' : '✗ missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ set' : '✗ missing',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ set' : '✗ missing',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ set' : '✗ missing',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ set' : '✗ missing'
});

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
console.log('Firebase initialized with app:', app.name);
const db = getFirestore(app);
console.log('Firestore instance created');

// Collection references
const resumesCollection = collection(db, 'resumes');

// Resume functions
export const saveResume = async (data: any) => {
  console.log('Firebase saveResume: Starting to save data');
  try {
    // Add expiration date (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    console.log('Firebase saveResume: Set expiration to', expiresAt);
    
    console.log('Firebase saveResume: Saving to Firestore collection:', 'resumes');
    const docRef = await addDoc(resumesCollection, {
      data,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(expiresAt)
    });
    console.log('Firebase saveResume: Document saved with ID:', docRef.id);
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Firebase saveResume ERROR:', error);
    throw new Error('Failed to save resume');
  }
};

export const getResume = async (id: string) => {
  console.log('Firebase getResume: Looking for document with ID:', id);
  try {
    const docRef = doc(db, 'resumes', id);
    console.log('Firebase getResume: Fetching document');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('Firebase getResume: Document not found');
      throw new Error('Resume not found');
    }
    console.log('Firebase getResume: Document found');
    
    // Check if resume has expired
    const data = docSnap.data();
    const expiresAt = data.expiresAt?.toDate();
    console.log('Firebase getResume: Document expires at:', expiresAt);
    
    if (expiresAt && expiresAt < new Date()) {
      console.log('Firebase getResume: Document has expired');
      throw new Error('Resume has expired');
    }
    
    console.log('Firebase getResume: Returning document data');
    return data.data;
  } catch (error) {
    console.error('Firebase getResume ERROR:', error);
    throw error;
  }
};

export default db; 