import { getSession } from "@/lib/sessions";
import { getCurrentMatch } from "././groups/[groupId]/matches/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  const { match } = await getCurrentMatch(session?.groupId ?? 0);

  redirect("/groups/" + session?.groupId + "/matches/" + match?.id);
}
