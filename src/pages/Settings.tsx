
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AccountSettings from "@/components/settings/AccountSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <Link to="/profile" className="flex items-center gap-1 text-sm text-gaming-primary hover:text-gaming-primary/80 transition-colors">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Profile</span>
          </Link>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 bg-gaming-card mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <User size={16} />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-gaming-primary/20">
              <Lock size={16} />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 animate-in fade-in-50">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 animate-in fade-in-50">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
