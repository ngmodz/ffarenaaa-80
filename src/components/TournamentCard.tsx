import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface TournamentCardProps {
  id: string;
  title: string;
  entryFee: number;
  prizeMoney: number;
  date: string;
  time: string;
  totalSpots: number;
  filledSpots: number;
  mode: string;
  status: 'active' | 'ongoing' | 'completed' | 'cancelled';
  isPremium?: boolean;
}

const TournamentCard = ({
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
}: TournamentCardProps) => {
  const statusColors = {
    active: "bg-blue-500",
    ongoing: "bg-gaming-accent animate-pulse",
    completed: "bg-gray-500",
    cancelled: "bg-gray-500"
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
        boxShadow: "0 0 15px rgba(155, 135, 245, 0.5)",
        transition: { duration: 0.3 } 
      }}
      className="h-full w-full"
    >
      <Card className={cn(
        "overflow-hidden bg-[#1A1A1A] border border-[#333333] transition-all duration-300 flex flex-col h-full w-full transform p-4 rounded-lg",
        isPremium && "border-gaming-accent border-opacity-60"
      )}>
        {/* Status Badge */}
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
        
        {/* Premium Badge */}
        {isPremium && (
          <div className="bg-gaming-accent/20 text-gaming-accent text-xs font-bold px-2 py-1 rounded-md inline-block mb-3 w-fit">
            PREMIUM
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Prize Pool */}
          <div className="flex flex-col">
            <span className="text-[#A0A0A0] text-xs">Prize Pool</span>
            <div className="flex items-center">
              <Trophy size={16} className="text-gaming-accent mr-1.5" />
              <span className="font-bold text-sm sm:text-base text-gaming-accent">₹{prizeMoney}</span>
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
            <span className="text-[#A0A0A0] text-xs">Mode</span>
            <div className="flex items-center text-xs text-[#E0E0E0]">
              <span className="truncate">{mode} | Max: {totalSpots}</span>
            </div>
          </div>
        </div>
        
        {/* Participants Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-[#A0A0A0] mb-1">
            <span>Participants</span>
            <span>{filledSpots}/{totalSpots}</span>
          </div>
          
          {/* Progress Bar with improved animation */}
          <div className="w-full bg-[#333333] h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(filledSpots / totalSpots) * 100}%` }}
              transition={{ 
                duration: 1.2, 
                ease: [0.34, 1.56, 0.64, 1], 
                delay: 0.3 
              }}
              className={cn(
                "h-full rounded-full",
                isFullyBooked ? "bg-red-500" : "bg-gaming-primary"
              )}
            />
          </div>
        </div>
        
        {/* Action Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-auto"
        >
          <Link 
            to={`/tournaments/${id}`}
            className={cn(
              "w-full flex justify-center items-center text-center font-bold py-2.5 text-sm rounded-md text-white",
              status === 'completed' || status === 'cancelled'
                ? "bg-[#505050] hover:bg-[#606060]" 
                : status === 'ongoing'
                  ? "bg-gaming-accent hover:bg-gaming-accent/90"
                  : spotsLeft > 0 
                    ? "bg-gaming-primary hover:bg-gaming-primary/90" 
                    : "bg-red-500 hover:bg-red-600"
            )}
          >
            {status === 'completed' || status === 'cancelled'
              ? 'View Results' 
              : status === 'ongoing'
                ? 'Watch Live'
                : spotsLeft > 0 
                  ? 'Join Tournament' 
                  : 'Fully Booked'
            }
          </Link>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
