import { useState } from "react";
import { Search, Filter, Trophy, SortAsc, SortDesc, Calendar, DollarSign } from "lucide-react";
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

// Sample tournament data
const sampleTournaments = [{
  id: "t1",
  title: "Free Fire Squad Showdown",
  image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1000",
  entryFee: 49,
  prizeMoney: 10000,
  date: "May 5, 2025",
  time: "6:00 PM",
  totalSpots: 48,
  filledSpots: 32,
  status: 'upcoming' as const
}, {
  id: "t2",
  title: "Elite Solo Cup",
  image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000",
  entryFee: 99,
  prizeMoney: 20000,
  date: "May 4, 2025",
  time: "8:00 PM",
  totalSpots: 96,
  filledSpots: 96,
  status: 'live' as const
}, {
  id: "t3",
  title: "Booyah Duo Challenge",
  image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1000",
  entryFee: 75,
  prizeMoney: 15000,
  date: "May 3, 2025",
  time: "7:00 PM",
  totalSpots: 50,
  filledSpots: 42,
  status: 'completed' as const
}, {
  id: "t4",
  title: "Pro League Qualifiers",
  image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=1000",
  entryFee: 149,
  prizeMoney: 30000,
  date: "May 6, 2025",
  time: "9:00 PM",
  totalSpots: 100,
  filledSpots: 67,
  status: 'upcoming' as const
}];

const Index = () => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  
  // Apply filters and sorting
  let displayedTournaments = filter === "all" ? sampleTournaments : sampleTournaments.filter(tournament => tournament.status === filter);
  
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
  
  return <div className="w-full px-4 sm:px-6 md:px-8">
      {/* Header - Centered on mobile */}
      <div className="mb-4 text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gaming-text mx-0 my-[11px]">
          <span className="text-gaming-primary">Freefire</span> Tournaments
        </h1>
        <p className="text-gaming-muted text-sm">Join competitive tournaments and win real rewards</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-4">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-muted" size={18} />
          <input type="text" placeholder="Search tournaments..." className="w-full pl-10 pr-4 py-2.5 bg-gaming-card border border-gaming-border rounded-lg text-white placeholder-gaming-muted/70 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50" />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${filter === "all" ? "bg-gaming-primary text-white" : "bg-gaming-card text-gaming-muted hover:bg-gaming-primary/20"}`}>
            All Tournaments
          </button>
          <button onClick={() => setFilter("upcoming")} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${filter === "upcoming" ? "bg-gaming-primary text-white" : "bg-gaming-card text-gaming-muted hover:bg-gaming-primary/20"}`}>
            Upcoming
          </button>
          
          {/* Sort & Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 bg-gaming-card text-gaming-muted hover:bg-gaming-primary/20 flex items-center">
              <Filter size={14} className="mr-1" /> Sort & Filter
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gaming-card border-gaming-border text-gaming-text">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gaming-border/50" />
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
                  <DollarSign size={14} className="mr-2" /> Entry Fee (Low to High)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc" className="text-xs focus:bg-gaming-primary/20 focus:text-white">
                  <DollarSign size={14} className="mr-2" /> Entry Fee (High to Low)
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
      {filter !== "completed" && <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Featured Tournament</h2>
          </div>
          
          <div className="relative w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=1200" alt="Featured Tournament" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full p-3 z-20">
              <div className="flex items-center mb-1.5 sm:mb-2">
                <div className="bg-gaming-accent text-white text-xs font-bold px-2 py-0.5 sm:py-1 rounded mr-2">
                  PREMIUM
                </div>
                <div className="bg-red-500 text-white text-xs px-2 py-0.5 sm:py-1 rounded flex items-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                  LIVE
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Free Fire Championship Finals</h3>
              <div className="flex items-center text-white/80 text-xs mb-2 sm:mb-3">
                <Trophy size={14} className="mr-1 text-gaming-accent" />
                <span className="font-bold mr-3">₹50,000 Prize Pool</span>
                <span className="text-2xs sm:text-xs bg-white/20 px-2 py-0.5 rounded">256 Teams</span>
              </div>
              <button className="bg-gaming-accent hover:bg-gaming-accent/90 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all">
                Watch Live
              </button>
            </div>
          </div>
        </div>}
      
      {/* Tournament List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold">
            {filter === "all" ? "All Tournaments" : filter === "upcoming" ? "Upcoming Tournaments" : "Filtered Tournaments"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTournaments.map(tournament => <TournamentCard key={tournament.id} {...tournament} />)}
          
          {displayedTournaments.length === 0 && <div className="col-span-full flex flex-col items-center justify-center p-5 sm:p-8 text-center">
              <Trophy size={40} className="text-gaming-muted mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2">No tournaments found</h3>
              <p className="text-gaming-muted mb-4">There are no tournaments matching your filters</p>
              <button onClick={() => setFilter("all")} className="btn-gaming-primary">
                View All Tournaments
              </button>
            </div>}
        </div>
      </div>
    </div>;
};

export default Index;
