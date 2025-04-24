import { getSession } from "@/lib/sessions";
import { getPlayers } from "./actions";
import { PlayersList } from "./list";

export default async function Players() {
    const session = await getSession();
    const players = await getPlayers(session?.groupId ?? 0);

    return (
        <>
            <PlayersList initialPlayers={players} groupId={session!.groupId} />
        </>
    );
}
