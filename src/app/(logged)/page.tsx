import { getSession } from "@/lib/sessions";
import { Lineups } from "./lineups";
import { getPlayers } from "./players/actions";
import { getCurrentMatch, createMatch } from "./matches/actions";

export default async function Home() {
  const session = await getSession();
  const players = await getPlayers(session?.groupId ?? 0);
  const { match, teams } = await getCurrentMatch(session?.groupId ?? 0);

  return <Lineups match={match!} teams={teams} players={players} />;
}
