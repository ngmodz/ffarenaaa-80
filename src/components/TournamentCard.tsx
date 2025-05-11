
import { Calendar, Clock, Users } from "lucide-react";
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
  
  // Get status text and color for display
  const getStatusInfo = () => {
    switch (status) {
      case "ongoing": 
        return { text: "LIVE NOW", bgColor: "bg-gaming-accent" };
      case "active": 
        return { text: "UPCOMING", bgColor: "bg-blue-500" };
      case "completed": 
        return { text: "COMPLETED", bgColor: "bg-gray-500" };
      case "cancelled": 
        return { text: "CANCELLED", bgColor: "bg-gray-500" };
      default: 
        return { text: status ? status.toUpperCase() : "UNKNOWN", bgColor: "bg-blue-500" };
    }
  };
  
  const { text: statusText, bgColor: statusBgColor } = getStatusInfo();

  // Format date properly
  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = parseISO(dateStr);
      return format(parsedDate, 'MMM d, yyyy');
    } catch (error) {
      return dateStr; // Return original if parsing fails
    }
  };
  
  const spotsLeft = totalSpots - filledSpots;
  const isFullyBooked = spotsLeft === 0;
  
  // Get button text based on tournament status
  const getButtonText = () => {
    if (status === 'active' && !isFullyBooked) return 'Join Tournament';
    if (status === 'ongoing') return 'View Results';
    if (status === 'completed') return 'View Results';
    if (isFullyBooked) return 'Fully Booked';
    return 'Join Tournament';
  };

  // Determine button style based on status
  const getButtonStyle = () => {
    if (status === 'ongoing') return "bg-gaming-accent hover:bg-gaming-accent/90";
    if (status === 'completed' || isFullyBooked) return "bg-gray-500 hover:bg-gray-600";
    return "bg-gaming-primary hover:bg-gaming-primary/90";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.3 } 
      }}
      className="h-full w-full"
    >
      <Card className="overflow-hidden border border-[#333333] transition-all rounded-lg bg-[#1A1A1A] h-full flex flex-col">
        {/* Main Content with Banner Image and Overlay Details */}
        <div className="relative w-full aspect-video">
          {/* Banner Image */}
          <img 
            src={getBannerImage()} 
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Prize and Entry Overlay - Top */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-2">
            {/* Prize Money */}
            <div className="flex items-center bg-black/60 text-white text-sm font-bold px-2 py-1 rounded">
              <span className="text-gaming-accent">₹{prizeMoney}</span>
            </div>
            
            {/* Status Badge */}
            <div className={cn(
              "text-xs font-bold px-2 py-1 rounded text-white",
              statusBgColor
            )}>
              {statusText}
            </div>
          </div>
          
          {/* Entry Fee - Bottom right */}
          <div className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
            ₹{entryFee} Entry
          </div>
        </div>
        
        {/* Tournament Title and Details */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-white mb-2">{title}</h3>
          
          {/* Details - Date, Time, Participants */}
          <div className="space-y-1.5 text-sm text-gray-300 mb-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1.5" />
              <span>{formatDate(date)} • {time}</span>
            </div>
            
            <div className="flex items-center">
              <Users size={14} className="mr-1.5" />
              <span>{filledSpots}/{totalSpots} Participants</span>
            </div>
          </div>
          
          {/* Progress bar for filled spots */}
          <div className="mb-3">
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
                getButtonStyle()
              )}
            >
              {getButtonText()}
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
