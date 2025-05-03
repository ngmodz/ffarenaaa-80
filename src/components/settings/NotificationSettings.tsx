
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState({
    tournamentInvites: true,
    tournamentUpdates: true,
    prizeAlerts: true,
    marketingEmails: false
  });
  
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
  
  return (
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
  );
};

export default NotificationSettings;
