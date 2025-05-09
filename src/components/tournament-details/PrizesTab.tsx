import React from "react";
import { Trophy } from "lucide-react";
import { Tournament } from "@/lib/tournamentService";

interface PrizesTabProps {
  tournament: Tournament;
}

const PrizesTab: React.FC<PrizesTabProps> = ({ tournament }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Prize Distribution</h2>
      <div className="space-y-4">
        {Object.entries(tournament.prize_distribution || {}).map(([position, percentage], index) => {
          const prizeAmount = (tournament.entry_fee * tournament.max_players * (percentage / 100)).toFixed(2);
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-md border ${
                index === 0 
                  ? "bg-yellow-500/10 border-yellow-500/30" 
                  : index === 1 
                    ? "bg-gray-400/10 border-gray-400/30" 
                    : "bg-amber-700/10 border-amber-700/30"
              }`}
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  index === 0 ? "bg-yellow-500/20" : index === 1 ? "bg-gray-400/20" : "bg-amber-700/20"
                }`}>
                  <Trophy size={20} className={
                    index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                  } />
                </div>
                <div>
                  <div className="text-sm text-gaming-muted">
                    {position} Place ({percentage}%)
                  </div>
                  <div className="font-bold text-lg">
                    ₹{prizeAmount}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {Object.keys(tournament.prize_distribution || {}).length === 0 && (
          <p className="text-gaming-muted">Prize distribution details not available.</p>
        )}
      </div>
    </div>
  );
};

export default PrizesTab; 