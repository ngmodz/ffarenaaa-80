import React from "react";
import { Separator } from "@/components/ui/separator";
import { ProfileEditFormProps } from "./types";
import { useProfileForm } from "./useProfileForm";
import ProfileAvatar from "./ProfileAvatar";
import BasicInfoSection from "./BasicInfoSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import FormActions from "./FormActions";

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onClose }) => {
  const {
    formData,
    errors,
    loading,
    userLoading,
    handleInputChange,
    handleSelectChange,
    handleSubmit
  } = useProfileForm(onClose);

  // Show a loading state while user data is being fetched
  if (userLoading && !formData.ign) {
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
      {/* Profile Avatar */}
      <ProfileAvatar formData={formData} />
      
      <Separator className="bg-gray-800" />
      
      {/* Basic Information Section */}
      <BasicInfoSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />
      
      <Separator className="my-6 bg-gaming-border" />
      
      {/* Additional Information Section */}
      <AdditionalInfoSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
      />
      
      {/* Form Actions */}
      <FormActions 
        loading={loading}
        userLoading={userLoading}
        onClose={onClose}
      />
    </form>
  );
};

export default ProfileEditForm; 