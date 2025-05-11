import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TournamentList from "@/components/home/TournamentList";
import { TournamentType } from "@/components/home/types";
import { getHostedTournaments } from "@/lib/tournamentService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const HostedTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Verify authentication on component mount
  useEffect(() => {
    if (!currentUser) {
      console.error("No authenticated user found. Redirecting to auth page.");
      toast({
        title: "Authentication required",
        description: "Please log in to view your hosted tournaments.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
  }, [currentUser, navigate, toast]);
  
  // Fetch hosted tournaments from Firebase
  useEffect(() => {
    const fetchHostedTournaments = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const fetchedTournaments = await getHostedTournaments();
        
        // Convert Firebase tournament data to the format expected by the UI components
        const formattedTournaments: TournamentType[] = fetchedTournaments.map(tournament => {
          const prizeTotal = tournament.prize_distribution ? 
            Object.values(tournament.prize_distribution).reduce((total, amount) => total + amount, 0) : 0;
            
          return {
            id: tournament.id,
            title: tournament.name,
            mode: tournament.mode,
            entryFee: tournament.entry_fee,
            prizeMoney: prizeTotal,
            date: tournament.start_date,
            time: new Date(tournament.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            totalSpots: tournament.max_players,
            filledSpots: tournament.filled_spots || 0,
            status: tournament.status === 'active' ? 'active' : 
                    tournament.status === 'ongoing' ? 'ongoing' : 
                    tournament.status === 'completed' ? 'completed' : 'active',
            isPremium: tournament.entry_fee > 100 // Just an example condition for premium
          };
        });
        
        setTournaments(formattedTournaments);
      } catch (error) {
        console.error("Error fetching hosted tournaments:", error);
        toast({
          title: "Error loading tournaments",
          description: "There was a problem loading your hosted tournaments. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHostedTournaments();
  }, [currentUser, toast]);
  
  // Force a refresh of the tournaments data
  const refreshTournaments = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your hosted tournaments.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    try {
      setLoading(true);
      const fetchedTournaments = await getHostedTournaments();
      
      // Convert Firebase tournament data to the format expected by the UI components
      const formattedTournaments: TournamentType[] = fetchedTournaments.map(tournament => ({
        id: tournament.id,
        title: tournament.name,
        mode: tournament.mode,
        entryFee: tournament.entry_fee,
        prizeMoney: tournament.prize_distribution ? 
          Object.values(tournament.prize_distribution).reduce((total, amount) => total + amount, 0) : 0,
        date: tournament.start_date,
        time: new Date(tournament.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        totalSpots: tournament.max_players,
        filledSpots: tournament.filled_spots || 0,
        status: tournament.status === 'active' ? 'active' : 
                tournament.status === 'ongoing' ? 'ongoing' : 
                tournament.status === 'completed' ? 'completed' : 'active',
        isPremium: tournament.entry_fee > 100 // Just an example condition for premium
      }));
      
      setTournaments(formattedTournaments);
      toast({
        title: "Tournaments refreshed",
        description: "Your hosted tournaments have been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing tournaments:", error);
      toast({
        title: "Error refreshing tournaments",
        description: "Failed to refresh your tournaments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/home" className="mr-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-gaming-card hover:bg-gaming-card/80">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              My Hosted Tournaments
            </h1>
            <p className="text-[#A0A0A0] text-sm">Tournaments you've created and manage</p>
          </div>
        </div>
        <Button 
          onClick={refreshTournaments} 
          variant="outline" 
          className="text-gaming-primary border-gaming-primary"
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      
      {/* Tournament List */}
      <div className="mb-6">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-[#A0A0A0]">Loading your tournaments...</p>
          </div>
        ) : tournaments.length > 0 ? (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">All Hosted Tournaments ({tournaments.length})</h2>
            </div>
            <TournamentList tournaments={tournaments} />
          </>
        ) : (
          <div className="text-center py-10 bg-gaming-card rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">No tournaments hosted yet</h3>
            <p className="text-[#A0A0A0] mb-4">Start creating tournaments and manage them here</p>
            <Link to="/tournament/create">
              <Button className="bg-gaming-primary hover:bg-gaming-primary/90">
                Create Tournament
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostedTournaments; 