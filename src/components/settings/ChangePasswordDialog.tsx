import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, Check, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordDialogProps {
  trigger?: React.ReactNode;
}

const ChangePasswordDialog = ({ trigger }: ChangePasswordDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation regex patterns
  const hasLowerCase = /[a-z]/;
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validate current password
    if (!form.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    // Validate new password
    if (!form.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (form.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    } else if (!hasLowerCase.test(form.newPassword)) {
      errors.newPassword = "Password must include a lowercase letter";
      isValid = false;
    } else if (!hasUpperCase.test(form.newPassword)) {
      errors.newPassword = "Password must include an uppercase letter";
      isValid = false;
    } else if (!hasNumber.test(form.newPassword)) {
      errors.newPassword = "Password must include a number";
      isValid = false;
    } else if (!hasSpecialChar.test(form.newPassword)) {
      errors.newPassword = "Password must include a special character";
      isValid = false;
    } else if (form.currentPassword === form.newPassword) {
      errors.newPassword = "New password must be different from current password";
      isValid = false;
    }

    // Validate confirm password
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - will be replaced with Firebase auth later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Password updated!",
        description: "Your password has been successfully changed.",
      });

      // Reset form and close dialog
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all fields are filled and valid
  const isFormValid = 
    form.currentPassword.trim() !== "" && 
    form.newPassword.trim() !== "" && 
    form.confirmPassword.trim() !== "" && 
    !formErrors.currentPassword && 
    !formErrors.newPassword && 
    !formErrors.confirmPassword;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white">
            <Lock size={16} />
            Change Password
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#1F2937] border-none text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Lock size={18} className="text-[#22C55E]" />
            Change Password
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-[#A0AEC0]">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPassword.currentPassword ? "text" : "password"}
                value={form.currentPassword}
                onChange={handleChange}
                className={`bg-[#101010] border-[#2D3748] text-white pr-10 ${
                  formErrors.currentPassword ? "border-[#EF4444] focus-visible:ring-[#EF4444]" : "focus-visible:ring-[#1E3A8A]"
                }`}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-[#A0AEC0] hover:text-white"
                onClick={() => togglePasswordVisibility("currentPassword")}
              >
                {showPassword.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.currentPassword && (
              <p className="text-[#EF4444] text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-[#A0AEC0]">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword.newPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                className={`bg-[#101010] border-[#2D3748] text-white pr-10 ${
                  formErrors.newPassword ? "border-[#EF4444] focus-visible:ring-[#EF4444]" : "focus-visible:ring-[#1E3A8A]"
                }`}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-[#A0AEC0] hover:text-white"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.newPassword && (
              <p className="text-[#EF4444] text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.newPassword}
              </p>
            )}
            {!formErrors.newPassword && form.newPassword && (
              <p className="text-[#22C55E] text-xs flex items-center gap-1 mt-1">
                <Check size={12} />
                Password meets requirements
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#A0AEC0]">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className={`bg-[#101010] border-[#2D3748] text-white pr-10 ${
                  formErrors.confirmPassword ? "border-[#EF4444] focus-visible:ring-[#EF4444]" : "focus-visible:ring-[#1E3A8A]"
                }`}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-[#A0AEC0] hover:text-white"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-[#EF4444] text-xs flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {formErrors.confirmPassword}
              </p>
            )}
            {!formErrors.confirmPassword && form.confirmPassword && form.confirmPassword === form.newPassword && (
              <p className="text-[#22C55E] text-xs flex items-center gap-1 mt-1">
                <Check size={12} />
                Passwords match
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-[#2D3748] text-[#A0AEC0] hover:bg-[#2D3748] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog; 