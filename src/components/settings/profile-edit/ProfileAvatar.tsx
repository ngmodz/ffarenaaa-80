import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileFormData } from "./types";

interface ProfileAvatarProps {
  formData: ProfileFormData;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ formData }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-8 items-center pb-4">
      <div className="relative">
        <Avatar 
          className="w-24 h-24 border-2 border-[#A0AEC0] shadow-md"
        >
          <AvatarFallback className="bg-gaming-primary/20 text-[#FFD700] text-4xl font-bold">
            {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 
             formData.ign ? formData.ign.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="text-sm text-gray-400 text-center sm:text-left">
        <h3 className="text-white font-medium text-lg mb-1">Profile Picture</h3>
        <p>Your avatar shows the first letter of your name.</p>
        <p className="mt-1">Update your name to change this letter.</p>
      </div>
    </div>
  );
};

export default ProfileAvatar; 