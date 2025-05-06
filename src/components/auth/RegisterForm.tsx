import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const RegisterForm = ({ setActiveTab }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerFFID, setRegisterFFID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    ffid: "" 
  });
  
  const validateRegisterForm = () => {
    const errors = { name: "", email: "", password: "", ffid: "" };
    let isValid = true;
    
    if (!registerName) {
      errors.name = "Name is required";
      isValid = false;
    }
    
    if (!registerEmail) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    
    if (!registerPassword) {
      errors.password = "Password is required";
      isValid = false;
    } else if (registerPassword.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }
    
    if (!registerFFID) {
      errors.ffid = "Free Fire ID is required";
      isValid = false;
    }
    
    setRegisterErrors(errors);
    return isValid;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now login.",
      });
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab("login");
      }, 1000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gaming-text/80 flex items-center gap-2">
          <User size={16} className="text-gaming-primary" />
          Full Name
        </label>
        <Input
          type="text"
          placeholder="John Doe"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          className={cn(
            "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text focus:border-gaming-primary focus:ring-gaming-primary",
            registerErrors.name && "border-red-500"
          )}
        />
        {registerErrors.name && (
          <p className="text-xs text-red-500">{registerErrors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gaming-text/80 flex items-center gap-2">
          <Mail size={16} className="text-gaming-primary" />
          Email
        </label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          className={cn(
            "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text focus:border-gaming-primary focus:ring-gaming-primary",
            registerErrors.email && "border-red-500"
          )}
        />
        {registerErrors.email && (
          <p className="text-xs text-red-500">{registerErrors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gaming-text/80 flex items-center gap-2">
          <Trophy size={16} className="text-gaming-accent" />
          Free Fire ID
        </label>
        <Input
          type="text"
          placeholder="Your Free Fire ID"
          value={registerFFID}
          onChange={(e) => setRegisterFFID(e.target.value)}
          className={cn(
            "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text focus:border-gaming-primary focus:ring-gaming-primary",
            registerErrors.ffid && "border-red-500"
          )}
        />
        {registerErrors.ffid && (
          <p className="text-xs text-red-500">{registerErrors.ffid}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gaming-text/80 flex items-center gap-2">
          <Lock size={16} className="text-gaming-primary" />
          Password
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            className={cn(
              "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text pr-10 focus:border-gaming-primary focus:ring-gaming-primary",
              registerErrors.password && "border-red-500"
            )}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-text/50 hover:text-gaming-primary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {registerErrors.password && (
          <p className="text-xs text-red-500">{registerErrors.password}</p>
        )}
      </div>
      
      <div className="flex items-start space-x-2 my-2">
        <div className="bg-gaming-primary/20 p-1 rounded-md mt-0.5">
          <Check size={14} className="text-gaming-primary" />
        </div>
        <span className="text-xs text-gaming-text/70">
          By registering, you agree to our{" "}
          <Link 
            to="/terms-and-privacy"
            className="text-gaming-primary hover:underline"
          >
            Terms of Service and Privacy Policy
          </Link>
        </span>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gaming-primary hover:bg-gaming-primary/90 text-white font-medium shadow-glow hover:shadow-none transition-all duration-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
