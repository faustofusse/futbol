import { getSession } from "@/lib/sessions";
import { GroupsList } from "./groups";
import { getGroups } from "./actions";

export default async function Groups() {
  const session = await getSession();
  const { groupsArray, matchesList } = await getGroups(session?.userId ?? 0);

  return (
    <GroupsList
      groups={groupsArray}
      matches={matchesList}
      userId={session?.userId ?? 0}
    />
  );
}
