import { getSession } from "@/lib/sessions";
import { getPlayers, getTeams } from "./actions";
import { PlayersList } from "./list";

export default async function Players() {
  const session = await getSession();
  const players = await getPlayers(session?.groupId ?? 0);
  const teams = await getTeams(9);

  return (
    <>
      <PlayersList
        initialPlayers={players}
        groupId={session!.groupId}
        teams={teams}
      />
    </>
  );
}
