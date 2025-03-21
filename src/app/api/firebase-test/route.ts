import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, limit, query } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('Firebase Test: Starting test');
    
    // Get Firebase configuration from environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    };
    
    console.log('Firebase Test: Configuration loaded:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ set' : '✗ missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ set' : '✗ missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ set' : '✗ missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ set' : '✗ missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ set' : '✗ missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ set' : '✗ missing'
    });
    
    // Initialize Firebase
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    console.log('Firebase Test: App initialized:', app.name);
    
    // Get Firestore
    const db = getFirestore(app);
    console.log('Firebase Test: Firestore initialized');
    
    // Test writing to Firestore
    console.log('Firebase Test: Testing write operation');
    const testCollection = collection(db, 'test');
    const testDoc = await addDoc(testCollection, {
      message: 'Test document',
      timestamp: new Date()
    });
    console.log('Firebase Test: Document written with ID:', testDoc.id);
    
    // Test reading from Firestore
    console.log('Firebase Test: Testing read operation');
    const q = query(testCollection, limit(5));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Firebase Test: Retrieved documents:', documents.length);
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection test successful',
      writeId: testDoc.id,
      readCount: documents.length
    });
  } catch (error) {
    console.error('Firebase Test ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 