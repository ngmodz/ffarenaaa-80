
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const SocialLoginOptions = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSocialLogin = (provider: string) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: `${provider} login initiated`,
        description: "Redirecting to authentication provider...",
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  const handleContinueAsGuest = () => {
    toast({
      title: "Welcome, Guest!",
      description: "You have limited access to features.",
    });
    
    // Navigate to home
    navigate('/');
  };

  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gaming-primary/20"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gaming-bg text-gaming-text/50">Or continue with</span>
        </div>
      </div>
      
      <div className="flex space-x-3 justify-center">
        <Button 
          onClick={() => handleSocialLogin("Google")}
          disabled={isSubmitting}
          variant="outline" 
          className="bg-gaming-bg/60 hover:bg-gaming-primary/20 text-gaming-text border border-gaming-primary/30 flex-1 flex items-center justify-center gap-2"
        >
          Google
        </Button>
        <Button 
          onClick={() => handleSocialLogin("Facebook")}
          disabled={isSubmitting}
          variant="outline"
          className="bg-gaming-bg/60 hover:bg-gaming-primary/20 text-gaming-text border border-gaming-primary/30 flex-1 flex items-center justify-center gap-2"
        >
          <Facebook size={16} />
          Facebook
        </Button>
      </div>
      
      <div>
        <Button 
          onClick={handleContinueAsGuest} 
          variant="link" 
          disabled={isSubmitting}
          className="text-gaming-primary hover:text-gaming-accent"
        >
          Continue as guest <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default SocialLoginOptions;
