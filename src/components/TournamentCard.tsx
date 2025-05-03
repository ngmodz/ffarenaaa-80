
import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 0 15px rgba(155, 135, 245, 0.5)",
        transition: { duration: 0.3 } 
      }}
      className="h-full"
    >
      <Card className="overflow-hidden bg-gaming-card border-gaming-border hover:border-gaming-primary/50 transition-all duration-300 flex flex-col h-full w-full transform">
        <div className="relative">
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
              "absolute top-2 right-2 text-2xs font-bold sm:text-xs px-2 py-1 rounded-md text-white z-10",
              statusColors[status]
            )}
          >
            {status === 'live' ? 'LIVE NOW' : status.toUpperCase()}
          </motion.div>
          
          {/* Tournament Image */}
          <div className="overflow-hidden">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={image} 
              alt={title} 
              className="h-32 w-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* Prize Money */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white p-2 flex justify-between items-center">
            <div className="flex items-center">
              <Trophy size={16} className="text-gaming-accent mr-1.5" />
              <span className="font-bold text-sm sm:text-base">${prizeMoney}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xs font-bold bg-gaming-primary px-2 py-1 rounded-md"
            >
              ${entryFee} Entry
            </motion.div>
          </div>
        </div>
        
        <div className="p-3 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-gaming-text mb-2 line-clamp-1">{title}</h3>
          
          {/* Details */}
          <div className="space-y-2 flex-grow">
            <div className="flex text-xs items-center text-gaming-muted">
              <Calendar size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">{date}</span>
              <Clock size={14} className="ml-2 mr-1.5 flex-shrink-0" />
              <span className="truncate">{time}</span>
            </div>
            
            <div className="flex items-center text-xs text-gaming-muted">
              <Users size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">
                {filledSpots}/{totalSpots} Participants
              </span>
            </div>
            
            {/* Progress Bar with improved animation */}
            <div className="w-full bg-gaming-border/50 h-1.5 rounded-full overflow-hidden mt-1">
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
            className="mt-3"
          >
            <Link 
              to={`/tournaments/${id}`}
              className="btn-gaming-primary w-full flex justify-center items-center text-center font-bold py-2.5 text-sm"
            >
              {status === 'completed' ? 'View Results' : spotsLeft > 0 ? 'Join Tournament' : 'Fully Booked'}
            </Link>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
