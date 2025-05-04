
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SettingsIcon, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AccountSettings = () => {
  const { toast } = useToast();
  const [accountForm, setAccountForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const validateForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
    
    // Validate current password
    if (!accountForm.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }
    
    // Validate new password
    if (!accountForm.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (accountForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }
    
    // Validate confirm password
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountForm({
      ...accountForm,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user types
    if (formErrors[e.target.name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ""
      });
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Success case - in future would connect to Supabase
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
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
              className={`bg-gaming-card border-gaming-border text-white ${formErrors.currentPassword ? "border-red-500" : ""}`}
              placeholder="Enter your current password"
            />
            {formErrors.currentPassword && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.currentPassword}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-[#A0AEC0]">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={accountForm.newPassword}
              onChange={handleAccountFormChange}
              className={`bg-gaming-card border-gaming-border text-white ${formErrors.newPassword ? "border-red-500" : ""}`}
              placeholder="Enter your new password"
            />
            {formErrors.newPassword && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.newPassword}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#A0AEC0]">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={accountForm.confirmPassword}
              onChange={handleAccountFormChange}
              className={`bg-gaming-card border-gaming-border text-white ${formErrors.confirmPassword ? "border-red-500" : ""}`}
              placeholder="Confirm your new password"
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="bg-[#22C55E] hover:bg-[#22C55E]/90 w-full sm:w-auto"
          >
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
