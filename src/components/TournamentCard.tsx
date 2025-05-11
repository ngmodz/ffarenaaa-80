
import { Calendar, Clock, Trophy, Users, Coins } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TournamentType } from "@/components/home/types";
import { format, parseISO } from 'date-fns';

// Array of banner images to randomly assign to tournaments
const bannerImages = [
  "https://iili.io/3v8Y6nS.jpg", // photo 1627856013091
  "https://iili.io/3v8Yrt2.jpg", // photo 1598550476439
  "https://iili.io/3v8YUu4.jpg", // photo 1563089145
  "https://iili.io/3v8Yv8G.jpg", // photo 1560253023
  "https://iili.io/3v8Ykas.jpg", // photo 1542751371
  "https://iili.io/3v8YN6X.jpg", // photo 1511512578047
  "https://iili.io/3v8YjnI.jpg", // photo 1511882150382
  "https://iili.io/3v8YXZN.jpg", // photo 1550745165
  "https://iili.io/3v8YWjp.jpg", // photo 1616588589676
  "https://iili.io/3v8YVuR.jpg", // photo 1603481546238
];

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
    isPremium = false,
    bannerImage
  } = tournament;
  
  // If no banner is specified, use the tournament ID to consistently select a banner
  const getBannerImage = () => {
    if (bannerImage) return bannerImage;
    
    // Use the tournament ID to generate a consistent index
    const idSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = idSum % bannerImages.length;
    return bannerImages[index];
  };
  
  const statusColors = {
    active: "bg-blue-500",
    ongoing: "bg-gaming-accent animate-pulse",
    completed: "bg-gray-500",
    cancelled: "bg-gray-500"
  };
  
  // Format date properly
  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = parseISO(dateStr);
      return format(parsedDate, 'dd MMM yyyy');
    } catch (error) {
      return dateStr; // Return original if parsing fails
    }
  };

  // Get status text for display
  const getStatusText = (status: string) => {
    switch (status) {
      case "ongoing": return "LIVE NOW";
      case "active": return "UPCOMING";
      case "cancelled": return "CANCELLED";
      case "completed": return "COMPLETED";
      default: return status.toUpperCase();
    }
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
  
  const spotsLeft = totalSpots - filledSpots;
  const isFullyBooked = spotsLeft === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: isPremium 
          ? "0 0 20px rgba(249, 115, 22, 0.3)" 
          : "0 0 15px rgba(155, 135, 245, 0.3)",
        transition: { duration: 0.3 } 
      }}
      className="h-full w-full"
    >
      <Card className={cn(
        "overflow-hidden border border-[#333333] transition-all duration-300 flex flex-col h-full transform rounded-lg",
        "bg-[#1A1A1A]"
      )}>
        {/* Card Top Info Section */}
        <div className="p-3 flex justify-between items-center">
          {/* Mode Badge */}
          <div className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-md",
            getModeBadgeColor()
          )}>
            {mode.toUpperCase()}
          </div>
          
          {/* Status Badge */}
          <div className={cn(
            "text-2xs font-bold px-2 py-0.5 rounded-md text-white",
            statusColors[status]
          )}>
            {getStatusText(status)}
          </div>
        </div>
        
        {/* Tournament Banner Image - 16:9 ratio */}
        <div className="w-full relative aspect-video">
          <img 
            src={getBannerImage()} 
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Premium badge overlay if premium */}
          {isPremium && (
            <div className="absolute top-3 left-3 bg-gaming-accent/90 text-white text-xs font-bold px-2 py-1 rounded-md">
              PREMIUM
            </div>
          )}
          
          {/* Title overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
            <h3 className="font-bold text-sm text-white truncate">{title}</h3>
          </div>
        </div>
        
        {/* Card Body - Tournament Details */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Tournament Details - 2 rows */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {/* Entry Fee */}
            <div className="flex items-center">
              <Coins size={14} className="text-[#D0D0D0] mr-1" />
              <span className="text-[#D0D0D0]">₹{entryFee}</span>
            </div>
            
            {/* Prize Pool */}
            <div className="flex items-center justify-end">
              <Trophy size={14} className={cn(isPremium ? "text-gaming-accent" : "text-gaming-primary", "mr-1")} />
              <span className={cn(isPremium ? "text-gaming-accent" : "text-gaming-primary")}>₹{prizeMoney}</span>
            </div>
            
            {/* Date */}
            <div className="flex items-center mt-1.5">
              <Calendar size={14} className="text-[#C0C0C0] mr-1" />
              <span className="text-xs text-[#E0E0E0]">{formatDate(date)}</span>
            </div>
            
            {/* Time */}
            <div className="flex items-center justify-end mt-1.5">
              <Clock size={14} className="text-[#C0C0C0] mr-1" />
              <span className="text-xs text-[#E0E0E0]">{time || "TBD"}</span>
            </div>
          </div>
          
          {/* Participants Progress */}
          <div className="my-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center">
                <Users size={14} className="text-[#C0C0C0] mr-1" />
                <span className="text-[#A0A0A0]">Participants</span>
              </div>
              <span className="font-medium text-white">{filledSpots}/{totalSpots}</span>
            </div>
            
            <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  isPremium ? "bg-gradient-to-r from-gaming-primary to-gaming-accent" : "bg-gaming-primary"
                )}
                style={{ width: `${Math.max((filledSpots / totalSpots) * 100, 5)}%` }}
              />
            </div>
          </div>
          
          {/* Action Button */}
          <div className="mt-auto">
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
                ? 'Join Now'
                : status === 'ongoing'
                  ? 'Watch Live'
                  : status === 'completed'
                    ? 'View Results'
                    : isFullyBooked 
                      ? 'Fully Booked'
                      : 'View Details'
              }
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
