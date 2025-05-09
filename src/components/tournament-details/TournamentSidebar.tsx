import React from "react";
import { Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TournamentDetailsSidebarProps } from "./types";

const TournamentSidebar: React.FC<TournamentDetailsSidebarProps> = ({
  tournament,
  progressPercentage,
  spotsLeft
}) => {
  // Mock organizer data
  const mockOrganizer = {
    name: "GamersHub",
    verified: true,
    tournaments: 45
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gaming-card border-gaming-border p-4">
        <h3 className="font-semibold mb-4">Registration</h3>
        <div className="flex justify-between items-center mb-2">
          <div className="text-gaming-muted">Entry Fee</div>
          <div className="font-bold text-lg">₹{tournament.entry_fee}</div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-gaming-muted">Prize Pool (Est.)</div>
          <div className="font-bold text-lg text-gaming-accent">₹{(tournament.entry_fee * tournament.max_players * 0.8).toFixed(2)}</div>
        </div>
        <Separator className="my-4" />
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Users size={16} className="mr-1 text-gaming-muted" />
              <span className="text-gaming-muted">Participants</span>
            </div>
            <div className="font-medium">
              {tournament.filled_spots}/{tournament.max_players}
            </div>
          </div>
          <div className="w-full bg-gaming-border h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gaming-primary"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gaming-muted mt-1">
            {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Fully booked'}
          </div>
        </div>
        <Button 
          className="w-full bg-gaming-primary hover:bg-gaming-primary/90" 
          disabled={tournament.status !== 'active' || spotsLeft <= 0}
        >
          {tournament.status !== 'active' ? `Registration ${tournament.status}` : spotsLeft <= 0 ? 'Tournament Full' : 'Join Tournament'}
        </Button>
      </Card>

      <Card className="bg-gaming-card border-gaming-border p-4">
        <h3 className="font-semibold mb-3">Organized By</h3>
        <div className="flex items-center">
          <div>
            <div className="font-medium text-white">{mockOrganizer.name}</div>
            <div className="text-xs text-gaming-muted">{mockOrganizer.tournaments} tournaments hosted</div>
          </div>
          {mockOrganizer.verified && (
            <Check size={18} className="ml-auto text-gaming-primary" />
          )}
        </div>
      </Card>
    </div>
  );
};

export default TournamentSidebar;