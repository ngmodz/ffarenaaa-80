import { useState } from "react";
import { Search, Filter, Trophy, SortAsc, SortDesc, Calendar, DollarSign, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import TournamentCard from "@/components/TournamentCard";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample tournament data
const sampleTournaments = [{
  id: "t1",
  title: "Free Fire Squad Showdown",
  mode: "Squad",
  entryFee: 49,
  prizeMoney: 10000,
  date: "May 5, 2025",
  time: "6:00 PM",
  totalSpots: 48,
  filledSpots: 32,
  status: 'active' as const,
  isPremium: false
}, {
  id: "t2",
  title: "Elite Solo Cup",
  mode: "Solo",
  entryFee: 99,
  prizeMoney: 20000,
  date: "May 4, 2025",
  time: "8:00 PM",
  totalSpots: 96,
  filledSpots: 96,
  status: 'ongoing' as const,
  isPremium: true
}, {
  id: "t3",
  title: "Booyah Duo Challenge",
  mode: "Duo",
  entryFee: 75,
  prizeMoney: 15000,
  date: "May 3, 2025",
  time: "7:00 PM",
  totalSpots: 50,
  filledSpots: 42,
  status: 'completed' as const,
  isPremium: false
}, {
  id: "t4",
  title: "Pro League Qualifiers",
  mode: "Squad",
  entryFee: 149,
  prizeMoney: 30000,
  date: "May 6, 2025",
  time: "9:00 PM",
  totalSpots: 100,
  filledSpots: 67,
  status: 'active' as const,
  isPremium: true
}];

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  
  // Apply filters and sorting
  let displayedTournaments = filter === "all" ? sampleTournaments : sampleTournaments.filter(tournament => {
    if (filter === "active") return tournament.status === 'active';
    if (filter === "ongoing") return tournament.status === 'ongoing';
    if (filter === "completed") return tournament.status === 'completed';
    return true;
  });
  
  // Apply sorting
  if (sortBy !== "none") {
    displayedTournaments = [...displayedTournaments].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price-asc":
          return a.entryFee - b.entryFee;
        case "price-desc":
          return b.entryFee - a.entryFee;
        case "prize-asc":
          return a.prizeMoney - b.prizeMoney;
        case "prize-desc":
          return b.prizeMoney - a.prizeMoney;
        default:
          return 0;
      }
    });
  }
  
  // Find a featured tournament (preference for ongoing premium tournaments)
  const featuredTournament = sampleTournaments.find(t => t.isPremium && t.status === 'ongoing') || 
    sampleTournaments.find(t => t.isPremium) || 
    sampleTournaments.find(t => t.status === 'ongoing') || 
    sampleTournaments[0];
  
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
  
  return <div className="w-full px-4 sm:px-6 md:px-8">
      {/* Header - Centered on mobile */}
      <div className="mb-4 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
        <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-white mx-0 my-[11px]">
          <span className="text-gaming-primary">Freefire</span> Tournaments
        </h1>
        <p className="text-[#A0A0A0] text-sm">Join competitive tournaments and win real rewards</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" size={18} />
          <input type="text" placeholder="Search tournaments..." className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#333333] rounded-lg text-white placeholder-[#A0A0A0]/70 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${filter === "all" ? "bg-gaming-primary text-white" : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-gaming-primary/20"}`}>
            All Tournaments
          </button>
          <button onClick={() => setFilter("active")} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${filter === "active" ? "bg-gaming-primary text-white" : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-gaming-primary/20"}`}>
            Upcoming
          </button>
          
          {/* Sort & Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 bg-[#1A1A1A] text-[#A0A0A0] hover:bg-gaming-primary/20 flex items-center">
              <Filter size={14} className="mr-1" /> Sort & Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A1A] border-[#333333] text-white">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#333333]" />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="none" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  Default
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-asc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <Calendar size={14} className="mr-2" /> Date (Earliest first)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="date-desc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <Calendar size={14} className="mr-2" /> Date (Latest first)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-asc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <span className="mr-2 font-bold text-sm">₹</span> Entry Fee (Low to High)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <span className="mr-2 font-bold text-sm">₹</span> Entry Fee (High to Low)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="prize-asc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <Trophy size={14} className="mr-2" /> Prize Money (Low to High)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="prize-desc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <Trophy size={14} className="mr-2" /> Prize Money (High to Low)
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Featured Tournament */}
      {filter !== "completed" && featuredTournament && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Featured Tournament</h2>
          </div>
          
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#1F2133] border border-[#333333] rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Tournament Details */}
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                  {featuredTournament.isPremium && (
                    <div className="bg-gaming-accent/20 text-gaming-accent text-xs font-bold px-2 py-0.5 sm:py-1 rounded-md">
                      PREMIUM
                    </div>
                  )}
                  <div className={`text-white text-xs px-2 py-0.5 sm:py-1 rounded-md flex items-center ${
                    getStatusColor(featuredTournament.status)
                  }`}>
                    {featuredTournament.status === 'ongoing' && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                    )}
                    {getStatusText(featuredTournament.status)}
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{featuredTournament.title}</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                  <div className="flex items-center text-white">
                    <Trophy size={16} className="mr-1.5 text-gaming-accent" />
                    <span className="font-bold text-gaming-accent">₹{featuredTournament.prizeMoney}</span>
                  </div>
                  
                  <div className="flex items-center text-white">
                    <span className="font-medium text-[#A0A0A0]">Entry: </span>
                    <span className="ml-1 font-bold text-[#D0D0D0]">₹{featuredTournament.entryFee}</span>
                  </div>
                  
                  <div className="flex items-center text-[#E0E0E0]">
                    <Calendar size={16} className="mr-1.5 text-[#C0C0C0]" />
                    <span>{featuredTournament.date}</span>
                  </div>
                  
                  <div className="flex items-center text-[#E0E0E0]">
                    <span className="font-medium text-[#A0A0A0]">Mode: </span>
                    <span className="ml-1">{featuredTournament.mode}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-[#A0A0A0] text-xs mb-3">
                  <span className="font-medium">Participants: </span>
                  <span className="ml-1">{featuredTournament.filledSpots}/{featuredTournament.totalSpots}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="sm:flex sm:items-end">
                <Link 
                  to={`/tournaments/${featuredTournament.id}`}
                  className={cn(
                    "inline-block px-4 py-2 sm:px-5 sm:py-2.5 rounded-md text-white font-bold text-sm sm:text-base",
                    featuredTournament.status === 'ongoing' 
                      ? 'bg-gaming-accent hover:bg-gaming-accent/90' 
                      : featuredTournament.status === 'active'
                        ? 'bg-gaming-primary hover:bg-gaming-primary/90'
                        : 'bg-[#505050] hover:bg-[#606060]'
                  )}
                >
                  {featuredTournament.status === 'ongoing' 
                    ? 'Watch Live' 
                    : featuredTournament.status === 'active' 
                      ? 'Join Tournament' 
                      : 'View Results'
                  }
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tournament List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            {filter === "all" ? "All Tournaments" : filter === "active" ? "Upcoming Tournaments" : "Filtered Tournaments"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTournaments.map(tournament => (
            <TournamentCard 
              key={tournament.id} 
              {...tournament} 
            />
          ))}
          
          {displayedTournaments.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-5 sm:p-8 text-center">
              <Trophy size={40} className="text-[#A0A0A0] mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No tournaments found</h3>
              <p className="text-[#A0A0A0] mb-4">There are no tournaments matching your filters</p>
              <button 
                onClick={() => setFilter("all")} 
                className="px-4 py-2 bg-gaming-primary hover:bg-gaming-primary/90 text-white font-bold rounded-md"
              >
                View All Tournaments
              </button>
            </div>
          )}
        </div>
      </div>
    </div>;
};

export default Index;
