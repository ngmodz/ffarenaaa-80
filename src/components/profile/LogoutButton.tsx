
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // In the future, this would handle Supabase logout
    
    // Show a success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    
    // Redirect to login page
    navigate("/auth");
  };
  
  return (
    <Button 
      onClick={handleLogout}
      variant="outline"
      className="border-gaming-border text-white hover:bg-[#111827]/50 w-full flex items-center justify-center gap-2"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
