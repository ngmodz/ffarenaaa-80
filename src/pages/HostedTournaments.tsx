import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TournamentList from "@/components/home/TournamentList";
import { TournamentType } from "@/components/home/types";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTournament } from "@/contexts/TournamentContext";

const HostedTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentType[]>([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { hostedTournaments, isLoadingHostedTournaments, refreshHostedTournaments } = useTournament();
  
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
    
    // Refresh tournaments when component mounts and user is authenticated
    if (currentUser && refreshHostedTournaments) {
      refreshHostedTournaments().catch(error => {
        console.error("Failed to refresh tournaments:", error);
      });
    }
  }, [currentUser, navigate, toast, refreshHostedTournaments]);
  
  // Format tournaments for the TournamentList component
  useEffect(() => {
    try {
      if (Array.isArray(hostedTournaments) && hostedTournaments.length > 0) {
        const formattedTournaments: TournamentType[] = hostedTournaments.map(tournament => {
          // Safely calculate prize total, handling potential undefined values
          const prizeTotal = tournament.prize_distribution ? 
            Object.values(tournament.prize_distribution).reduce((total, amount) => total + amount, 0) : 0;
            
          return {
            id: tournament.id || "",
            title: tournament.name || "Unnamed Tournament",
            mode: tournament.mode || "Unknown",
            entryFee: tournament.entry_fee || 0,
            prizeMoney: prizeTotal,
            date: tournament.start_date || "",
            time: tournament.start_date ? new Date(tournament.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            totalSpots: tournament.max_players || 0,
            filledSpots: tournament.filled_spots || 0,
            status: tournament.status === 'active' ? 'active' : 
                    tournament.status === 'ongoing' ? 'ongoing' : 
                    tournament.status === 'completed' ? 'completed' : 'active',
            isPremium: (tournament.entry_fee || 0) > 100 // Just an example condition for premium
          };
        });
        
        setTournaments(formattedTournaments);
      } else {
        setTournaments([]);
      }
    } catch (error) {
      console.error("Error formatting tournaments:", error);
      setTournaments([]);
    }
  }, [hostedTournaments]);
  
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
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
      </div>
      
      {/* Tournament List */}
      <div className="mb-6">
        {isLoadingHostedTournaments ? (
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