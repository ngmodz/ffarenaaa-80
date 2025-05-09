import React from "react";
import { Calendar, Clock, Trophy, Check, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TournamentHeaderProps } from "./types";

const TournamentHeader: React.FC<TournamentHeaderProps> = ({
  tournament,
  isHost,
  onSetRoomDetails
}) => {
  // Mock organizer data
  const mockOrganizer = {
    name: "GamersHub",
    verified: true,
    tournaments: 45
  };

  return (
    <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
      <img 
        src={tournament.banner_image_url || "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1000"} 
        alt={tournament.name} 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full p-4 z-20">
        <div className="flex items-center mb-2">
          <div className="bg-gaming-primary text-white text-xs px-2 py-1 rounded">
            {tournament.status.toUpperCase()}
          </div>
          {isHost && (
            <Button 
              onClick={onSetRoomDetails} 
              size="sm" 
              className="ml-auto bg-gaming-accent hover:bg-gaming-accent/90 text-white"
            >
              <Edit3 size={16} className="mr-1.5" />
              Set Room Details
            </Button>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{tournament.name}</h1>
        <div className="flex items-center flex-wrap text-white/80 text-sm mb-3 gap-3">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{new Date(tournament.start_date).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center">
            <Trophy size={16} className="mr-1 text-gaming-accent" />
            <span className="font-bold">₹{tournament.entry_fee * tournament.max_players * 0.8} Prize (Example)</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-white/20 px-2 py-0.5 rounded">
              <span>By {mockOrganizer.name}</span>
              {mockOrganizer.verified && (
                <Check size={14} className="ml-1 text-gaming-primary" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentHeader; 