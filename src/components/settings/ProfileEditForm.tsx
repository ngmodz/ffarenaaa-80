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
import { validateUserData, isUIDAvailable, isIGNAvailable } from "@/lib/user-utils";
import { ProfileUpdate } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mobile-specific styling for form inputs with better contrast and touch targets
const customInputStyles = "flex-1 bg-[#1a1a1a] border-0 py-3 pr-3 text-white focus:outline-none focus:ring-0 placeholder:text-gray-500 w-full text-base";

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
  const { currentUser } = useAuth(); // Get authentication state
  
  // Form state
  const [formData, setFormData] = useState<ProfileUpdate>({
    ign: "",
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    birthdate: "",
    gender: "",
    uid: "",
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
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
        uid: user.uid || "",
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

  // Check authentication status
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to edit your profile",
        variant: "destructive",
      });
    }
  }, [currentUser, toast]);

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

  const validateForm = async () => {
    setValidating(true);
    
    try {
      // Initial validation using utility function
      const { valid, errors: validationErrors } = validateUserData(formData);
      
      if (!valid) {
        setErrors(validationErrors);
        return false;
      }
      
      // Additional validation - check if field is non-empty
      const newErrors: Record<string, string> = {};
      
      // Check required fields
      if (!formData.ign) {
        newErrors.ign = "In-game name is required";
      }
      
      if (!formData.uid) {
        newErrors.uid = "UID is required";
      }
      
      if (!formData.email) {
        newErrors.email = "Email is required";
      }
      
      // Check if UID is already in use by another user
      if (formData.uid && user?.uid !== formData.uid) {
        const isUIDFree = await isUIDAvailable(formData.uid, user?.id);
        if (!isUIDFree) {
          newErrors.uid = "This UID is already registered to another account";
        }
      }
      
      // Check if IGN is already in use by another user
      if (formData.ign && user?.ign !== formData.ign) {
        const isIGNFree = await isIGNAvailable(formData.ign, user?.id);
        if (!isIGNFree) {
          newErrors.ign = "This In-Game Name is already registered to another account";
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: "Could not validate form data. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    if (validating) return;
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("ProfileEditForm - Submitting profile update:", formData);
      console.log("ProfileEditForm - Authentication state:", { 
        authenticated: !!currentUser,
        uid: currentUser?.uid,
        profileUser: user
      });
      
      // First upload avatar if changed
      let avatarUrl: string | undefined = undefined;
      if (avatarFile) {
        console.log("ProfileEditForm - Uploading avatar file");
        avatarUrl = await uploadUserAvatar(avatarFile);
      }
      
      // Prepare updates object including avatar if changed
      const updates: ProfileUpdate = {
        ...formData
      };
      
      if (avatarUrl) {
        updates.avatar_url = avatarUrl;
      }
      
      console.log("ProfileEditForm - Calling updateProfile with:", updates);
      await updateProfile(updates);
      
      onClose();
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("ProfileEditForm - Error updating profile:", error);
      toast({
        title: "Update Failed",
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
    <form 
      onSubmit={handleSubmit} 
      className="profile-edit-form space-y-8"
    >
      {/* <style>{customStyles}</style> */}
      
      {/* Avatar Upload */}
      <div className="flex flex-col sm:flex-row gap-8 items-center pb-4">
        <div className="relative">
          <Avatar 
            className="w-24 h-24 border-2 border-[#A0AEC0] shadow-md"
          >
            {avatarPreview ? (
              <AvatarImage 
                src={avatarPreview} 
                alt="Avatar preview" 
              />
            ) : user?.avatar_url ? (
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
          <input
            type="file"
            id="avatar"
            accept="image/jpeg, image/png"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => document.getElementById("avatar")?.click()}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gaming-primary hover:bg-gaming-primary/90 focus:ring-gaming-primary/25 text-xs py-1 h-auto px-2 rounded-sm"
            variant="default"
            size="sm"
          >
            Upload
          </Button>
        </div>
        
        <div className="text-sm text-gray-400 text-center sm:text-left">
          <h3 className="text-white font-medium text-lg mb-1">Profile Picture</h3>
          <p>Upload a clear photo to help other players recognize you.</p>
          <p className="mt-1">JPEG or PNG format. Max 2MB.</p>
        </div>
      </div>

      <Separator className="bg-gray-800" />
      
      {/* Basic Info Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-white">Basic Information</h3>
        
        {/* Required Game Info */}
        <div className="space-y-4">
          <Label 
            htmlFor="ign" 
            className="text-base text-white flex items-center gap-1.5"
          >
            <User size={16} className="text-gaming-primary/70" />
            Free Fire IGN
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input
                id="ign"
                name="ign"
                placeholder="Your In-Game Name"
                value={formData.ign}
                onChange={handleInputChange}
                className={customInputStyles}
                required
              />
              {errors.ign && (
                <div className="text-red-500 text-sm mt-1">{errors.ign}</div>
              )}
              <div className="text-gray-500 text-sm mt-1">Please ensure this matches your exact In-Game Name as it appears in Free Fire for tournament verification</div>
            </div>
          </div>
        </div>

        {/* UID Field (Editable) */}
        <div className="space-y-4">
          <Label 
            htmlFor="uid" 
            className="text-base text-white flex items-center gap-1.5"
          >
            <BadgeInfo size={16} className="text-gaming-primary/70" />
            UID (Unique ID)
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input
                id="uid"
                name="uid"
                placeholder="Your Unique ID"
                value={formData.uid}
                onChange={handleInputChange}
                className={customInputStyles}
                required
              />
              {errors.uid && (
                <div className="text-red-500 text-sm mt-1">{errors.uid}</div>
              )}
              <div className="text-gray-500 text-sm mt-1">This is your unique ID for prize money distribution and in-game identification</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <Label htmlFor="fullName" className="text-sm text-gaming-muted block mb-1 font-medium">
            Full Name
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <div className="flex items-center bg-[#1a1a1a] w-full">
              <div className="px-3 py-2">
                <User className="h-5 w-5 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={customInputStyles}
                placeholder="Your full name"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="email" className="text-sm text-gaming-muted block mb-1 font-medium">
            Email Address
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <div className="flex items-center bg-[#1a1a1a] w-full">
              <div className="px-3 py-2">
                <Mail className="h-5 w-5 text-gaming-primary" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={customInputStyles}
                placeholder="Your email address"
                autoComplete="off"
              />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="phone" className="text-sm text-gaming-muted block mb-1 font-medium">
            Phone Number
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <div className="flex items-center bg-[#1a1a1a] w-full">
              <div className="px-3 py-2">
                <Phone className="h-5 w-5 text-gaming-primary" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={customInputStyles}
                placeholder="Your phone number"
                autoComplete="off"
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
          <Label htmlFor="location" className="text-sm text-gaming-muted block mb-1 font-medium">
            Location
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <div className="flex items-center bg-[#1a1a1a] w-full">
              <div className="px-3 py-2">
                <MapPin className="h-5 w-5 text-gaming-primary" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={customInputStyles}
                placeholder="Your location"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate" className="text-sm text-gaming-muted block mb-1 font-medium">
            Date of Birth
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <div className="flex items-center bg-[#1a1a1a] w-full">
              <div className="px-3 py-2">
                <Calendar className="h-5 w-5 text-gaming-primary" />
              </div>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className={customInputStyles}
                style={{ 
                  colorScheme: 'dark',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm text-gaming-muted block mb-1 font-medium">
            Gender
          </Label>
          <div className="overflow-hidden rounded-md bg-transparent border border-gaming-border shadow-sm">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => handleSelectChange(e.target.value, "gender")}
              className="w-full bg-[#1a1a1a] border-0 py-3 px-3 text-white focus:outline-none focus:ring-0 appearance-none rounded-md pr-10 text-base"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.25rem 1.25rem',
                colorScheme: 'dark'
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
      
      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 pb-6">
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
          className="bg-gaming-primary hover:bg-gaming-primary/90 py-6"
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