
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Edit } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ign: "ElitePlayer123",
    email: "player@example.com",
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  // Mock user data - would come from Supabase in the future
  const user = {
    ign: formData.ign,
    email: formData.email,
    avatar_url: avatar,
    isPremium: true,
  };

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
            <div className="mt-6 flex justify-end">
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

        {/* Placeholder for Future Sections */}
        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="text-xl">Tournament Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0AEC0]">
              Tournament activity section coming soon...
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="text-xl">Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0AEC0]">
              Wallet section coming soon...
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1F2937] border-gaming-border">
          <CardHeader>
            <CardTitle className="text-xl">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A0AEC0]">
              Achievements section coming soon...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
