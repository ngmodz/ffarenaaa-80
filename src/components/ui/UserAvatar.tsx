import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export function UserAvatar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [initials, setInitials] = useState('');

  useEffect(() => {
    if (userProfile?.name) {
      const nameParts = userProfile.name.split(' ');
      if (nameParts.length > 1) {
        setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
      } else if (nameParts.length === 1) {
        setInitials(nameParts[0][0]);
      }
    } else if (currentUser?.email) {
      setInitials(currentUser.email[0].toUpperCase());
    } else {
      setInitials('U');
    }
  }, [currentUser, userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      navigate('/home');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  if (!currentUser) {
    return (
      <Button onClick={() => navigate('/auth')} variant="outline" className="border-gaming-primary/30">
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer border border-gaming-primary/30">
          <AvatarImage src={userProfile?.avatar_url || ''} />
          <AvatarFallback className="bg-gaming-primary/20 text-gaming-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gaming-card border-gaming-primary/30 text-gaming-text">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userProfile?.name || currentUser.email}</p>
            {userProfile?.ign && (
              <p className="text-xs text-gaming-text/70">IGN: {userProfile.ign}</p>
            )}
            <p className="text-xs text-gaming-text/70">{currentUser.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gaming-primary/20" />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gaming-primary/20" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 