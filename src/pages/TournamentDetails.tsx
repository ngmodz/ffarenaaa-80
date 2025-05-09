import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTournamentById, Tournament } from "@/lib/tournamentService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import TournamentDetailsContent from "@/components/tournament-details";

const TournamentDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isHost, setIsHost] = useState(false);

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
      }
    } catch (error) {
      console.error("Failed to fetch tournament details:", error);
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
    }
  }, [tournament, currentUser]);

  if (!id) {
    return null;
  }

  return (
    <TournamentDetailsContent
      id={id}
      tournament={tournament as Tournament}
      isHost={isHost}
      loading={loading}
      currentUser={currentUser}
      onRefresh={fetchTournamentDetails}
    />
  );
};

export default TournamentDetails;
