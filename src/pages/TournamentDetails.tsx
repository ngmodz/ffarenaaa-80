import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Check,
  Copy,
  ArrowLeft,
  AlertCircle,
  Info,
  Share2,
  Loader2,
  Edit3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getTournamentById, updateTournamentRoomDetails, Tournament } from "@/lib/tournamentService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [showSetRoomModal, setShowSetRoomModal] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomPasswordInput, setRoomPasswordInput] = useState("");
  const [isSavingRoomDetails, setIsSavingRoomDetails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const fetchTournamentDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getTournamentById(id);
      setTournament(data);
      if (data && currentUser) {
        setIsHost(data.host_id === currentUser.uid);
        setRoomIdInput(data.room_id || "");
        setRoomPasswordInput(data.room_password || "");
      }
    } catch (error) {
      console.error("Failed to fetch tournament details:", error);
      toast({
        title: "Error",
        description: "Failed to load tournament details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentDetails();
  }, [id, currentUser]);

  useEffect(() => {
    if (tournament && currentUser) {
      setIsHost(tournament.host_id === currentUser.uid);
      setRoomIdInput(tournament.room_id || "");
      setRoomPasswordInput(tournament.room_password || "");
    }
  }, [tournament, currentUser]);

  const handleSetRoomDetails = async () => {
    if (!id || !tournament) return;
    if (!roomIdInput.trim() || !roomPasswordInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Room ID and Password cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsSavingRoomDetails(true);
    try {
      const result = await updateTournamentRoomDetails(id, roomIdInput, roomPasswordInput);
      if (result.success) {
        toast({
          title: "Success",
          description: "Room details updated successfully.",
        });
        setShowSetRoomModal(false);
        fetchTournamentDetails();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Failed to update room details:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update room details.",
        variant: "destructive",
      });
    } finally {
      setIsSavingRoomDetails(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: `${text} copied to clipboard.` });
    }).catch(err => {
      toast({ title: "Error", description: "Failed to copy.", variant: "destructive" });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-gaming-primary" />
        <p className="ml-4 text-lg">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-xl font-semibold">Tournament not found</p>
        <Link to="/" className="mt-4 text-gaming-primary hover:underline">
          Go back to tournaments
        </Link>
      </div>
    );
  }

  const progressPercentage = tournament.max_players > 0 ? (tournament.filled_spots / tournament.max_players) * 100 : 0;
  const spotsLeft = tournament.max_players - tournament.filled_spots;
  
  const mockPrizes = [
      { position: "1st", amount: 5000 },
      { position: "2nd", amount: 3000 },
      { position: "3rd", amount: 2000 }
    ];
  const mockOrganizer = {
      name: "GamersHub",
      verified: true,
      tournaments: 45
    };

  return (
    <>
      <Link to="/" className="inline-flex items-center text-gaming-muted hover:text-gaming-text mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to tournaments
      </Link>
      
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
        <img 
          src={tournament.banner_image_url || "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1000"} 
          alt={tournament.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
          <div className="flex items-center mb-2">
            <div className="bg-gaming-primary text-white text-xs px-2 py-1 rounded">
              {tournament.status.toUpperCase()}
            </div>
            {isHost && (
              <Button 
                onClick={() => setShowSetRoomModal(true)} 
                size="sm" 
                className="ml-auto bg-gaming-accent hover:bg-gaming-accent/90 text-white"
              >
                <Edit3 size={16} className="mr-1.5" />
                Set Room Details
              </Button>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{tournament.name}</h1>
          <div className="flex items-center flex-wrap text-white/80 text-sm mb-3 gap-3">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{new Date(tournament.start_date).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center">
              <Trophy size={16} className="mr-1 text-gaming-accent" />
              <span className="font-bold">₹{tournament.entry_fee * tournament.max_players * 0.8} Prize (Example)</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center bg-white/20 px-2 py-0.5 rounded">
                <span>By {mockOrganizer.name}</span>
                {mockOrganizer.verified && (
                  <Check size={14} className="ml-1 text-gaming-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-gaming-card">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
              {tournament.status === 'active' || tournament.status === 'ongoing' && (
                <TabsTrigger value="room">Room Details</TabsTrigger>
              )}
              {tournament.status === 'completed' && (
                <TabsTrigger value="results">Results</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="info" className="bg-gaming-card p-4 rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-3">Tournament Details</h2>
              <p className="text-gaming-muted mb-6">{tournament.description}</p>
              
              <h3 className="font-semibold mb-2">Tournament Format</h3>
              <ul className="list-disc list-inside text-gaming-muted space-y-1 pl-2 mb-6">
                <li>Mode: {tournament.mode}</li>
                <li>Map: {tournament.map}</li>
                <li>Room Type: {tournament.room_type}</li>
                <li>Max Players: {tournament.max_players}</li>
                <li>Auto Aim: {tournament.custom_settings?.auto_aim ? "On" : "Off"}</li>
              </ul>
              
              <h3 className="font-semibold mb-2">Schedule</h3>
              <div className="space-y-2 text-gaming-muted mb-6">
                <div className="flex justify-between">
                  <span>Registration closes:</span>
                  <span>{new Date(new Date(tournament.start_date).getTime() - 30 * 60000).toLocaleString()} (Example)</span>
                </div>
                <div className="flex justify-between">
                  <span>Room details shared:</span>
                  <span>{new Date(new Date(tournament.start_date).getTime() - 15 * 60000).toLocaleString()} (Example)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tournament starts:</span>
                  <span>{new Date(tournament.start_date).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-gaming-primary/10 border border-gaming-primary/20 rounded-md p-4 flex">
                <Info size={20} className="text-gaming-primary mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Important Information</h4>
                  <p className="text-sm text-gaming-muted">
                    Please ensure all team members have the latest version of Free Fire installed. 
                    You must join the custom room within 10 minutes of the scheduled start time.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="rules" className="bg-gaming-card p-4 rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">Tournament Rules</h2>
              {tournament.rules ? (
                <ul className="space-y-3">
                  {tournament.rules.split('\n').map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-gaming-primary/20 p-1 rounded-md mr-3 mt-0.5">
                        <Check size={16} className="text-gaming-primary" />
                      </div>
                      <span className="text-gaming-muted">{rule}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-gaming-muted">No specific rules provided for this tournament.</p>}
              
              <Separator className="my-6" />
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 flex">
                <AlertCircle size={20} className="text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1 text-red-400">Prohibited Actions</h4>
                  <ul className="text-sm text-gaming-muted space-y-2">
                    <li>Using unauthorized third-party apps or mods</li>
                    <li>Teaming with other squads during matches</li>
                    <li>Intentionally disconnecting to avoid elimination</li>
                    <li>Any form of harassment or toxic behavior</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="prizes" className="bg-gaming-card p-4 rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">Prize Distribution</h2>
              <div className="space-y-4">
                {Object.entries(tournament.prize_distribution || {}).map(([position, percentage], index) => {
                  const prizeAmount = (tournament.entry_fee * tournament.max_players * (percentage / 100)).toFixed(2);
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 rounded-md border ${
                        index === 0 
                          ? "bg-yellow-500/10 border-yellow-500/30" 
                          : index === 1 
                            ? "bg-gray-400/10 border-gray-400/30" 
                            : "bg-amber-700/10 border-amber-700/30"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? "bg-yellow-500/20" : index === 1 ? "bg-gray-400/20" : "bg-amber-700/20"
                        }`}>
                          <Trophy size={20} className={
                            index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                          } />
                        </div>
                        <div>
                          <div className="text-sm text-gaming-muted">
                            {position} Place ({percentage}%)
                          </div>
                          <div className="font-bold text-lg">
                            ₹{prizeAmount}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(tournament.prize_distribution || {}).length === 0 && (
                  <p className="text-gaming-muted">Prize distribution details not available.</p>
                )}
              </div>
            </TabsContent>
            
            {(tournament.status === 'active' || tournament.status === 'ongoing') && (
              <TabsContent value="room" className="bg-gaming-card p-4 rounded-md mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Custom Room Details</h2>
                    {isHost && (
                        <Button 
                        onClick={() => setShowSetRoomModal(true)} 
                        size="sm" 
                        variant="outline"
                        className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent/10"
                        >
                        <Edit3 size={16} className="mr-1.5" />
                        {tournament.room_id ? 'Update' : 'Set'} Room Details
                        </Button>
                    )}
                </div>
                
                {(!tournament.room_id && !tournament.room_password) ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 mb-6 text-center">
                    <AlertCircle size={24} className="text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-yellow-400" style={{color: '#A0AEC0'}}>
                      {isHost ? "Room details are not set yet. Click 'Set Room Details' to add them." : "Room details are not set yet."}
                    </h3>
                    {!isHost && <p className="text-sm mt-1" style={{color: '#A0AEC0'}}>They will be available closer to the tournament start time.</p>}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gaming-card-deep border border-gaming-border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gaming-muted">Room ID</div>
                        <button onClick={() => handleCopy(tournament.room_id || "")} className="text-gaming-primary hover:text-gaming-primary/80 flex items-center text-sm">
                          <Copy size={14} className="mr-1" /> Copy
                        </button>
                      </div>
                      <div className="font-mono text-xl font-semibold text-white">{tournament.room_id || "N/A"}</div>
                    </div>
                    
                    <div className="bg-gaming-card-deep border border-gaming-border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gaming-muted">Password</div>
                        <button onClick={() => handleCopy(tournament.room_password || "")} className="text-gaming-primary hover:text-gaming-primary/80 flex items-center text-sm">
                          <Copy size={14} className="mr-1" /> Copy
                        </button>
                      </div>
                      <div className="font-mono text-xl font-semibold text-white">{tournament.room_password || "N/A"}</div>
                    </div>
                    
                    <div className="bg-gaming-primary/10 border border-gaming-primary/20 rounded-md p-4 mt-6">
                      <h3 className="font-semibold mb-2">How to join the custom room</h3>
                      <ol className="list-decimal list-inside text-gaming-muted space-y-2 pl-2">
                        <li>Open Free Fire and go to the game lobby</li>
                        <li>Click on the "Custom Room" button</li>
                        <li>Select "Enter Room" and input the Room ID</li>
                        <li>Enter the Password when prompted</li>
                        <li>Select your character and wait for the match to start</li>
                      </ol>
                    </div>
                  </div>
                )}
              </TabsContent>
            )}
            
            {tournament.status === 'completed' && (
              <TabsContent value="results" className="bg-gaming-card p-4 rounded-md mt-4">
                <h2 className="text-xl font-semibold mb-4">Tournament Results</h2>
                <p className="text-gaming-muted">Results are not yet available for this tournament or this section is under construction.</p>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gaming-card border-gaming-border p-4">
            <h3 className="font-semibold mb-4">Registration</h3>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gaming-muted">Entry Fee</div>
              <div className="font-bold text-lg">₹{tournament.entry_fee}</div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-gaming-muted">Prize Pool (Est.)</div>
              <div className="font-bold text-lg text-gaming-accent">₹{(tournament.entry_fee * tournament.max_players * 0.8).toFixed(2)}</div>
            </div>
            <Separator className="my-4" />
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Users size={16} className="mr-1 text-gaming-muted" />
                  <span className="text-gaming-muted">Participants</span>
                </div>
                <div className="font-medium">
                  {tournament.filled_spots}/{tournament.max_players}
                </div>
              </div>
              <div className="w-full bg-gaming-border h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gaming-primary"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gaming-muted mt-1">
                {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Fully booked'}
              </div>
            </div>
            <Button 
              className="w-full bg-gaming-primary hover:bg-gaming-primary/90" 
              disabled={tournament.status !== 'active' || spotsLeft <= 0}
            >
              {tournament.status !== 'active' ? `Registration ${tournament.status}` : spotsLeft <= 0 ? 'Tournament Full' : 'Join Tournament'}
            </Button>
          </Card>

          <Card className="bg-gaming-card border-gaming-border p-4">
            <h3 className="font-semibold mb-3">Organized By</h3>
            <div className="flex items-center">
              <div>
                <div className="font-medium text-white">{mockOrganizer.name}</div>
                <div className="text-xs text-gaming-muted">{mockOrganizer.tournaments} tournaments hosted</div>
              </div>
              {mockOrganizer.verified && (
                <Check size={18} className="ml-auto text-gaming-primary" />
              )}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showSetRoomModal} onOpenChange={setShowSetRoomModal}>
        <DialogContent className="sm:max-w-[425px] bg-[#1F2937] border-gaming-border text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Set Custom Room Details</DialogTitle>
            <DialogDescription className="text-gaming-muted">
              Enter the Room ID and Password for this tournament. This will be visible to joined participants.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomId" className="text-right text-gaming-muted">
                Room ID
              </Label>
              <Input
                id="roomId"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="col-span-3 bg-gaming-card-deep border-gaming-border focus:ring-gaming-primary text-white"
                placeholder="Enter Room ID"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomPassword" className="text-right text-gaming-muted">
                Password
              </Label>
              <Input
                id="roomPassword"
                value={roomPasswordInput}
                onChange={(e) => setRoomPasswordInput(e.target.value)}
                className="col-span-3 bg-gaming-card-deep border-gaming-border focus:ring-gaming-primary text-white"
                placeholder="Enter Room Password"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="text-white border-gaming-muted hover:bg-gaming-muted/20">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={handleSetRoomDetails}
              disabled={isSavingRoomDetails}
              style={{ backgroundColor: '#22C55E' }}
              className="text-white hover:opacity-90"
            >
              {isSavingRoomDetails ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentDetails;
