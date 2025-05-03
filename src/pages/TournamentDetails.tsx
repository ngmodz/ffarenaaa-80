import { useParams, Link } from "react-router-dom";
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
  Share2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TournamentDetails = () => {
  const { id } = useParams();
  
  // Mock tournament data
  const tournament = {
    id: id,
    title: "Free Fire Squad Showdown",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1000",
    entryFee: 49,
    prizeMoney: 10000,
    date: "May 5, 2025",
    time: "6:00 PM",
    totalSpots: 48,
    filledSpots: 32,
    status: 'upcoming',
    description: "Join our exciting Free Fire Squad Showdown tournament! Compete with the best players and win awesome cash prizes. This tournament features custom lobbies with pro-level competition.",
    rules: [
      "Teams must have 4 players",
      "All players must be on time",
      "In-game reporting for suspicious behavior",
      "Top 3 teams win cash prizes",
      "Tournament will be played in Battle Royale mode"
    ],
    prizes: [
      { position: "1st", amount: 5000 },
      { position: "2nd", amount: 3000 },
      { position: "3rd", amount: 2000 }
    ],
    organizer: {
      name: "GamersHub",
      verified: true,
      tournaments: 45
    },
    customRoom: {
      roomId: "58472198",
      password: "ff2025"
    }
  };
  
  // Check if tournament is loaded
  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Tournament not found</p>
      </div>
    );
  }
  
  // Calculate progress percentage
  const progressPercentage = (tournament.filledSpots / tournament.totalSpots) * 100;
  const spotsLeft = tournament.totalSpots - tournament.filledSpots;
  
  return (
    <>
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-gaming-muted hover:text-gaming-text mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to tournaments
      </Link>
      
      {/* Tournament Header */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
          <div className="flex items-center mb-2">
            <div className="bg-gaming-primary text-white text-xs px-2 py-1 rounded">
              {tournament.status.toUpperCase()}
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{tournament.title}</h1>
          <div className="flex items-center flex-wrap text-white/80 text-sm mb-3 gap-3">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{tournament.date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{tournament.time}</span>
            </div>
            <div className="flex items-center">
              <Trophy size={16} className="mr-1 text-gaming-accent" />
              <span className="font-bold">₹{tournament.prizeMoney} Prize</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center bg-white/20 px-2 py-0.5 rounded">
                <span>By {tournament.organizer.name}</span>
                {tournament.organizer.verified && (
                  <Check size={14} className="ml-1 text-gaming-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="bg-gaming-card">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
              {tournament.status === 'upcoming' && (
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
                <li>Squad (4-player team)</li>
                <li>Battle Royale mode</li>
                <li>3 matches total</li>
                <li>Points based on placement and kills</li>
              </ul>
              
              <h3 className="font-semibold mb-2">Schedule</h3>
              <div className="space-y-2 text-gaming-muted mb-6">
                <div className="flex justify-between">
                  <span>Registration closes:</span>
                  <span>May 5, 2025 - 5:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Room details shared:</span>
                  <span>May 5, 2025 - 5:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Tournament starts:</span>
                  <span>May 5, 2025 - 6:00 PM</span>
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
              <ul className="space-y-3">
                {tournament.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-gaming-primary/20 p-1 rounded-md mr-3 mt-0.5">
                      <Check size={16} className="text-gaming-primary" />
                    </div>
                    <span className="text-gaming-muted">{rule}</span>
                  </li>
                ))}
              </ul>
              
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
                {tournament.prizes.map((prize, index) => (
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
                        index === 0 
                          ? "bg-yellow-500/20" 
                          : index === 1 
                            ? "bg-gray-400/20" 
                            : "bg-amber-700/20"
                      }`}>
                        <Trophy size={20} className={
                          index === 0 
                            ? "text-yellow-500" 
                            : index === 1 
                              ? "text-gray-400" 
                              : "text-amber-700"
                        } />
                      </div>
                      <div>
                        <div className="text-sm text-gaming-muted">
                          {prize.position} Place
                        </div>
                        <div className="font-bold text-lg">
                          ₹{prize.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Bonus Rewards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gaming-card border border-gaming-border p-3 rounded-md">
                      <div className="font-semibold">Most Valuable Player</div>
                      <div className="text-gaming-muted text-sm">₹500</div>
                    </div>
                    <div className="bg-gaming-card border border-gaming-border p-3 rounded-md">
                      <div className="font-semibold">Highest Eliminations</div>
                      <div className="text-gaming-muted text-sm">₹500</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="room" className="bg-gaming-card p-4 rounded-md mt-4">
              <h2 className="text-xl font-semibold mb-4">Custom Room Details</h2>
              
              {tournament.status === 'upcoming' ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <AlertCircle size={20} className="text-yellow-500 mr-2" />
                    <h3 className="font-semibold">Room details will be available 15 minutes before the tournament</h3>
                  </div>
                  <p className="text-gaming-muted text-sm">
                    Room ID and password will be revealed here and sent to all registered participants.
                    Make sure to join on time!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gaming-card border border-gaming-border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gaming-muted">Room ID</div>
                      <button className="text-gaming-primary hover:text-gaming-primary/80 flex items-center text-sm">
                        <Copy size={14} className="mr-1" /> Copy
                      </button>
                    </div>
                    <div className="font-mono text-xl font-semibold">{tournament.customRoom.roomId}</div>
                  </div>
                  
                  <div className="bg-gaming-card border border-gaming-border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gaming-muted">Password</div>
                      <button className="text-gaming-primary hover:text-gaming-primary/80 flex items-center text-sm">
                        <Copy size={14} className="mr-1" /> Copy
                      </button>
                    </div>
                    <div className="font-mono text-xl font-semibold">{tournament.customRoom.password}</div>
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
            
            {tournament.status === 'completed' && (
              <TabsContent value="results" className="bg-gaming-card p-4 rounded-md mt-4">
                <h2 className="text-xl font-semibold mb-4">Tournament Results</h2>
                <div className="space-y-3">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-yellow-500">1</span>
                      </div>
                      <div>
                        <div className="font-semibold">Team Phoenix</div>
                        <div className="text-xs text-gaming-muted">35 points (15 kills)</div>
                      </div>
                    </div>
                    <div className="font-bold">₹5000</div>
                  </div>
                  
                  <div className="bg-gray-400/10 border border-gray-400/20 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-400/20 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-gray-400">2</span>
                      </div>
                      <div>
                        <div className="font-semibold">Shadow Squad</div>
                        <div className="text-xs text-gaming-muted">28 points (12 kills)</div>
                      </div>
                    </div>
                    <div className="font-bold">₹3000</div>
                  </div>
                  
                  <div className="bg-amber-700/10 border border-amber-700/20 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-amber-700/20 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-amber-700">3</span>
                      </div>
                      <div>
                        <div className="font-semibold">Elite Warriors</div>
                        <div className="text-xs text-gaming-muted">24 points (10 kills)</div>
                      </div>
                    </div>
                    <div className="font-bold">₹2000</div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registration Card */}
          <Card className="bg-gaming-card border-gaming-border p-4">
            <h3 className="font-semibold mb-4">Registration</h3>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-gaming-muted">Entry Fee</div>
              <div className="font-bold text-lg">₹{tournament.entryFee}</div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-gaming-muted">Prize Pool</div>
              <div className="font-bold text-lg text-gaming-accent">₹{tournament.prizeMoney}</div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <Users size={16} className="mr-1 text-gaming-muted" />
                  <span className="text-gaming-muted">Participants</span>
                </div>
                <div className="font-medium">
                  {tournament.filledSpots}/{tournament.totalSpots}
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
            
            <Button className="w-full bg-gaming-accent hover:bg-gaming-accent/90 text-white">
              {tournament.status === 'upcoming' ? (spotsLeft > 0 ? 'Join Tournament' : 'Fully Booked') : 
               tournament.status === 'live' ? 'Tournament in Progress' : 'Tournament Completed'}
            </Button>
            
            {tournament.status === 'upcoming' && spotsLeft > 0 && (
              <p className="text-xs text-gaming-muted text-center mt-2">
                Registration closes 30 minutes before the tournament
              </p>
            )}
          </Card>
          
          {/* Organizer Card */}
          <Card className="bg-gaming-card border-gaming-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Organizer</h3>
              <div className="bg-gaming-primary/20 px-2 py-0.5 rounded text-gaming-primary text-xs font-medium">
                Verified
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gaming-primary/20 rounded-full flex items-center justify-center mr-3">
                <Trophy size={20} className="text-gaming-primary" />
              </div>
              <div>
                <div className="font-semibold">{tournament.organizer.name}</div>
                <div className="text-sm text-gaming-muted">
                  {tournament.organizer.tournaments} tournaments organized
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              View Organizer Profile
            </Button>
          </Card>
          
          {/* Share Card */}
          <Card className="bg-gaming-card border-gaming-border p-4">
            <h3 className="font-semibold mb-4">Share Tournament</h3>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Share2 size={18} className="mr-2" /> Share
              </Button>
              <Button variant="outline" className="flex-1">
                <Copy size={18} className="mr-2" /> Copy Link
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TournamentDetails;
