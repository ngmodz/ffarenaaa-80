import { Link } from "react-router-dom";
import TournamentCard from "@/components/TournamentCard";
import { TournamentType } from "@/components/home/types";

interface TournamentListProps {
  tournaments: TournamentType[];
}

const TournamentList = ({ tournaments }: TournamentListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {tournaments.length > 0 ? (
        tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-[#A0A0A0] mb-2">No tournaments match your filter criteria</p>
          <Link to="/tournament/create" className="text-gaming-primary hover:underline">
            Create a tournament?
          </Link>
        </div>
      )}
    </div>
  );
};

export default TournamentList;
