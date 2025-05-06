import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  DocumentReference
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8rpTnmKUQ9wi9OzvnHDm5EJ55LzlOx8Q",
  authDomain: "freefire-tournaments-ba2a6.firebaseapp.com",
  projectId: "freefire-tournaments-ba2a6",
  storageBucket: "freefire-tournaments-ba2a6.firebasestorage.app",
  messagingSenderId: "605081354961",
  appId: "1:605081354961:web:9cfda0d8e1d537c5223bf0"
};

// For development: Mock Firebase if config is missing or invalid
let app, db, auth, storage;
let isMock = false;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.warn('Using mock Firebase implementation for development');
  isMock = true;
  
  // Mock data store for development
  const mockData: Record<string, Record<string, any>> = {
    users: {
      'mock-user-1': {
        id: 'mock-user-1',
        ign: 'TestPlayer123',
        email: 'test@example.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        isPremium: false,
      }
    },
    tournaments: {},
    tournament_drafts: {}
  };
  
  // Mock document reference
  class MockDocumentReference {
    constructor(public path: string, public id: string) {}
  }
  
  // Mock Firestore operations
  db = {
    collection: (collectionPath: string) => {
      // Create the collection if it doesn't exist
      if (!mockData[collectionPath]) {
        mockData[collectionPath] = {};
      }
      
      return {
        // Mock document
        doc: (docId: string) => {
          const docRef = new MockDocumentReference(collectionPath, docId);
          
          return {
            id: docId,
            get: async () => {
              const data = mockData[collectionPath][docId];
              return {
                exists: () => !!data,
                data: () => data,
                id: docId
              };
            },
            set: async (data: any) => {
              mockData[collectionPath][docId] = {
                ...data,
                id: docId
              };
              return docRef;
            },
            update: async (data: any) => {
              mockData[collectionPath][docId] = {
                ...mockData[collectionPath][docId],
                ...data
              };
              return docRef;
            }
          };
        },
        // Add document with auto-generated ID
        add: async (data: any) => {
          const docId = 'mock-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
          mockData[collectionPath][docId] = {
            ...data,
            id: docId,
            created_at: new Date().toISOString()
          };
          return new MockDocumentReference(collectionPath, docId);
        },
        // Query operations
        where: () => ({
          get: async () => ({
            docs: Object.entries(mockData[collectionPath]).map(([id, data]) => ({
              id,
              data: () => data,
              exists: true
            }))
          })
        }),
        orderBy: () => ({
          get: async () => ({
            docs: Object.entries(mockData[collectionPath]).map(([id, data]) => ({
              id,
              data: () => data,
              exists: true
            }))
          })
        })
      };
    }
  };
  
  // Mock Auth
  auth = {
    currentUser: {
      uid: 'mock-user-1',
      email: 'test@example.com',
      displayName: 'Test User'
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Simulate a logged-in user
      setTimeout(() => {
        callback({
          uid: 'mock-user-1',
          email: 'test@example.com',
          displayName: 'Test User'
        });
      }, 100);
      return () => {}; // Unsubscribe function
    }
  };
  
  // Mock Storage
  storage = {
    ref: (path: string) => ({
      put: async (file: File) => {
        console.log('Mock file upload:', file.name, 'to path:', path);
        return {
          ref: {
            getDownloadURL: async () => `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`
          }
        };
      }
    }),
    refFromURL: (url: string) => ({
      delete: async () => {
        console.log('Mock file deletion:', url);
        return Promise.resolve();
      }
    })
  };
}

// Profile-related functions
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as {
        id: string;
        ign: string;
        email: string;
        avatar_url: string | null;
        isPremium: boolean;
      };
    } else if (isMock) {
      // Return mock user for development
      return {
        id: 'mock-user-1',
        ign: 'TestPlayer123',
        email: 'test@example.com',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        isPremium: false,
      };
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Mock serverTimestamp for development
export const mockServerTimestamp = () => {
  if (isMock) {
    return new Date().toISOString();
  }
  return serverTimestamp();
};

// Export the rest of the original functions...
export const updateUserProfile = async (userId: string, updates: { ign?: string }) => {
  try {
    // Validate IGN (alphanumeric, 3-20 characters)
    if (updates.ign && !/^[a-zA-Z0-9]{3,20}$/.test(updates.ign)) {
      throw new Error('IGN must be alphanumeric and between 3-20 characters');
    }
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    
    // Return updated user data
    const updatedUser = await getDoc(userRef);
    return updatedUser.data();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${userId}/${fileName}`;
    
    // Upload file to Firebase Storage
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user's avatar_url in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { avatar_url: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Authentication functions
export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// New authentication functions
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Create a user profile in Firestore
    const userRef = doc(db, 'users', userCredential.user.uid);
    await updateDoc(userRef, {
      email,
      created_at: serverTimestamp(),
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user exists in Firestore, if not create profile
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await updateDoc(userRef, {
        email: userCredential.user.email,
        display_name: userCredential.user.displayName,
        avatar_url: userCredential.user.photoURL,
        created_at: serverTimestamp(),
      });
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Export app, db, auth, and storage for direct access if needed
export { app, db, auth, storage }; 