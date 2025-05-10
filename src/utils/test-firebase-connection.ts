// Utility script to test Firebase connection
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  limit, 
  DocumentData
} from 'firebase/firestore';
import { getAuth, signInAnonymously, UserCredential } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8rpTnmKUQ9wi9OzvnHDm5EJ55LzlOx8Q",
  authDomain: "freefire-tournaments-ba2a6.firebaseapp.com",
  projectId: "freefire-tournaments-ba2a6",
  storageBucket: "freefire-tournaments-ba2a6.firebasestorage.app",
  messagingSenderId: "605081354961",
  appId: "1:605081354961:web:9cfda0d8e1d537c5223bf0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
}

// Test function to be called from browser console
export async function testFirebaseConnection(): Promise<TestResult> {
  console.log('Testing Firebase connection...');
  
  try {
    // Test authentication
    console.log('Testing authentication...');
    const anonymousUser: UserCredential = await signInAnonymously(auth);
    console.log('Anonymous auth successful:', anonymousUser.user.uid);
    
    // Test Firestore connection
    console.log('Testing Firestore connection...');
    const q = query(collection(db, 'tournaments'), limit(1));
    const querySnapshot = await getDocs(q);
    
    console.log(`Firestore connection successful! Found ${querySnapshot.size} tournaments.`);
    
    if (querySnapshot.size > 0) {
      console.log('Sample tournament data:');
      querySnapshot.forEach(doc => {
        console.log('- Tournament ID:', doc.id);
        console.log('- Tournament name:', doc.data().name);
      });
    }
    
    return {
      success: true,
      message: 'Firebase connection test successful!'
    };
  } catch (error: any) {
    console.error('Firebase connection test failed:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

// Export a function to verify security rules
export async function testSecurityRules(): Promise<TestResult> {
  try {
    console.log('Testing Firebase security rules...');
    
    // Try to create a tournament
    const tournamentsCollection = collection(db, 'tournaments');
    
    console.log('Attempting to read tournaments collection...');
    const querySnapshot = await getDocs(query(tournamentsCollection, limit(1)));
    console.log('Successfully read tournaments collection!');
    
    return {
      success: true,
      message: 'Security rules test successful - read access works!'
    };
  } catch (error: any) {
    console.error('Security rules test failed:', error);
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}

// Make the functions available on the window object for browser usage
declare global {
  interface Window {
    testFirebaseConnection: () => Promise<TestResult>;
    testSecurityRules: () => Promise<TestResult>;
  }
}

// Auto-run test if this file is loaded directly
if (typeof window !== 'undefined') {
  window.testFirebaseConnection = testFirebaseConnection;
  window.testSecurityRules = testSecurityRules;
  
  console.log('Firebase test utilities loaded!');
  console.log('Run testFirebaseConnection() or testSecurityRules() in the console to test your Firebase connection.');
} 