import { Calendar, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TournamentType } from "@/components/home/types";

interface FeaturedTournamentProps {
  tournament: TournamentType;
}

// Array of gaming-related background images from Unsplash
const backgroundImages = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1170",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1742",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1170",
  "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1170",
  "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1734",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1170",
];

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
  
  // Get a random background image
  const getBackgroundImage = () => {
    // Use the tournament ID to generate a consistent index if available
    if (tournament.id) {
      const idSum = tournament.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = idSum % backgroundImages.length;
      return backgroundImages[index];
    }
    // Otherwise choose randomly
    return backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Featured Tournament</h2>
      </div>
      
      {/* Featured tournament card with background image */}
      <div 
        className="rounded-xl overflow-hidden relative" 
        style={{ height: "220px" }}
      >
        {/* Background image */}
        <img 
          src={getBackgroundImage()} 
          alt="Tournament background"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        
        {/* Tournament details overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top row with badges */}
          <div className="flex flex-wrap gap-2">
            {tournament.isPremium && (
              <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                PREMIUM
              </div>
            )}
            <div className={`text-white text-xs px-2 py-1 rounded-md flex items-center ${
              getStatusColor(tournament.status)
            }`}>
              {tournament.status === 'ongoing' && (
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
              )}
              {getStatusText(tournament.status)}
            </div>
          </div>
          
          {/* Bottom section with title and details */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{tournament.title}</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="flex items-center text-white">
                <Trophy size={16} className="mr-1.5 text-gaming-accent" />
                <span className="font-bold text-gaming-accent">₹{tournament.prizeMoney}</span>
              </div>
              
              <div className="flex items-center text-white">
                <Calendar size={16} className="mr-1.5 text-[#C0C0C0]" />
                <span className="text-sm">{tournament.date}</span>
              </div>
              
              <div className="flex items-center text-white">
                <Users size={16} className="mr-1.5 text-[#C0C0C0]" />
                <span className="text-sm">{tournament.filledSpots}/{tournament.totalSpots}</span>
              </div>
            </div>
            
            {/* Action button */}
            <Link to={`/tournament/${tournament.id}`}>
              <Button 
                className={tournament.status === 'ongoing' 
                  ? "bg-gaming-accent hover:bg-gaming-accent/90" 
                  : "bg-gaming-primary hover:bg-gaming-primary/90"
                }
              >
                {tournament.status === 'ongoing' ? 'Watch Live' : tournament.status === 'active' ? 'Join Tournament' : 'View Details'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTournament;
