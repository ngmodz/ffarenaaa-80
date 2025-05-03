
import React from "react";
import { motion } from "framer-motion";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";
import GameConnectionSettings from "@/components/settings/GameConnectionSettings";

const Settings = () => {
  return (
    <div className="container-padding py-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        
        <AccountSettings />
        <NotificationSettings />
        <PrivacySettings />
        <GameConnectionSettings />
      </motion.div>
    </div>
  );
};

export default Settings;
