
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Lock, GameController, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [accountForm, setAccountForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    tournamentInvites: true,
    tournamentUpdates: true,
    prizeAlerts: true,
    marketingEmails: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    publicProfile: true,
    showStats: true
  });
  
  const [gameSettings, setGameSettings] = useState({
    gamerId: "ElitePlayer123",
    gameServer: "Asia"
  });
  
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value
    });
  };
  
  const handleGameSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameSettings({
      ...gameSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    // Success case - in future would connect to Supabase
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully"
    });
    
    // Reset form
    setAccountForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
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
  
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings]
    });
    
    // Success notification
    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved"
    });
  };
  
  const handlePrivacyToggle = (setting: string) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting as keyof typeof privacySettings]
    });
    
    // Success notification
    toast({
      title: "Settings updated",
      description: "Your privacy settings have been saved"
    });
  };
  
  return (
    <div className="container-padding py-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        
        {/* Account Settings */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon size={20} className="text-gaming-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-[#A0AEC0]">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={accountForm.currentPassword}
                  onChange={handleAccountFormChange}
                  className="bg-gaming-card border-gaming-border text-white"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[#A0AEC0]">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={accountForm.newPassword}
                  onChange={handleAccountFormChange}
                  className="bg-gaming-card border-gaming-border text-white"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#A0AEC0]">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={handleAccountFormChange}
                  className="bg-gaming-card border-gaming-border text-white"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <Button type="submit" className="bg-[#22C55E] hover:bg-[#22C55E]/90">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Notification Settings */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} className="text-gaming-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Tournament Invites</h3>
                  <p className="text-xs text-[#A0AEC0]">Get notified when you're invited to tournaments</p>
                </div>
                <Switch 
                  checked={notificationSettings.tournamentInvites}
                  onCheckedChange={() => handleNotificationToggle('tournamentInvites')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Tournament Updates</h3>
                  <p className="text-xs text-[#A0AEC0]">Receive updates about tournaments you've joined</p>
                </div>
                <Switch 
                  checked={notificationSettings.tournamentUpdates}
                  onCheckedChange={() => handleNotificationToggle('tournamentUpdates')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Prize Alerts</h3>
                  <p className="text-xs text-[#A0AEC0]">Get notified when you win prizes</p>
                </div>
                <Switch 
                  checked={notificationSettings.prizeAlerts}
                  onCheckedChange={() => handleNotificationToggle('prizeAlerts')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Marketing Emails</h3>
                  <p className="text-xs text-[#A0AEC0]">Receive promotional offers and news</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy Settings */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-gaming-primary" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Show Online Status</h3>
                  <p className="text-xs text-[#A0AEC0]">Allow others to see when you're online</p>
                </div>
                <Switch 
                  checked={privacySettings.showOnlineStatus}
                  onCheckedChange={() => handlePrivacyToggle('showOnlineStatus')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Public Profile</h3>
                  <p className="text-xs text-[#A0AEC0]">Make your profile visible to everyone</p>
                </div>
                <Switch 
                  checked={privacySettings.publicProfile}
                  onCheckedChange={() => handlePrivacyToggle('publicProfile')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Show Game Statistics</h3>
                  <p className="text-xs text-[#A0AEC0]">Display your game stats on your profile</p>
                </div>
                <Switch 
                  checked={privacySettings.showStats}
                  onCheckedChange={() => handlePrivacyToggle('showStats')}
                  className="data-[state=checked]:bg-gaming-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Game Connection Settings */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GameController size={20} className="text-gaming-primary" />
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
      </motion.div>
    </div>
  );
};

export default Settings;
