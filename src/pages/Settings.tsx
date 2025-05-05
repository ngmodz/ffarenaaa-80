import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  ArrowLeft, 
  Settings as SettingsIcon,
  Edit,
  Trophy,
  Lock,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import SettingsItem from "@/components/settings/SettingsItem";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ContactDeveloperForm from "@/components/settings/ContactDeveloperForm";
import ProfileEditForm from "@/components/settings/ProfileEditForm";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  // Mock user data - would come from Supabase in the future
  const user = {
    name: "ElitePlayer123",
    email: "player@example.com",
    avatar_url: null,
    isPremium: true,
    joinDate: "May 2023",
  };

  const handleLogout = () => {
    // Show a success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    
    // Redirect to login page
    navigate("/auth");
  };

  const handleOpenSheet = (id: string) => {
    setOpenSheet(id);
  };

  const handleCloseSheet = () => {
    setOpenSheet(null);
  };

  const settingsOptions = [
    {
      id: "profile",
      icon: <Edit size={20} className="text-gaming-primary" />,
      title: "Edit Profile",
      description: "Update your personal information",
      onClick: () => handleOpenSheet("profile"),
    },
    {
      id: "tournaments",
      icon: <Trophy size={20} className="text-gaming-accent" />,
      title: "My Tournaments",
      description: "Tournaments you've joined or hosted",
      onClick: () => navigate("/profile"),
    },
    {
      id: "password",
      icon: <Lock size={20} className="text-[#ec4899]" />,
      title: "Change Password",
      description: "Update your password",
      onClick: () => handleOpenSheet("password"),
    },
    {
      id: "contact",
      icon: <MessageSquare size={20} className="text-[#8b5cf6]" />,
      title: "Contact Developer",
      description: "Help & support",
      onClick: () => handleOpenSheet("contact"),
    },
  ];

  return (
    <div className="container-padding py-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <Link to="/" className="flex items-center gap-1 text-sm text-gaming-primary hover:text-gaming-primary/80 transition-colors">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
        
        {/* Profile Card */}
        <Card className="p-4 bg-gaming-card border-gaming-border shadow-glow">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gaming-primary shadow-glow">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gaming-primary/20 text-gaming-primary text-xl font-semibold">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                {user.isPremium && (
                  <span className="ml-2 bg-[#FFD700]/20 text-[#FFD700] text-xs px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-gaming-muted">{user.email}</p>
              <p className="text-xs text-gaming-muted mt-1">Member since {user.joinDate}</p>
            </div>
          </div>
        </Card>

        {/* Settings Options List */}
        <Card className="divide-y divide-gaming-border bg-gaming-card border-gaming-border shadow-glow">
          {settingsOptions.map((option) => (
            <SettingsItem
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              onClick={option.onClick}
            />
          ))}
          
          <button 
            className="w-full flex items-center gap-4 p-4 text-left hover:bg-gaming-bg/50 transition-colors"
            onClick={handleLogout}
          >
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
              <LogOut size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Logout</h3>
              <p className="text-sm text-gaming-muted">Sign out of your account</p>
            </div>
          </button>
        </Card>
      </motion.div>

      {/* Sheet for Profile */}
      <Sheet open={openSheet === "profile"} onOpenChange={handleCloseSheet}>
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gaming-bg border-gaming-border">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <p className="text-sm text-gaming-muted">Update your personal information</p>
            </div>
            
            <div className="flex-1 overflow-auto">
              <ProfileEditForm onClose={handleCloseSheet} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet for Password */}
      <Sheet open={openSheet === "password"} onOpenChange={handleCloseSheet}>
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gaming-bg border-gaming-border">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <p className="text-sm text-gaming-muted">Update your account password</p>
            </div>
            
            <div className="flex-1 overflow-auto">
              {/* We'll reuse the existing AccountSettings component */}
              <iframe 
                src="/settings?tab=account" 
                className="w-full h-full border-0"
                style={{ display: "none" }}
              />
              {/* For now we'll show a placeholder message */}
              <div className="text-center py-8">
                <p className="text-gaming-muted">Change your password here</p>
                <Button 
                  className="mt-4 bg-gaming-primary hover:bg-gaming-primary/90"
                  onClick={handleCloseSheet}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet for Contact Developer */}
      <Sheet open={openSheet === "contact"} onOpenChange={handleCloseSheet}>
        <SheetContent side={isMobile ? "bottom" : "right"} className="bg-gaming-bg border-gaming-border">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Contact Developer</h2>
              <p className="text-sm text-gaming-muted">Questions, feedback, or bug reports</p>
            </div>
            
            <div className="flex-1 overflow-auto">
              <ContactDeveloperForm onClose={handleCloseSheet} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Settings;
