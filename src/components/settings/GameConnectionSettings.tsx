
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GameConnectionSettings = () => {
  const { toast } = useToast();
  const [gameSettings, setGameSettings] = useState({
    gamerId: "ElitePlayer123",
    gameServer: "Asia"
  });
  
  const handleGameSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSettings({
      ...gameSettings,
      [e.target.name]: e.target.value
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
            <Label htmlFor="gamerId" className="text-[#A0AEC0]">Free Fire ID</Label>
            <Input
              id="gamerId"
              name="gamerId"
              value={gameSettings.gamerId}
              onChange={handleGameSettingsChange}
              className="bg-gaming-card border-gaming-border text-white"
              placeholder="Enter your Free Fire ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gameServer" className="text-[#A0AEC0]">Game Server</Label>
            <Input
              id="gameServer"
              name="gameServer"
              value={gameSettings.gameServer}
              onChange={handleGameSettingsChange}
              className="bg-gaming-card border-gaming-border text-white"
              placeholder="Enter your game server"
            />
          </div>
          
          <Button type="submit" className="bg-[#22C55E] hover:bg-[#22C55E]/90">
            Save Game Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GameConnectionSettings;
