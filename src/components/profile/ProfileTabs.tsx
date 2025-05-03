
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import TournamentActivityList from "@/components/profile/TournamentActivityList";

interface ProfileTabsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string | null;
  handleFilterChange: (filter: string | null) => void;
  mockJoinedTournaments: any[];
  mockHostedTournaments: any[];
  mockWinnings: any[];
  getFilteredTournaments: (tournaments: any[]) => any[];
}

const ProfileTabs = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  handleFilterChange,
  mockJoinedTournaments,
  mockHostedTournaments,
  mockWinnings,
  getFilteredTournaments
}: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="joined" className="w-full">
      <div className="flex flex-col gap-4">
        {/* TabsList - Modified to be full width and scrollable on mobile */}
        <TabsList className="bg-[#111827] w-full h-auto flex flex-nowrap overflow-x-auto scrollbar-none p-1">
          <TabsTrigger 
            value="joined" 
            className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white text-[#A0AEC0] whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
          >
            Joined Tournaments
          </TabsTrigger>
          <TabsTrigger 
            value="hosted" 
            className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white text-[#A0AEC0] whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
          >
            Hosted Tournaments
          </TabsTrigger>
          <TabsTrigger 
            value="winnings" 
            className="data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white text-[#A0AEC0] whitespace-nowrap flex-shrink-0 text-xs sm:text-sm"
          >
            Winnings
          </TabsTrigger>
        </TabsList>
        
        {/* Search and filter section */}
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#A0AEC0]" />
          <Input
            placeholder="Search tournaments..."
            className="pl-9 bg-[#111827] border-gaming-border text-white w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 mb-2 flex-wrap">
          <Badge 
            onClick={() => handleFilterChange('upcoming')}
            className={`cursor-pointer ${activeFilter === 'upcoming' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-[#111827] hover:bg-[#374151] text-[#A0AEC0]'}`}
          >
            Upcoming
          </Badge>
          <Badge 
            onClick={() => handleFilterChange('ongoing')}
            className={`cursor-pointer ${activeFilter === 'ongoing' 
              ? 'bg-gaming-accent hover:bg-gaming-accent/90' 
              : 'bg-[#111827] hover:bg-[#374151] text-[#A0AEC0]'}`}
          >
            Live
          </Badge>
          <Badge 
            onClick={() => handleFilterChange('completed')}
            className={`cursor-pointer ${activeFilter === 'completed' 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-[#111827] hover:bg-[#374151] text-[#A0AEC0]'}`}
          >
            Completed
          </Badge>
          {activeFilter && (
            <Badge 
              onClick={() => handleFilterChange(null)}
              variant="destructive"
              className="cursor-pointer"
            >
              Clear Filter
            </Badge>
          )}
        </div>
      </div>

      <TabsContent value="joined" className="mt-4">
        <TournamentActivityList 
          tournaments={getFilteredTournaments(mockJoinedTournaments)} 
          type="joined"
        />
      </TabsContent>
      
      <TabsContent value="hosted" className="mt-4">
        <TournamentActivityList 
          tournaments={getFilteredTournaments(mockHostedTournaments)} 
          type="hosted"
        />
      </TabsContent>
      
      <TabsContent value="winnings" className="mt-4">
        <TournamentActivityList 
          tournaments={getFilteredTournaments(mockWinnings)} 
          type="winnings"
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
