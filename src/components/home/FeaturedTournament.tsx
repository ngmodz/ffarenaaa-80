import { Calendar, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TournamentType } from "@/components/home/types";

interface FeaturedTournamentProps {
  tournament: TournamentType;
}

const FeaturedTournament = ({ tournament }: FeaturedTournamentProps) => {
  // Status color and text mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing": return "bg-gaming-accent";
      case "active": return "bg-blue-500";
      case "cancelled": return "bg-[#505050]";
      case "completed": return "bg-[#505050]";
      default: return "bg-[#505050]";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing": return "LIVE NOW";
      case "active": return "UPCOMING";
      case "cancelled": return "CANCELLED";
      case "completed": return "COMPLETED";
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Featured Tournament</h2>
      </div>
      
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#1F2133] border border-[#333333] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Tournament Details */}
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-2">
              {tournament.isPremium && (
                <div className="bg-gaming-accent/20 text-gaming-accent text-xs font-bold px-2 py-0.5 sm:py-1 rounded-md">
                  PREMIUM
                </div>
              )}
              <div className={`text-white text-xs px-2 py-0.5 sm:py-1 rounded-md flex items-center ${
                getStatusColor(tournament.status)
              }`}>
                {tournament.status === 'ongoing' && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                )}
                {getStatusText(tournament.status)}
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{tournament.title}</h3>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
              <div className="flex items-center text-white">
                <Trophy size={16} className="mr-1.5 text-gaming-accent" />
                <span className="font-bold text-gaming-accent">₹{tournament.prizeMoney}</span>
              </div>
              
              <div className="flex items-center text-white">
                <span className="font-medium text-[#A0A0A0]">Entry: </span>
                <span className="ml-1 font-bold text-[#D0D0D0]">₹{tournament.entryFee}</span>
              </div>
              
              <div className="flex items-center text-[#E0E0E0]">
                <Calendar size={16} className="mr-1.5 text-[#C0C0C0]" />
                <span>{tournament.date}</span>
              </div>
              
              <div className="flex items-center text-[#E0E0E0]">
                <span className="font-medium text-[#A0A0A0]">Mode: </span>
                <span className="ml-1">{tournament.mode}</span>
              </div>
            </div>
            
            <div className="flex items-center text-[#A0A0A0] text-xs mb-3">
              <span className="font-medium">Participants: </span>
              <span className="ml-1">{tournament.filledSpots}/{tournament.totalSpots}</span>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0">
            <Link to={`/tournament/${tournament.id}`}>
              <Button className="w-full sm:w-auto bg-gaming-primary hover:bg-gaming-primary/90">
                {tournament.status === 'active' ? 'Join Tournament' : 'View Details'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTournament; 