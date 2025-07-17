import { getSession } from "@/lib/sessions";
import { MatchesList } from "./matches";
import { getMatches } from "./actions";

export default async function Matches() {
  const session = await getSession();
  const { matchesArray, teams } = await getMatches(session?.groupId ?? 0);

  return (
    <MatchesList
      matches={matchesArray}
      currentTeams={teams}
      userId={session?.userId ?? 0}
      groupId={session?.groupId ?? 0}
    />
  );
}
