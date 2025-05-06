import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TournamentFormData } from "@/pages/TournamentCreate";
import { ChevronLeft, CalendarIcon, Users, Trophy, MapPin, Settings, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createTournament, uploadTournamentBanner } from "@/lib/tournamentService";

interface ReviewAndPublishProps {
  formData: TournamentFormData;
  prevStep: () => void;
}

const ReviewAndPublish = ({ formData, prevStep }: ReviewAndPublishProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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

  // Handle tournament creation
  const createTournamentHandler = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // If there's a new image file, upload it to Firebase Storage
      let bannerImageUrl = formData.banner_image_url;
      if (formData.banner_image instanceof File) {
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
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(`/tournament/${result.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Error creating tournament:", error);
      setError(typeof error === 'object' && error !== null && 'message' in error ? 
        (error as Error).message : 
        "Failed to create tournament. Please try again.");
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