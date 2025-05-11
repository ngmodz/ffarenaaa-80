import { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import { getHostedTournaments, Tournament } from '@/lib/tournamentService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TournamentContextType {
  hostedTournaments: Tournament[];
  refreshHostedTournaments: () => Promise<void>;
  isLoadingHostedTournaments: boolean;
}

// Create a default context with empty values to avoid null checks
const defaultContextValue: TournamentContextType = {
  hostedTournaments: [],
  refreshHostedTournaments: async () => {},
  isLoadingHostedTournaments: false
};

const TournamentContext = createContext<TournamentContextType>(defaultContextValue);

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [hostedTournaments, setHostedTournaments] = useState<Tournament[]>([]);
  const [isLoadingHostedTournaments, setIsLoadingHostedTournaments] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const loadingTimeoutRef = useRef<number | null>(null);

  // Clear any existing timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const refreshHostedTournaments = useCallback(async () => {
    if (!currentUser) {
      setIsLoadingHostedTournaments(false);
      setHostedTournaments([]);
      return;
    }
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Set a timeout to ensure loading state is eventually cleared
    // even if the request doesn't complete properly
    loadingTimeoutRef.current = window.setTimeout(() => {
      console.log("Loading timeout triggered - forcing loading state to false");
      setIsLoadingHostedTournaments(false);
      setHostedTournaments([]);
    }, 10000) as unknown as number; // 10 second timeout
    
    try {
      setIsLoadingHostedTournaments(true);
      const fetchedTournaments = await getHostedTournaments();
      
      // Clear the timeout since we got a response
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      setHostedTournaments(Array.isArray(fetchedTournaments) ? fetchedTournaments : []);
    } catch (error) {
      console.error("Error fetching hosted tournaments:", error);
      toast({
        title: "Error loading tournaments",
        description: "There was a problem loading your hosted tournaments.",
        variant: "destructive"
      });
      // Set empty array on error to prevent using stale data
      setHostedTournaments([]);
    } finally {
      // Clear the timeout since we're done processing
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoadingHostedTournaments(false);
    }
  }, [currentUser, toast]);

  // Load hosted tournaments when the user changes
  useEffect(() => {
    if (currentUser) {
      refreshHostedTournaments().catch(err => {
        console.error("Failed to refresh tournaments in useEffect:", err);
        setIsLoadingHostedTournaments(false);
        setHostedTournaments([]);
      });
    } else {
      // Clear tournaments if no user is logged in
      setHostedTournaments([]);
      setIsLoadingHostedTournaments(false);
    }
  }, [currentUser, refreshHostedTournaments]);

  const value = {
    hostedTournaments,
    refreshHostedTournaments,
    isLoadingHostedTournaments
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  return context;
}; 