import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  updateDoc,
  setDoc,
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  DocumentReference,
  deleteDoc,
  limit
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
  console.log("Attempting to initialize Firebase with config:", firebaseConfig);
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.warn('Using mock Firebase implementation for development');
  isMock = true;
  console.log("⚠️ IMPORTANT: App is running in MOCK MODE - profile updates will not be saved to Firestore");
  
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
        uid: string; // Free Fire UID
        ign: string; // In-game name
        fullName: string;
        email: string;
        phone: string;
        bio: string;
        location: string;
        birthdate: string;
        gender: string;
        avatar_url: string | null;
        isPremium: boolean;
        created_at: Timestamp;
        updated_at: Timestamp;
      };
    } else if (isMock) {
      // Return mock user for development
      return {
        id: 'mock-user-1',
        uid: 'FF123456789',
        ign: 'TestPlayer123',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        bio: 'I am a passionate gamer who loves Free Fire tournaments.',
        location: 'New York, USA',
        birthdate: '1995-07-15',
        gender: 'male',
        avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
        isPremium: false,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Create a new user profile in Firestore
export const createUserProfile = async (userId: string, profileData: {
  email?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string;
  ign?: string;
  fullName?: string;
  phone?: string;
}) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Check if user exists
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // User exists, update profile
      await updateDoc(userRef, {
        ...profileData,
        updated_at: serverTimestamp(),
      });
    } else {
      // Create new user profile
      const userData = {
        id: userId,
        uid: profileData.uid || '',
        ign: profileData.ign || '',
        fullName: profileData.fullName || profileData.displayName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bio: '',
        location: '',
        birthdate: '',
        gender: '',
        avatar_url: profileData.photoURL || null,
        isPremium: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      
      await setDoc(userRef, userData);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
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
export const updateUserProfile = async (userId: string, updates: {
  uid?: string;
  ign?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  birthdate?: string;
  gender?: string;
  avatar_url?: string;
  isPremium?: boolean;
}) => {
  try {
    // Validate IGN (alphanumeric, 3-20 characters)
    if (updates.ign && !/^[a-zA-Z0-9]{3,20}$/.test(updates.ign)) {
      throw new Error('IGN must be alphanumeric and between 3-20 characters');
    }
    
    // Validate UID if provided
    if (updates.uid && !/^[0-9]{8,12}$/.test(updates.uid)) {
      throw new Error('Free Fire UID must be a number with 8-12 digits');
    }
    
    const userRef = doc(db, 'users', userId);
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: serverTimestamp(),
    };
    
    await updateDoc(userRef, updatedData);
    
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
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!file) {
      throw new Error('File is required');
    }
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    if (!fileExt) {
      throw new Error('Invalid file extension');
    }
    
    // Create a totally unique filename
    const uniqueId = Math.random().toString(36).substring(2);
    const fileName = `avatar-${Date.now()}-${uniqueId}.${fileExt}`;
    
    // Use a simple flat path that's more likely to work
    const filePath = `avatars/${fileName}`;
    
    console.log("Uploading avatar with path:", filePath);
    
    // Explicitly check if storage is initialized
    if (!storage) {
      throw new Error('Firebase Storage is not initialized');
    }
    
    try {
      // Create blob from file
      const blob = file.slice(0, file.size, file.type);
      const newFile = new File([blob], fileName, { type: file.type });
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, filePath);
      console.log("Storage reference created");
      
      // Upload with explicit content type
      const metadata = {
        contentType: file.type
      };
      
      const uploadResult = await uploadBytes(storageRef, newFile, metadata);
      console.log("Upload successful, result:", uploadResult);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", downloadURL);
      
      // Update user's avatar_url in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        avatar_url: downloadURL,
        updated_at: serverTimestamp()
      });
      console.log("User profile updated with new avatar URL");
      
      return downloadURL;
    } catch (uploadError) {
      console.error("Upload failed with error:", uploadError);
      
      // Try alternate upload method for older browsers
      if (uploadError instanceof Error) {
        throw new Error(`Avatar upload failed: ${uploadError.message}`);
      }
      throw uploadError;
    }
  } catch (error) {
    console.error('Error uploading avatar:', error);
    if (error instanceof Error) {
      throw new Error(`Avatar upload failed: ${error.message}`);
    }
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
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
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
    
    // Create or update the user profile in Firestore
    await createUserProfile(userCredential.user.uid, {
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
    });
    
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
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Simple function to verify Firestore connection without any test documents
export const verifyFirestoreConnection = async () => {
  try {
    if (isMock) {
      console.log("Cannot verify Firestore connection in mock mode");
      return { success: false, error: "App is running in mock mode" };
    }
    
    // Just check if we can access Firestore by doing a simple operation
    const usersCollection = collection(db, 'users');
    await getDocs(query(usersCollection, where('isPremium', '==', true), limit(1)));
    
    console.log("✅ Firestore connection verified successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Firestore connection verification failed:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Export app, db, auth, and storage for direct access if needed
export { isMock, app, db, auth, storage }; 