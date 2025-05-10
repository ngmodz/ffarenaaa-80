import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TournamentType } from "@/components/home/types";

interface TournamentCardProps {
  tournament: TournamentType;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const {
    id,
    title,
    entryFee,
    prizeMoney,
    date,
    time,
    totalSpots,
    filledSpots,
    mode,
    status,
    isPremium = false
  } = tournament;
  
  const statusColors = {
    active: "bg-blue-500",
    ongoing: "bg-gaming-accent animate-pulse",
    completed: "bg-gray-500",
    cancelled: "bg-gray-500"
  };
  
  // Get card gradient based on mode and premium status
  const getCardGradient = () => {
    if (isPremium) {
      // Premium tournaments get special gradients
      if (status === 'ongoing') {
        return "bg-gradient-to-br from-[#1E1A20] via-[#2A1A22] to-[#2D1A1A] border-gaming-accent border-opacity-70";
      }
      return "bg-gradient-to-br from-[#1A1A28] via-[#1E1A2A] to-[#231A2D] border-gaming-accent border-opacity-70";
    }
    
    // Regular tournaments get gradients based on mode
    switch (mode.toLowerCase()) {
      case "solo":
        return "bg-gradient-to-br from-[#1A1A20] via-[#1A1A24] to-[#1A1F2A]";
      case "duo":
        return "bg-gradient-to-br from-[#1A201A] via-[#1A2420] to-[#1A2A20]";
      case "squad":
        return "bg-gradient-to-br from-[#201A1A] via-[#241A1A] to-[#2A1A1A]";
      default:
        return "bg-[#1A1A1A]";
    }
  };
  
  // Get progress bar color based on status and fill rate
  const getProgressBarColor = () => {
    if (isFullyBooked) return "bg-red-500";
    
    if (isPremium) {
      return status === 'ongoing' 
        ? "bg-gradient-to-r from-gaming-accent via-gaming-accent to-gaming-primary" 
        : "bg-gradient-to-r from-gaming-primary via-[#a990ff] to-[#b69dff]";
    }
    
    // Different colors based on fill rate
    const fillRate = filledSpots / totalSpots;
    if (fillRate > 0.75) return "bg-gradient-to-r from-gaming-primary to-blue-400";
    if (fillRate > 0.5) return "bg-gradient-to-r from-gaming-primary to-purple-400";
    if (fillRate > 0.25) return "bg-gradient-to-r from-gaming-primary to-indigo-400";
    return "bg-gaming-primary";
  };
  
  // Get mode badge color
  const getModeBadgeColor = () => {
    switch (mode.toLowerCase()) {
      case "solo": return "bg-blue-500/20 text-blue-400";
      case "duo": return "bg-green-500/20 text-green-400";
      case "squad": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
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
  
  const spotsLeft = totalSpots - filledSpots;
  const isFullyBooked = spotsLeft === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: isPremium 
          ? "0 0 20px rgba(249, 115, 22, 0.3)" 
          : "0 0 15px rgba(155, 135, 245, 0.3)",
        transition: { duration: 0.3 } 
      }}
      className="h-full w-full"
    >
      <Card className={cn(
        "overflow-hidden border border-[#333333] transition-all duration-300 flex flex-col h-full w-full transform p-4 rounded-lg",
        getCardGradient()
      )}>
        {/* Header with status and mode badges */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">{title}</h3>
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
              "text-2xs font-bold sm:text-xs px-2 py-1 rounded-md text-white",
              statusColors[status]
            )}
          >
            {getStatusText(status)}
          </motion.div>
        </div>
        
        {/* Badge Row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isPremium && (
            <div className="bg-gaming-accent/20 text-gaming-accent text-xs font-bold px-2 py-1 rounded-md inline-block">
              PREMIUM
            </div>
          )}
          
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded-md inline-block",
            getModeBadgeColor()
          )}>
            {mode.toUpperCase()}
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Prize Pool */}
          <div className="flex flex-col">
            <span className="text-[#A0A0A0] text-xs">Prize Pool</span>
            <div className="flex items-center">
              <Trophy size={16} className={cn(
                isPremium ? "text-gaming-accent" : "text-gaming-primary", 
                "mr-1.5"
              )} />
              <span className={cn(
                "font-bold text-sm sm:text-base",
                isPremium ? "text-gaming-accent" : "text-gaming-primary"
              )}>₹{prizeMoney}</span>
            </div>
          </div>
          
          {/* Entry Fee */}
          <div className="flex flex-col">
            <span className="text-[#A0A0A0] text-xs">Entry Fee</span>
            <span className="font-bold text-sm sm:text-base text-[#D0D0D0]">₹{entryFee}</span>
          </div>
          
          {/* Date & Time */}
          <div className="flex flex-col">
            <span className="text-[#A0A0A0] text-xs">Start Date</span>
            <div className="flex text-xs items-center text-[#E0E0E0]">
              <Calendar size={14} className="mr-1.5 flex-shrink-0 text-[#C0C0C0]" />
              <span className="truncate">{date}</span>
            </div>
          </div>
          
          {/* Mode & Participants */}
          <div className="flex flex-col">
            <span className="text-[#A0A0A0] text-xs">Max Players</span>
            <div className="flex items-center text-xs text-[#E0E0E0]">
              <Users size={14} className="mr-1.5 flex-shrink-0 text-[#C0C0C0]" />
              <span className="truncate">{totalSpots}</span>
            </div>
          </div>
        </div>
        
        {/* Participants Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-1">
            <span>Participants</span>
            <span>{filledSpots}/{totalSpots}</span>
          </div>
          
          <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full", getProgressBarColor())}
              style={{ width: `${(filledSpots / totalSpots) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto pt-2">
          <Link 
            to={`/tournament/${id}`}
            className={cn(
              "block w-full py-2 text-center rounded-md text-white font-medium text-sm transition-colors",
              status === 'active' && !isFullyBooked
                ? "bg-gaming-primary hover:bg-gaming-primary/90" 
                : status === 'ongoing'
                  ? "bg-gaming-accent hover:bg-gaming-accent/90"
                  : "bg-[#505050] hover:bg-[#606060]"
            )}
          >
            {status === 'active' && !isFullyBooked
              ? 'Join Tournament'
              : status === 'ongoing'
                ? 'Watch Now'
                : status === 'completed'
                  ? 'View Results'
                  : isFullyBooked 
                    ? 'Fully Booked'
                    : 'View Details'
            }
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
