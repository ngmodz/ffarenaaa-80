import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { validateUserData, isUIDAvailable, isIGNAvailable } from "@/lib/user-utils";
import { ProfileUpdate } from "@/lib/types";
import { FormErrors, ProfileFormData } from "./types";

export const useProfileForm = (onClose: () => void) => {
  const { toast } = useToast();
  const { user, loading: userLoading, updateProfile, error: userError } = useUserProfile();
  const { currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
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
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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
    
    const formValid = await validateForm();
    if (!formValid) {
      console.error("Form validation failed");
      return;
    }
    
    try {
      setLoading(true);
      toast({
        title: "Updating Profile",
        description: "Please wait while we update your profile...",
      });
      
      // Prepare updates object
      const updates: ProfileUpdate = {
        ...formData
      };
      
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

  return {
    formData,
    errors,
    loading,
    userLoading,
    validating,
    handleInputChange,
    handleSelectChange,
    handleSubmit
  };
}; 