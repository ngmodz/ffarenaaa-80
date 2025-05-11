import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TournamentFormData } from "@/pages/TournamentCreate";
import { ChevronLeft, CalendarIcon, Users, Trophy, MapPin, Settings, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createTournament, uploadTournamentBanner } from "@/lib/tournamentService";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useTournament } from "@/contexts/TournamentContext";

interface ReviewAndPublishProps {
  formData: TournamentFormData;
  prevStep: () => void;
}

const ReviewAndPublish = ({ formData, prevStep }: ReviewAndPublishProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [authVerified, setAuthVerified] = useState(false);
  const { refreshHostedTournaments } = useTournament();
  
  // Verify authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in with UID:", user.uid);
        setAuthVerified(true);
      } else {
        console.log("No user is signed in");
        setError("You must be logged in to create a tournament. Please sign in again.");
        setAuthVerified(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Calculate total prize pool
  const totalPrizePool = formData.entry_fee * formData.max_players;

  // Format date from ISO string
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return "Date not set";
    }
  };
  
  // Helper to render prize distribution
  const renderPrizeDistribution = () => {
    return Object.entries(formData.prize_distribution)
      .filter(([_, percentage]) => percentage > 0)
      .map(([position, percentage]) => {
        const amount = Math.round((percentage / 100) * totalPrizePool);
        return (
          <div key={position} className="flex justify-between items-center text-sm">
            <span>{position} Place</span>
            <div>
              <span className="text-gaming-accent font-semibold">{percentage}%</span>
              <span className="text-gaming-muted ml-2">₹{amount}</span>
            </div>
          </div>
        );
      });
  };

  // Validate tournament data
  const validateTournamentData = (): boolean => {
    // Check if user is authenticated
    if (!auth.currentUser) {
      setError("You must be logged in to create a tournament. Please sign in.");
      return false;
    }
    
    // Check required fields
    const requiredFields: (keyof TournamentFormData)[] = [
      'name', 'description', 'mode', 'max_players', 'start_date', 
      'map', 'room_type', 'entry_fee', 'prize_distribution', 'rules'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Check if date is in the future
    const tournamentDate = new Date(formData.start_date);
    const now = new Date();
    if (tournamentDate <= now) {
      setError("Tournament start date must be in the future");
      return false;
    }
    
    // Check if prize distribution adds up to 100%
    const prizeTotal = Object.values(formData.prize_distribution).reduce((sum, value) => sum + value, 0);
    if (prizeTotal !== 100) {
      setError(`Prize distribution must total 100%. Current total: ${prizeTotal}%`);
      return false;
    }
    
    return true;
  };

  // Re-authenticate user if needed
  const refreshAuthentication = async () => {
    try {
      // Sign out and redirect to auth page to refresh authentication
      await signOut(auth);
      toast.error("Authentication session expired. Please log in again.");
      navigate("/auth");
      return false;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  };

  // Handle tournament creation
  const createTournamentHandler = async () => {
    try {
      // Reset states
      setError(null);
      
      if (!authVerified) {
        const isRefreshed = await refreshAuthentication();
        if (!isRefreshed) return;
      }
      
      // Validate data
      if (!validateTournamentData()) {
        return;
      }
      
      setIsSubmitting(true);
      
      // Notify user that the tournament is being created
      toast.info("Creating your tournament...");
      
      // If there's a new image file, upload it to Firebase Storage
      let bannerImageUrl = formData.banner_image_url;
      if (formData.banner_image instanceof File) {
        toast.info("Uploading tournament banner...");
        bannerImageUrl = await uploadTournamentBanner(formData.banner_image);
      }
      
      // Create tournament data
      const tournamentData = {
        ...formData,
        banner_image_url: bannerImageUrl,
      };
      
      // Remove the banner_image field as it's not needed in Firestore
      delete tournamentData.banner_image;
      
      // Create the tournament in Firestore
      const result = await createTournament(tournamentData);
      
      // Success!
      setSuccess(true);
      toast.success("Tournament created successfully!");
      
      // Refresh the tournaments list
      await refreshHostedTournaments();
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/tournament/${result.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Error creating tournament:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create tournament. Please try again.";
      
      // Handle specific error cases
      if (errorMessage.includes("permission") || errorMessage.includes("Permission")) {
        // If it's a permissions issue, try to refresh auth
        toast.error("Permission issue detected. Refreshing your authentication...");
        await refreshAuthentication();
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Review & Publish Tournament</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-500/20 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your tournament has been created successfully! Redirecting to tournament page...
          </AlertDescription>
        </Alert>
      )}
      
      {!authVerified && (
        <Alert className="mb-6 bg-amber-500/20 border-amber-500 text-amber-500">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Warning</AlertTitle>
          <AlertDescription>
            Your authentication session may be invalid. Creating a tournament might fail. Please consider signing out and signing back in.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Tournament Date Warning */}
      {formData.start_date && new Date(formData.start_date) < new Date(Date.now() + 24 * 60 * 60 * 1000) && (
        <Alert className="mb-6 bg-amber-500/20 border-amber-500 text-amber-500">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Your tournament is scheduled to start in less than 24 hours. Participants may not have enough time to join.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-gaming-card-dark rounded-md p-6">
        {/* Tournament Header */}
        <div className="relative rounded-md overflow-hidden h-40 mb-4">
          {formData.banner_image_url ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
              <img 
                src={formData.banner_image_url} 
                alt={formData.name} 
                className="w-full h-full object-cover"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gaming-primary/30 to-gaming-accent/30"></div>
          )}
          
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="text-xl font-bold text-white">{formData.name}</h3>
            <div className="flex items-center text-white/80 text-sm">
              <CalendarIcon size={14} className="mr-1" />
              <span>{formData.start_date ? formatDate(formData.start_date) : "Date not set"}</span>
            </div>
          </div>
        </div>
        
        {/* Tournament Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Users size={16} className="mr-2 text-gaming-primary" />
              Basic Information
            </h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gaming-muted">Game Mode:</span>
                <span>{formData.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gaming-muted">Max Players:</span>
                <span>{formData.max_players}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gaming-muted">Description:</span>
              </div>
              <p className="text-sm text-gaming-muted">{formData.description}</p>
            </div>
            
            <h4 className="font-semibold mb-3 flex items-center">
              <MapPin size={16} className="mr-2 text-gaming-primary" />
              Game Settings
            </h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gaming-muted">Map:</span>
                <span>{formData.map}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gaming-muted">Room Type:</span>
                <span>{formData.room_type}</span>
              </div>
              <Separator className="my-2" />
              <h5 className="font-medium">Custom Settings:</h5>
              <div className="flex justify-between">
                <span className="text-gaming-muted">Auto-Aim:</span>
                <span>{formData.custom_settings.auto_aim ? "Enabled" : "Disabled"}</span>
              </div>
              {formData.custom_settings.fall_damage !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gaming-muted">Fall Damage:</span>
                  <span>{formData.custom_settings.fall_damage ? "Enabled" : "Disabled"}</span>
                </div>
              )}
              {formData.custom_settings.friendly_fire !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gaming-muted">Friendly Fire:</span>
                  <span>{formData.custom_settings.friendly_fire ? "Enabled" : "Disabled"}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Trophy size={16} className="mr-2 text-gaming-primary" />
              Entry Fee & Prizes
            </h4>
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gaming-muted">Entry Fee:</span>
                <span className="font-semibold">₹{formData.entry_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gaming-muted">Expected Prize Pool:</span>
                <span className="font-semibold text-gaming-accent">₹{totalPrizePool}</span>
              </div>
              <Separator className="my-2" />
              <h5 className="font-medium">Prize Distribution:</h5>
              <div className="space-y-2 mt-2">
                {renderPrizeDistribution()}
              </div>
            </div>
            
            <h4 className="font-semibold mb-3 flex items-center">
              <Settings size={16} className="mr-2 text-gaming-primary" />
              Tournament Rules
            </h4>
            <div className="bg-gaming-card rounded-md p-3 text-sm text-gaming-muted mb-4">
              <p>{formData.rules || "No rules specified"}</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            disabled={isSubmitting || success}
            className="border-gaming-primary text-gaming-primary w-full sm:w-auto order-2 sm:order-1 py-6 sm:py-2 rounded-xl sm:rounded-md text-base"
          >
            <ChevronLeft size={18} className="mr-2" /> Back to Edit
          </Button>
          <Button 
            type="button"
            onClick={createTournamentHandler}
            disabled={isSubmitting || success}
            className="bg-gaming-primary hover:bg-gaming-primary-dark w-full sm:w-auto order-1 sm:order-2 py-6 sm:py-2 rounded-xl sm:rounded-md text-base font-medium"
          >
            {isSubmitting ? "Creating..." : "Publish Tournament"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndPublish; 