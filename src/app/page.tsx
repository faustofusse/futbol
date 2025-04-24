import { getSession } from "@/lib/sessions";
import { Lineups } from "./lineups";
import { getPlayers } from "./players/actions";

export default async function Home() {
    const session = await getSession();
    const players = await getPlayers(session?.groupId ?? 0);
    return (
        <Lineups players={players} />
    );
}
