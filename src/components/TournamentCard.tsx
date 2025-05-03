
import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface TournamentCardProps {
  id: string;
  title: string;
  image: string;
  entryFee: number;
  prizeMoney: number;
  date: string;
  time: string;
  totalSpots: number;
  filledSpots: number;
  status: 'upcoming' | 'live' | 'completed';
}

const TournamentCard = ({
  id,
  title,
  image,
  entryFee,
  prizeMoney,
  date,
  time,
  totalSpots,
  filledSpots,
  status
}: TournamentCardProps) => {
  const statusColors = {
    upcoming: "bg-blue-500",
    live: "bg-gaming-accent animate-pulse",
    completed: "bg-gray-500"
  };
  
  const spotsLeft = totalSpots - filledSpots;
  const isFullyBooked = spotsLeft === 0;
  
  return (
    <Card className="overflow-hidden bg-gaming-card border-gaming-border hover:border-gaming-primary/50 transition-all flex flex-col h-full w-full">
      <div className="relative">
        {/* Status Badge */}
        <div className={cn(
          "absolute top-2 right-2 text-2xs sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-white font-medium z-10",
          statusColors[status]
        )}>
          {status === 'live' ? 'LIVE NOW' : status.toUpperCase()}
        </div>
        
        {/* Tournament Image */}
        <img 
          src={image} 
          alt={title} 
          className="h-28 sm:h-32 w-full object-cover"
          loading="lazy"
        />
        
        {/* Prize Money */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1.5 sm:p-2 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy size={14} className="text-gaming-accent mr-1" />
            <span className="font-bold text-xs sm:text-sm">₹{prizeMoney}</span>
          </div>
          <div className="text-2xs sm:text-xs bg-gaming-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            ₹{entryFee} Entry
          </div>
        </div>
      </div>
      
      <div className="p-2.5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-gaming-text mb-1.5 sm:mb-2 line-clamp-1">{title}</h3>
        
        {/* Details */}
        <div className="space-y-1.5 sm:space-y-2 flex-grow">
          <div className="flex text-2xs sm:text-xs items-center text-gaming-muted">
            <Calendar size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">{date}</span>
            <Clock size={12} className="ml-1.5 mr-1 flex-shrink-0" />
            <span className="truncate">{time}</span>
          </div>
          
          <div className="flex items-center text-2xs sm:text-xs text-gaming-muted">
            <Users size={12} className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {filledSpots}/{totalSpots} Participants
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gaming-border h-1 sm:h-1.5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full",
                isFullyBooked ? "bg-red-500" : "bg-gaming-primary"
              )}
              style={{ width: `${(filledSpots / totalSpots) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Action Button */}
        <Link 
          to={`/tournaments/${id}`}
          className="btn-gaming-primary w-full mt-2.5 text-center text-xs sm:text-sm"
        >
          {status === 'completed' ? 'View Results' : spotsLeft > 0 ? 'Join Tournament' : 'Fully Booked'}
        </Link>
      </div>
    </Card>
  );
};

export default TournamentCard;
