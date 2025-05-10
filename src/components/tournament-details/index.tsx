import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateTournamentRoomDetails, joinTournament } from "@/lib/tournamentService";
import { TournamentProps } from "./types";
import TournamentHeader from "./TournamentHeader";
import TournamentTabs from "./TournamentTabs";
import TournamentSidebar from "./TournamentSidebar";
import RoomDetailsDialog from "./RoomDetailsDialog";

const TournamentDetailsContent: React.FC<TournamentProps> = ({
  id,
  tournament,
  isHost,
  loading,
  currentUser,
  onRefresh
}) => {
  const { toast } = useToast();
  const [showSetRoomModal, setShowSetRoomModal] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState(tournament?.room_id || "");
  const [roomPasswordInput, setRoomPasswordInput] = useState(tournament?.room_password || "");
  const [isSavingRoomDetails, setIsSavingRoomDetails] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Calculate derived values
  const progressPercentage = tournament.max_players > 0 ? (tournament.filled_spots / tournament.max_players) * 100 : 0;
  const spotsLeft = tournament.max_players - tournament.filled_spots;

  const handleJoinTournament = async () => {
    console.log("Join tournament button clicked");
    if (!id || !tournament) {
      console.error("Missing tournament ID or tournament data", { id, tournament });
      return;
    }
    
    if (!currentUser) {
      console.error("No authenticated user found");
      toast({
        title: "Authentication Required",
        description: "You must be logged in to join this tournament.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is the tournament host
    if (tournament.host_id === currentUser.uid) {
      console.error("User is the host of this tournament");
      toast({
        title: "Cannot Join",
        description: "You cannot join your own tournament as you are the host.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is already a participant
    if (tournament.participants && tournament.participants.includes(currentUser.uid)) {
      console.error("User is already a participant in this tournament");
      toast({
        title: "Already Joined",
        description: "You have already joined this tournament.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Attempting to join tournament", { 
      tournamentId: id, 
      userId: currentUser.uid,
      isJoining
    });
    
    if (isJoining) return;
    
    setIsJoining(true);
    try {
      console.log("Calling joinTournament function");
      const result = await joinTournament(id);
      console.log("Join tournament result", result);
      
      toast({
        title: "Success",
        description: "You have successfully joined the tournament!",
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to join tournament:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to join the tournament.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

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
        onRefresh();
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
        <Link to="/home" className="mt-4 text-gaming-primary hover:underline">
          Go back to tournaments
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/home" className="inline-flex items-center text-gaming-muted hover:text-gaming-text mb-4">
        <ArrowLeft size={18} className="mr-1" /> Back to tournaments
      </Link>
      
      <TournamentHeader 
        tournament={tournament} 
        isHost={isHost} 
        onSetRoomDetails={() => setShowSetRoomModal(true)} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TournamentTabs 
            tournament={tournament}
            isHost={isHost}
            onSetRoomDetails={() => setShowSetRoomModal(true)}
            onCopy={handleCopy}
          />
        </div>
        
        <TournamentSidebar 
          tournament={tournament} 
          progressPercentage={progressPercentage}
          spotsLeft={spotsLeft}
          onJoin={handleJoinTournament}
        />
      </div>

      <RoomDetailsDialog 
        isOpen={showSetRoomModal}
        setIsOpen={setShowSetRoomModal}
        roomId={roomIdInput}
        setRoomId={setRoomIdInput}
        roomPassword={roomPasswordInput}
        setRoomPassword={setRoomPasswordInput}
        onSave={handleSetRoomDetails}
        isSaving={isSavingRoomDetails}
      />
    </>
  );
};

export default TournamentDetailsContent; 