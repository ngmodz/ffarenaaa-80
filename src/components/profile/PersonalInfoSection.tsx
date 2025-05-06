import React, { useState } from "react";
import { User, Edit, CheckCircle, Mail, MapPin } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PersonalInfoSection = () => {
  const { user, loading, updateProfile, uploadUserAvatar, error, isTestMode } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [ignValue, setIgnValue] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setIgnValue(user.ign);
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // First update profile text information
      await updateProfile({ ign: ignValue });
      
      // Then upload avatar if there is one
      if (avatarFile) {
        await uploadUserAvatar(avatarFile);
      }
      
      // Reset states
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error("Failed to save profile:", err);
      // Error is already handled in the hook with toast notifications
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatarPreview(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
      
      setAvatarFile(file);
    }
  };

  if (loading && !user) {
    return (
      <Card className="bg-[#1F2937] border-gaming-border">
        <CardHeader>
          <CardTitle className="text-xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-pulse bg-gray-700 h-6 w-32 rounded mb-4"></div>
            <div className="animate-pulse bg-gray-700 h-6 w-48 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1F2937] border-gaming-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-center sm:text-left">
          Profile Information
        </CardTitle>
        <Link 
          to="/settings" 
          className="flex items-center gap-1 text-sm text-gaming-primary hover:text-gaming-primary/80 transition-colors"
        >
          <SettingsIcon size={16} />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2 mb-4 sm:mb-0">
            <Avatar 
              className={`w-24 h-24 border-2 ${
                user?.isPremium ? "border-[#FFD700]" : "border-[#A0AEC0]"
              }`}
            >
              {user?.avatar_url ? (
                <AvatarImage 
                  src={user.avatar_url} 
                  alt={user?.ign || "User avatar"} 
                />
              ) : (
                <AvatarFallback className="bg-gaming-primary/20">
                  <User size={32} />
                </AvatarFallback>
              )}
            </Avatar>
            
            {isTestMode && (
              <div className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                Test Mode
              </div>
            )}
            
            {user?.isPremium && (
              <div className="px-2 py-0.5 bg-[#FFD700]/20 text-[#FFD700] text-xs rounded-full">
                Premium
              </div>
            )}
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left">
            <div className="space-y-1">
              <Label className="text-[#A0AEC0] text-sm">
                Free Fire IGN
              </Label>
              <div className="text-[#FFD700] font-bold text-lg">{user?.ign}</div>
            </div>

            <div className="space-y-1">
              <Label className="text-[#A0AEC0] text-sm">
                Full Name
              </Label>
              <div className="text-white">{user?.fullName}</div>
            </div>

            <div className="space-y-1">
              <Label className="text-[#A0AEC0] text-sm">
                Email
              </Label>
              <div className="flex items-center text-white justify-center sm:justify-start">
                <Mail className="w-4 h-4 mr-2 text-gaming-primary/70" />
                {user?.email}
              </div>
            </div>
            
            {user?.location && (
              <div className="space-y-1">
                <Label className="text-[#A0AEC0] text-sm">
                  Location
                </Label>
                <div className="flex items-center text-white justify-center sm:justify-start">
                  <MapPin className="w-4 h-4 mr-2 text-gaming-primary/70" />
                  {user.location}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bio Section */}
        {user?.bio && (
          <>
            <Separator className="my-4 bg-gaming-border" />
            <div className="space-y-2">
              <Label className="text-[#A0AEC0] text-sm">
                Bio
              </Label>
              <div className="text-white text-sm">{user.bio}</div>
            </div>
          </>
        )}

        {/* Edit Button */}
        <div className="mt-6 flex justify-center sm:justify-end">
          <Button 
            className="bg-[#1E3A8A] hover:bg-[#2563EB] flex items-center gap-2 w-full sm:w-auto"
            onClick={() => window.location.href = "/settings"}
          >
            <Edit size={16} />
            Edit Profile
          </Button>
        </div>

        {error && (
          <div className="mt-4 text-[#EF4444] text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection; 