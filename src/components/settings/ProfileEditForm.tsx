import React, { useState, useEffect } from "react";
import { 
  User, 
  CheckCircle,
  Mail,
  Phone,
  MapPin, 
  Calendar,
  BadgeInfo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import dark input styles
// import "@/components/ui/dark-input.css";

// Add custom styles for placeholder text and date inputs
// const customStyles = `
//   .profile-edit-form input,
//   .profile-edit-form textarea,
//   .profile-edit-form select,
//   .profile-edit-form [data-radix-select-trigger] {
//     color: white !important;
//     background-color: #1a1a1a !important;
//     border: 1px solid #444 !important;
//   }
//   
//   .profile-edit-form input:focus,
//   .profile-edit-form textarea:focus,
//   .profile-edit-form select:focus,
//   .profile-edit-form [data-radix-select-trigger]:focus {
//     border-color: #666 !important;
//     outline: none !important;
//     box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.4) !important;
//   }
//   
//   .profile-edit-form ::placeholder {
//     color: rgba(255, 255, 255, 0.5) !important;
//   }
//   
//   .profile-edit-form input[type="date"] {
//     color-scheme: dark;
//   }
//   
//   .profile-edit-form input[type="date"]::-webkit-calendar-picker-indicator {
//     filter: invert(1);
//   }
//   
//   .select-value {
//     color: white !important;
//   }
//   
//   .profile-edit-form [data-radix-select-content] {
//     background-color: #1a1a1a !important;
//     color: white !important;
//     border-color: #444 !important;
//   }
//   
//   .profile-edit-form [data-radix-select-item] {
//     color: white !important;
//   }
//   
//   .profile-edit-form [data-radix-select-item]:hover {
//     background-color: rgba(99, 102, 241, 0.4) !important;
//   }
// `;

// In a real app, we would use Zod for validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^\+?[0-9]{10,15}$/.test(phone);

interface ProfileEditFormProps {
  onClose: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { user, loading: userLoading, updateProfile, uploadUserAvatar, error: userError } = useUserProfile();
  
  // Form state
  const [formData, setFormData] = useState({
    ign: "",
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    birthdate: "",
    gender: "",
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        ign: user.ign || "",
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
        birthdate: user.birthdate || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  // Show any errors from the useUserProfile hook
  useEffect(() => {
    if (userError) {
      toast({
        title: "Error",
        description: userError,
        variant: "destructive",
      });
    }
  }, [userError, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate IGN (required, alphanumeric, 3-20 characters)
    if (!formData.ign) {
      newErrors.ign = "In-game name is required";
    } else if (!/^[a-zA-Z0-9]{3,20}$/.test(formData.ign)) {
      newErrors.ign = "IGN must be alphanumeric and between 3-20 characters";
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate phone (optional)
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    // Validate bio (optional, max 200 chars)
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = "Bio must be less than 200 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // First update profile data
      await updateProfile(formData);
      
      // Then upload avatar if there is one
      if (avatarFile) {
        await uploadUserAvatar(avatarFile);
      }
      
      // Reset avatar state
      setAvatarFile(null);
      setAvatarPreview(null);
      
      onClose();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show a loading state while user data is being fetched
  if (userLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-pulse bg-gray-700 h-6 w-32 rounded mb-4"></div>
        <div className="animate-pulse bg-gray-700 h-6 w-48 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 profile-edit-form">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <Avatar className="w-24 h-24 border-2 border-gaming-primary">
          {(avatarPreview || user?.avatar_url) ? (
            <AvatarImage 
              src={avatarPreview || user?.avatar_url || ""} 
              alt="User avatar" 
            />
          ) : (
            <AvatarFallback className="bg-gaming-primary/20">
              <User size={32} />
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex flex-col items-center mt-4 w-full max-w-xs">
          <Label 
            htmlFor="avatar-upload" 
            className="cursor-pointer btn-gaming-primary w-full text-center py-1 px-3 rounded-md bg-gaming-primary hover:bg-gaming-primary/90 transition-colors"
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
          {avatarFile && (
            <div className="text-green-500 text-xs mt-1 flex items-center">
              <CheckCircle size={12} className="mr-1" />
              New avatar selected
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-6 bg-gaming-border" />
      
      {/* Game Profile */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Game Profile</h3>
        
        <div className="space-y-2">
          <Label htmlFor="ign" className="text-sm text-gaming-muted">
            In-Game Name (IGN)
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <BadgeInfo className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="ign"
                name="ign"
                value={formData.ign}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500"
                placeholder="Your in-game name"
              />
            </div>
          </div>
          {errors.ign && <p className="text-red-500 text-xs mt-1">{errors.ign}</p>}
        </div>
      </div>
      
      <Separator className="my-6 bg-gaming-border" />
      
      {/* Personal Information */}
      <div className="space-y-4 mt-32">
        <h3 className="text-lg font-medium text-white">Personal Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm text-gaming-muted">
            Full Name
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <User className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500"
                placeholder="Your full name"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-gaming-muted">
            Email Address
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <Mail className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500"
                placeholder="Your email address"
              />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm text-gaming-muted">
            Phone Number
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <Phone className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500"
                placeholder="Your phone number"
              />
            </div>
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      
      <Separator className="my-6 bg-gaming-border" />
      
      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Additional Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm text-gaming-muted">
            Location
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <MapPin className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500"
                placeholder="Your location"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate" className="text-sm text-gaming-muted">
            Date of Birth
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="flex items-center bg-[#1a1a1a]">
              <div className="px-3 py-2">
                <Calendar className="h-4 w-4 text-gaming-primary" />
              </div>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className="flex-1 bg-[#1a1a1a] border-0 py-2 pr-3 text-white focus:outline-none focus:ring-0 dark:color-scheme-dark"
                // Note: Placeholder styling for date might not work consistently, relying on browser default dark mode
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm text-gaming-muted">
            Gender
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border">
            <div className="bg-[#1a1a1a]">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleSelectChange(e.target.value, "gender")}
                className="w-full bg-[#1a1a1a] border-0 py-2.5 px-3 text-white focus:outline-none focus:ring-0 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25rem 1.25rem',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" disabled>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="border-gaming-border text-gaming-muted hover:bg-gaming-card"
          disabled={loading || userLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gaming-primary hover:bg-gaming-primary/90"
          disabled={loading || userLoading}
        >
          {loading || userLoading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></span>
              <span>Saving...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm; 