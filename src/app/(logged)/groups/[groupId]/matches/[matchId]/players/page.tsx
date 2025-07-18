import { getSession } from "@/lib/sessions";
import { getPlayers, getTeamPlayers } from "./actions";
import { getCurrentMatch } from "../../actions";
import { PlayersList } from "./list";

export default async function Players() {
  const session = await getSession();
  const { teams } = (await getCurrentMatch(
    session?.groupId ?? 0,
    session?.matchId ?? 0
  )) ?? { match: null, teams: [] };
  const players = await getPlayers(session?.groupId ?? 0);
  const teamPlayers = await getTeamPlayers(session?.matchId ?? 0);

  return (
    <>
      <PlayersList
        initialPlayers={players}
        groupId={session!.groupId}
        teams={teams}
        teamPlayers={teamPlayers}
        matchId={session?.matchId ?? 0}
      />
    </>
  );
}
