import { getSession } from "@/lib/sessions";
import { getPlayers, getTeamPlayers } from "./actions";
import { getCurrentMatch } from "../../actions";
import { PlayersList } from "./list";

export default async function Players() {
  const session = await getSession();
  const players = await getPlayers(session?.groupId ?? 0);
  const { match, teams } = await getCurrentMatch(session?.groupId ?? 0);
  const teamPlayers = await getTeamPlayers(match.id);

  return (
    <>
      <PlayersList
        initialPlayers={players}
        groupId={session!.groupId}
        teams={teams}
        teamPlayers={teamPlayers}
        matchId={match?.id}
      />
    </>
  );
}
