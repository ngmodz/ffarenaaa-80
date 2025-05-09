import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar as uploadFirebaseAvatar,
  auth,
  onAuthChange,
  isMock
} from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

// Use isMock from firebase.ts to determine if we're in test mode
const TEST_MODE = isMock; // Updated to use the value from firebase.ts

interface UserProfile {
  id: string;
  uid: string;
  ign: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  birthdate: string;
  gender: string;
  avatar_url: string | null;
  isPremium: boolean;
  joinDate: string;
}

interface ProfileUpdate {
  ign?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  birthdate?: string;
  gender?: string;
  uid?: string;
}

interface UseUserProfileReturn {
  loading: boolean;
  user: UserProfile | null;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
  uploadUserAvatar: (file: File) => Promise<string>;
  error: string | null;
  isTestMode: boolean;
}

// Default mock user profile for test mode
const DEFAULT_USER_PROFILE: UserProfile = {
  id: "test-user-123",
  uid: "FF123456789",
  ign: "ElitePlayer123",
  fullName: "John Smith",
  email: "player@example.com",
  phone: "+1234567890",
  bio: "I am a passionate gamer who loves Free Fire tournaments.",
  location: "New York, USA",
  birthdate: "1995-07-15",
  gender: "male",
  avatar_url: null,
  isPremium: true,
  joinDate: "May 2023",
};

export function useUserProfile(): UseUserProfileReturn {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth(); // Get current user from AuthContext

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (TEST_MODE) {
          // In test mode, use localStorage or default profile
          await fetchProfileFromLocalStorage();
        } else {
          // In a real app with Firebase integration
          // Use currentUser from AuthContext instead of getCurrentUser()
          if (currentUser) {
            console.log("Found authenticated user:", currentUser.uid);
            await fetchUserProfile(currentUser.uid);
          } else {
            console.log("No authenticated user found");
            setUser(null);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
        console.error('Error initializing user:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
    
    // Auth state is already handled by AuthContext, so we don't need a separate listener here
  }, [currentUser]); // Add currentUser as a dependency

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const userProfile = await getUserProfile(userId);
      
      if (userProfile) {
        setUser({
          id: userProfile.id,
          uid: userProfile.uid,
          ign: userProfile.ign,
          fullName: userProfile.fullName,
          email: userProfile.email,
          phone: userProfile.phone || '',
          bio: userProfile.bio || '',
          location: userProfile.location || '',
          birthdate: userProfile.birthdate || '',
          gender: userProfile.gender || '',
          avatar_url: userProfile.avatar_url,
          isPremium: userProfile.isPremium,
          joinDate: userProfile.created_at ? new Date(userProfile.created_at.toDate()).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          }) : '',
        });
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
      console.error('Error loading profile from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile from localStorage in test mode
  const fetchProfileFromLocalStorage = async () => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      
      if (storedProfile) {
        setUser(JSON.parse(storedProfile));
      } else {
        // Use default profile if no stored profile exists
        setUser(DEFAULT_USER_PROFILE);
        
        // Save default profile to localStorage
        localStorage.setItem('userProfile', JSON.stringify(DEFAULT_USER_PROFILE));
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load user profile from local storage');
      console.error('Error loading profile from localStorage:', err);
      
      // Fallback to default profile on error
      setUser(DEFAULT_USER_PROFILE);
    }
  };

  // Update user profile
  const updateProfile = async (updates: ProfileUpdate) => {
    if (!currentUser) {
      const errorMsg = 'User not authenticated';
      console.error(errorMsg, { currentAuthUser: currentUser, profileUser: user });
      setError(errorMsg);
      toast({
        title: 'Update Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (TEST_MODE) {
        // In test mode, update localStorage
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('userProfile', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Update profile in Firestore
        console.log("Updating profile in Firestore for user:", currentUser.uid, updates);
        
        // Always use the current authenticated user's ID from AuthContext
        await updateUserProfile(currentUser.uid, updates);
        
        // Fetch updated profile
        await fetchUserProfile(currentUser.uid);
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const uploadUserAvatar = async (file: File): Promise<string> => {
    if (!currentUser) {
      const errorMsg = 'User not authenticated';
      setError(errorMsg);
      console.error(errorMsg, { currentAuthUser: currentUser, profileUser: user });
      throw new Error(errorMsg);
    }

    try {
      setLoading(true);
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Avatar must be less than 2MB');
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Avatar must be JPEG or PNG format');
      }
      
      let avatarUrl = '';
      
      if (TEST_MODE) {
        // In test mode, convert file to data URL
        avatarUrl = await fileToDataUrl(file);
        
        // Update user in localStorage
        const updatedUser = { ...user, avatar_url: avatarUrl };
        localStorage.setItem('userProfile', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        // Upload avatar to Firebase Storage
        console.log("Uploading avatar for user:", currentUser.uid);
        avatarUrl = await uploadFirebaseAvatar(currentUser.uid, file);
        
        // Update user profile with new avatar URL
        await updateUserProfile(currentUser.uid, { avatar_url: avatarUrl });
        
        // Fetch updated profile
        await fetchUserProfile(currentUser.uid);
      }
      
      toast({
        title: 'Avatar updated',
        description: 'Your avatar has been successfully updated.',
      });
      
      return avatarUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      toast({
        title: 'Upload failed',
        description: err instanceof Error ? err.message : 'Failed to upload avatar',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert File to data URL for test mode
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(new Error('Failed to convert file to data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    loading,
    user,
    updateProfile,
    uploadUserAvatar,
    error,
    isTestMode: TEST_MODE,
  };
} 