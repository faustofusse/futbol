import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { UserTab } from "./Components/userTab";
import { TopBar } from "./Components/topBar";

export default async function Home() {
  const users = await db.select().from(usersTable);;   
  return (
    <>
      <TopBar />
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     { users.map(user =>
        <>
          <UserTab 
            key={ user.id }
            id={ user.id } 
            firstName={ user.firstName ?? '' } 
            lastName={ user.lastName ?? ''} 
            email={ user.email ?? ''} 
          />
        </>
      )}
    </div>
    </>
  );
}