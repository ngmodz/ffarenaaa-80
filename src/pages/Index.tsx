import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import TournamentFilters from "@/components/home/TournamentFilters";
import FeaturedTournament from "@/components/home/FeaturedTournament";
import TournamentList from "@/components/home/TournamentList";
import { TournamentType } from "@/components/home/types";

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
      <TournamentFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      
      {/* Featured Tournament */}
      {filter !== "completed" && featuredTournament && (
        <FeaturedTournament tournament={featuredTournament} />
      )}
      
      {/* Tournament List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">All Tournaments</h2>
          <Link to="/tournaments/archive" className="text-xs text-gaming-primary hover:text-gaming-primary/90">
            View Archive
          </Link>
        </div>
        
        <TournamentList tournaments={displayedTournaments} />
      </div>
  </div>;
};

export default Index;
