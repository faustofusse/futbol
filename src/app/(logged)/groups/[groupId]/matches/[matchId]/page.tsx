import { getSession } from "@/lib/sessions";
import { Lineups } from "./lineups";
import { getTeamPlayers } from "./players/actions";
import { getPlayers } from "./players/actions";
import { getCurrentMatch } from "../actions";

export default async function Lineup() {
  const session = await getSession();
  const { match, teams } = await getCurrentMatch(session?.groupId ?? 0);
  const players = await getPlayers(session?.groupId ?? 0);
  const teamPlayers = await getTeamPlayers(match.id);

  return (
    <Lineups
      match={match!}
      teams={teams}
      teamPlayers={teamPlayers}
      players={players}
      group={session?.groupId ?? 0}
    />
  );
}
