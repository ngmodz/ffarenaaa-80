
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Edit } from "lucide-react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import WalletSection from "@/components/profile/WalletSection";
import AchievementsSection from "@/components/profile/AchievementsSection";
import LogoutButton from "@/components/profile/LogoutButton";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ign: "ElitePlayer123",
    email: "player@example.com",
  });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Mock user data - would come from Supabase in the future
  const user = {
    ign: formData.ign,
    email: formData.email,
    avatar_url: avatar,
    isPremium: true,
  };

  // Mock tournament data - would come from Supabase in the future
  const mockJoinedTournaments = [
    {
      id: "t1",
      title: "Weekend Booyah Challenge",
      date: "June 15, 2023",
      time: "6:00 PM IST",
      status: "completed",
      entryFee: 50,
      prizeMoney: 500,
      position: 2,
    },
    {
      id: "t2",
      title: "Solo Survivor Showdown",
      date: "June 20, 2023", 
      time: "7:30 PM IST",
      status: "upcoming",
      entryFee: 100,
      prizeMoney: 1000,
    },
    {
      id: "t3",
      title: "Squad Domination Cup",
      date: "June 25, 2023",
      time: "8:00 PM IST", 
      status: "upcoming",
      entryFee: 75,
      prizeMoney: 750,
    }
  ];
  
  const mockHostedTournaments = [
    {
      id: "h1",
      title: "Friday Night Firefight",
      date: "June 10, 2023",
      time: "9:00 PM IST",
      status: "completed",
      entryFee: 25,
      prizeMoney: 250,
      participants: 45,
      totalSpots: 50,
    }
  ];
  
  const mockWinnings = [
    {
      id: "w1",
      title: "Weekend Booyah Challenge",
      date: "June 15, 2023",
      prize: 200,
      position: 2
    }
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes here (would call Supabase in the future)
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Avatar must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter tournaments by status
  const filterTournaments = (tournaments: any[], filter: string | null) => {
    if (!filter) return tournaments;
    return tournaments.filter(t => t.status === filter);
  };

  // Search tournaments by title
  const searchTournaments = (tournaments: any[], query: string) => {
    if (!query.trim()) return tournaments;
    const lowercasedQuery = query.toLowerCase();
    return tournaments.filter(t => 
      t.title.toLowerCase().includes(lowercasedQuery)
    );
  };

  // Combined filter and search
  const getFilteredTournaments = (tournaments: any[]) => {
    return searchTournaments(
      filterTournaments(tournaments, activeFilter),
      searchQuery
    );
  };

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  return (
    <div className="container-padding py-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Personal Information Card */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="text-xl text-center sm:text-left">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-2">
                <Avatar className={`w-24 h-24 border-2 ${user.isPremium ? "border-[#FFD700]" : "border-[#A0AEC0]"}`}>
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={user.ign} />
                  ) : (
                    <AvatarFallback className="bg-gaming-primary/20">
                      <User size={32} />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {isEditing && (
                  <div className="flex flex-col items-center w-full">
                    <Label 
                      htmlFor="avatar-upload" 
                      className="cursor-pointer btn-gaming-primary w-full text-center py-1"
                    >
                      Upload Avatar
                    </Label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/jpeg, image/png" 
                      onChange={handleAvatarChange}
                      className="hidden" 
                    />
                  </div>
                )}
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label 
                    htmlFor="ign" 
                    className={`${isEditing ? "text-white" : "text-[#A0AEC0]"}`}
                  >
                    Free Fire IGN
                  </Label>
                  {isEditing ? (
                    <Input
                      id="ign"
                      name="ign"
                      value={formData.ign}
                      onChange={handleInputChange}
                      className="bg-gaming-card border-gaming-border text-white"
                      placeholder="Enter your In-Game Name"
                    />
                  ) : (
                    <div className="text-[#FFD700] font-bold text-lg">{user.ign}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="email" 
                    className="text-[#A0AEC0]"
                  >
                    Email
                  </Label>
                  <div className="text-white">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-6 flex justify-between">
              <LogoutButton />
              <Button 
                className={`flex items-center gap-2 ${
                  isEditing 
                    ? "bg-[#22C55E] hover:bg-[#22C55E]/90" 
                    : "bg-[#1E3A8A] hover:bg-[#2563EB]"
                }`}
                onClick={handleEditToggle}
              >
                <Edit size={16} />
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Activity Section - Now using the ProfileTabs component */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="text-xl">Tournament Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileTabs
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              handleFilterChange={handleFilterChange}
              mockJoinedTournaments={mockJoinedTournaments}
              mockHostedTournaments={mockHostedTournaments}
              mockWinnings={mockWinnings}
              getFilteredTournaments={getFilteredTournaments}
            />
          </CardContent>
        </Card>

        {/* Wallet Section - Now using the WalletSection component */}
        <WalletSection />

        {/* Achievements Section - Now using the AchievementsSection component */}
        <AchievementsSection />
      </motion.div>
    </div>
  );
};

export default Profile;
