
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerFFID, setRegisterFFID] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { loginEmail, loginPassword });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log("Registration attempted with:", { registerEmail, registerPassword, registerName, registerFFID });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gaming-bg">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gaming-primary rounded-xl flex items-center justify-center mb-4">
              <Trophy size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gaming-text">
              <span className="text-gaming-primary">Fire</span>Arena
            </h1>
            <p className="text-gaming-muted mt-2">
              Join competitive Free Fire tournaments and win real rewards
            </p>
          </div>
          
          {/* Auth Card */}
          <Card className="bg-gaming-card border-gaming-border p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="bg-gaming-bg border-gaming-border text-gaming-text pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-muted hover:text-gaming-text"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div className="flex justify-end">
                      <Link to="/forgot-password" className="text-xs text-gaming-primary hover:text-gaming-primary/90">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gaming-primary hover:bg-gaming-primary/90">
                    Login
                  </Button>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Free Fire ID
                    </label>
                    <Input
                      type="text"
                      placeholder="Your Free Fire ID"
                      value={registerFFID}
                      onChange={(e) => setRegisterFFID(e.target.value)}
                      required
                      className="bg-gaming-bg border-gaming-border text-gaming-text"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gaming-muted">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className="bg-gaming-bg border-gaming-border text-gaming-text pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gaming-muted hover:text-gaming-text"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="bg-gaming-primary/20 p-1 rounded-md mt-0.5">
                      <Check size={14} className="text-gaming-primary" />
                    </div>
                    <span className="text-xs text-gaming-muted">
                      By registering, you agree to our Terms of Service and Privacy Policy
                    </span>
                  </div>
                  
                  <Button type="submit" className="w-full bg-gaming-primary hover:bg-gaming-primary/90">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          {/* Quick Login */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gaming-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gaming-bg text-gaming-muted">Or continue with</span>
              </div>
            </div>
            
            <div className="flex space-x-3 justify-center">
              <button className="bg-gaming-card hover:bg-gaming-border text-gaming-text px-4 py-2 rounded-md border border-gaming-border flex-1 flex items-center justify-center">
                Google
              </button>
              <button className="bg-gaming-card hover:bg-gaming-border text-gaming-text px-4 py-2 rounded-md border border-gaming-border flex-1 flex items-center justify-center">
                Facebook
              </button>
            </div>
            
            <div>
              <Link to="/" className="text-gaming-primary hover:text-gaming-primary/90 flex items-center justify-center">
                Continue as guest <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gaming-muted">
        <p>© 2025 FireArena - Not affiliated with Garena Free Fire</p>
      </footer>
    </div>
  );
};

export default Auth;
