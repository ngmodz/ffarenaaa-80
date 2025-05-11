
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarLetter } from "@/components/ui/UserAvatar";

interface AvatarDisplayProps {
  userProfile: any;
  currentUser: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * A consistent avatar display component that uses the first letter of the user's name
 */
export function AvatarDisplay({ 
  userProfile, 
  currentUser, 
  size = 'md',
  className = ''
}: AvatarDisplayProps) {
  // Determine size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  // Determine font size
  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-gaming-primary shadow-glow ${className}`}>
      <AvatarFallback className={`bg-gaming-primary/20 text-[#FFD700] ${fontSizeClasses[size]} font-bold`}>
        {getAvatarLetter(userProfile, currentUser)}
      </AvatarFallback>
    </Avatar>
  );
}

export default AvatarDisplay;
