
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Lock, Gamepad } from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import GameConnectionSettings from "@/components/settings/GameConnectionSettings";
import { useNavigate, useLocation } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tab from URL or default to "account"
  const getTabFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("tab") || "account";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without page refresh
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  return (
    <div className="container-padding py-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 bg-gaming-card mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <User size={16} />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <Bell size={16} />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <Lock size={16} />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <Gamepad size={16} />
              <span className="hidden md:inline">Game</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 animate-in fade-in-50">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 animate-in fade-in-50">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 animate-in fade-in-50">
            <PrivacySettings />
          </TabsContent>
          
          <TabsContent value="game" className="space-y-4 animate-in fade-in-50">
            <GameConnectionSettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
