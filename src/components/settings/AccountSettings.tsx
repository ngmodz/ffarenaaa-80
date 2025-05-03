
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AccountSettings = () => {
  const { toast } = useToast();
  const [accountForm, setAccountForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
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

  return (
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
  );
};

export default AccountSettings;
