
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Eye, EyeOff, Check, ArrowRight, Mail, Lock, User, Facebook, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const Auth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerFFID, setRegisterFFID] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Form validation states
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const [registerErrors, setRegisterErrors] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    ffid: "" 
  });
  
  const validateLoginForm = () => {
    const errors = { email: "", password: "" };
    let isValid = true;
    
    if (!loginEmail) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginEmail)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    
    if (!loginPassword) {
      errors.password = "Password is required";
      isValid = false;
    }
    
    setLoginErrors(errors);
    return isValid;
  };
  
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
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      toast({
        title: "Login successful",
        description: "Welcome back to FireArena!",
      });
      
      // Store in local storage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("userEmail", loginEmail);
      }
      
      // Navigate to home after successful login
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        setLoginEmail(registerEmail);
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
    <div className="flex flex-col min-h-screen bg-gaming-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gaming-primary/10 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gaming-accent/10 rounded-full filter blur-3xl opacity-30 animate-pulse-glow"></div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gaming-primary rounded-xl flex items-center justify-center mb-4 shadow-glow transform hover:scale-105 transition-all duration-300">
              <Trophy size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gaming-text">
              <span className="text-gaming-primary text-glow">Fire</span>Arena
            </h1>
            <p className="text-gaming-text/70 mt-2">
              Join competitive Free Fire tournaments and win real rewards
            </p>
          </div>
          
          {/* Auth Card */}
          <Card className="glass-card bg-gaming-bg border-white/10 p-6 animate-in">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-gaming-bg/50">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-gaming-primary data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-gaming-primary data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-text/80 flex items-center gap-2">
                      <Mail size={16} className="text-gaming-primary" />
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={cn(
                        "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text focus:border-gaming-primary focus:ring-gaming-primary",
                        loginErrors.email && "border-red-500"
                      )}
                    />
                    {loginErrors.email && (
                      <p className="text-xs text-red-500">{loginErrors.email}</p>
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className={cn(
                          "bg-gaming-bg/60 border-gaming-primary/30 text-gaming-text pr-10 focus:border-gaming-primary focus:ring-gaming-primary",
                          loginErrors.password && "border-red-500"
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
                    {loginErrors.password && (
                      <p className="text-xs text-red-500">{loginErrors.password}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                          className="border-gaming-primary/50 data-[state=checked]:bg-gaming-primary"
                        />
                        <label htmlFor="remember-me" className="text-xs text-gaming-text/70 cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-gaming-primary hover:text-gaming-primary/90 hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gaming-primary hover:bg-gaming-primary/90 text-white font-medium shadow-glow hover:shadow-none transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
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
                      By registering, you agree to our Terms of Service and Privacy Policy
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
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Quick Login */}
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
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gaming-text/50 relative z-10">
        <p>© 2025 FireArena - Not affiliated with Garena Free Fire</p>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Auth;
