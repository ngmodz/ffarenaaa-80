import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
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

  const refreshHostedTournaments = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setIsLoadingHostedTournaments(true);
      const fetchedTournaments = await getHostedTournaments();
      setHostedTournaments(fetchedTournaments);
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
      setIsLoadingHostedTournaments(false);
    }
  }, [currentUser, toast]);

  // Load hosted tournaments when the user changes
  useEffect(() => {
    if (currentUser) {
      refreshHostedTournaments();
    } else {
      // Clear tournaments if no user is logged in
      setHostedTournaments([]);
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