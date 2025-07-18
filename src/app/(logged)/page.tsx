import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  redirect("/groups/" + session?.groupId + "/matches/" + session?.matchId);
}
