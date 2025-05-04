
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gamepad } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GameConnectionSettings = () => {
  const { toast } = useToast();
  const [gameSettings, setGameSettings] = useState({
    gamerId: "ElitePlayer123",
    gameServer: "Asia",
    gameType: "free-fire"
  });
  
  const handleGameSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSettings({
      ...gameSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleGameTypeChange = (value: string) => {
    setGameSettings({
      ...gameSettings,
      gameType: value
    });
  };

  const handleServerChange = (value: string) => {
    setGameSettings({
      ...gameSettings,
      gameServer: value
    });
  };
  
  const handleGameSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Success case - in future would connect to Supabase
    toast({
      title: "Game settings updated",
      description: "Your game settings have been updated successfully"
    });
  };
  
  return (
    <Card className="bg-[#1F2937] border-gaming-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad size={20} className="text-gaming-primary" />
          Game Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGameSettingsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gameType" className="text-[#A0AEC0]">Game Type</Label>
            <Select value={gameSettings.gameType} onValueChange={handleGameTypeChange}>
              <SelectTrigger className="bg-gaming-card border-gaming-border text-white">
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent className="bg-[#1F2937] border-gaming-border">
                <SelectItem value="free-fire">Free Fire</SelectItem>
                <SelectItem value="pubg">PUBG Mobile</SelectItem>
                <SelectItem value="cod">Call of Duty Mobile</SelectItem>
                <SelectItem value="valorant">Valorant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gamerId" className="text-[#A0AEC0]">Player ID</Label>
            <Input
              id="gamerId"
              name="gamerId"
              value={gameSettings.gamerId}
              onChange={handleGameSettingsChange}
              className="bg-gaming-card border-gaming-border text-white"
              placeholder="Enter your player ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gameServer" className="text-[#A0AEC0]">Game Server</Label>
            <Select value={gameSettings.gameServer} onValueChange={handleServerChange}>
              <SelectTrigger className="bg-gaming-card border-gaming-border text-white">
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent className="bg-[#1F2937] border-gaming-border">
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
                <SelectItem value="Oceania">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="bg-[#22C55E] hover:bg-[#22C55E]/90 w-full sm:w-auto">
            Save Game Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameConnectionSettings;
