import { NavBar } from "@/components/navbar";
import { db, groups as groupsTable, groupUsers } from "@/db";
import { getSession } from "@/lib/sessions";
import { eq, getTableColumns } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect('/login');

  const groups = await db
      .select({ ...getTableColumns(groupsTable) })
      .from(groupUsers)
      .where(eq(groupUsers.user, session.userId))
      .leftJoin(groupsTable, eq(groupUsers.group, groupsTable.id));

  return (
    <>
      <NavBar groups={groups} currentGroup={session.groupId} />
      <span className="flex flex-1 justify-center">
          userid: { session?.userId }
      </span>
    </>
  );
}
