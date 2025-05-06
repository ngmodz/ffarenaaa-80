import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  DocumentReference
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth, mockServerTimestamp } from "./firebase";
import { TournamentFormData } from "@/pages/TournamentCreate";

// Tournament type definition
export interface Tournament {
  id: string;
  name: string;
  description: string;
  mode: "Solo" | "Duo" | "Squad";
  max_players: number;
  start_date: string;
  map: string;
  room_type: "Classic" | "Clash Squad";
  custom_settings: {
    auto_aim: boolean;
    [key: string]: any;
  };
  entry_fee: number;
  prize_distribution: {
    [key: string]: number;
  };
  rules: string;
  banner_image_url: string | null;
  host_id: string;
  status: "active" | "ongoing" | "completed" | "cancelled";
  created_at: Timestamp | string; // Updated to handle string for mock data
  participants: string[];
  filled_spots: number;
}

// Create a new tournament
export const createTournament = async (tournamentData: Omit<TournamentFormData, "banner_image">) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to create a tournament");
    }
    
    // Prepare tournament data
    const tournament = {
      ...tournamentData,
      host_id: currentUser.uid,
      status: "active" as const,
      created_at: mockServerTimestamp(),
      participants: [],
      filled_spots: 0,
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, "tournaments"), tournament);
    
    // Return the created tournament with its ID
    return {
      id: docRef.id,
      ...tournament,
    };
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
};

// Upload tournament banner image
export const uploadTournamentBanner = async (file: File): Promise<string> => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `tournament-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `tournament-images/${fileName}`;
    
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, filePath);
      const uploadResult = await uploadBytes(storageRef, file);
      
      // Get download URL from real Firebase
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.warn("Using mock upload:", e);
      // Fallback for mock implementation
      return `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`;
    }
  } catch (error) {
    console.error("Error uploading tournament banner:", error);
    throw error;
  }
};

// Get all tournaments
export const getTournaments = async () => {
  try {
    const q = query(
      collection(db, "tournaments"),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Tournament[];
  } catch (error) {
    console.error("Error getting tournaments:", error);
    throw error;
  }
};

// Get tournaments by status
export const getTournamentsByStatus = async (status: Tournament["status"]) => {
  try {
    const q = query(
      collection(db, "tournaments"),
      where("status", "==", status),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Tournament[];
  } catch (error) {
    console.error(`Error getting ${status} tournaments:`, error);
    throw error;
  }
};

// Get tournament by ID
export const getTournamentById = async (id: string) => {
  try {
    const docRef = doc(db, "tournaments", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Tournament;
    } else {
      throw new Error("Tournament not found");
    }
  } catch (error) {
    console.error("Error getting tournament:", error);
    throw error;
  }
};

// Update tournament status
export const updateTournamentStatus = async (id: string, status: Tournament["status"]) => {
  try {
    const docRef = doc(db, "tournaments", id);
    await updateDoc(docRef, { status });
    
    return { id, status };
  } catch (error) {
    console.error("Error updating tournament status:", error);
    throw error;
  }
};

// Join tournament (for participants)
export const joinTournament = async (tournamentId: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to join a tournament");
    }
    
    // Get the tournament
    const tournament = await getTournamentById(tournamentId);
    
    // Check if the tournament is full
    if (tournament.filled_spots >= tournament.max_players) {
      throw new Error("Tournament is full");
    }
    
    // Check if the user is already a participant
    if (tournament.participants.includes(currentUser.uid)) {
      throw new Error("You have already joined this tournament");
    }
    
    // Update the tournament
    const docRef = doc(db, "tournaments", tournamentId);
    await updateDoc(docRef, {
      participants: [...tournament.participants, currentUser.uid],
      filled_spots: tournament.filled_spots + 1,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error joining tournament:", error);
    throw error;
  }
};

// Save tournament as draft
export const saveTournamentDraft = async (tournamentData: Omit<TournamentFormData, "banner_image">) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to save a tournament draft");
    }
    
    // Prepare draft data
    const draft = {
      ...tournamentData,
      host_id: currentUser.uid,
      updated_at: serverTimestamp(),
    };
    
    // Check if a draft already exists for this user
    const q = query(
      collection(db, "tournament_drafts"),
      where("host_id", "==", currentUser.uid)
    );
    
    const querySnapshot = await getDocs(q);
    
    // If a draft exists, update it; otherwise, create a new one
    if (!querySnapshot.empty) {
      const draftDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "tournament_drafts", draftDoc.id), draft);
      
      return {
        id: draftDoc.id,
        ...draft,
      };
    } else {
      const docRef = await addDoc(collection(db, "tournament_drafts"), draft);
      
      return {
        id: docRef.id,
        ...draft,
      };
    }
  } catch (error) {
    console.error("Error saving tournament draft:", error);
    throw error;
  }
};

// Get tournament draft for current user
export const getTournamentDraft = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to get your tournament draft");
    }
    
    const q = query(
      collection(db, "tournament_drafts"),
      where("host_id", "==", currentUser.uid),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const draftDoc = querySnapshot.docs[0];
      
      return {
        id: draftDoc.id,
        ...draftDoc.data(),
      } as Omit<Tournament, "status" | "created_at" | "participants" | "filled_spots"> & { updated_at: Timestamp };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting tournament draft:", error);
    throw error;
  }
}; 