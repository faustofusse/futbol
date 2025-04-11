import { db } from "@/db";
import { users as usersTable } from "@/db/schema";

export default async function Home() {
  const users = await db.select().from(usersTable);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      { users.map(user =>
        <div key={user.id} className="flex flex-col gap-2">
          <span>Nombre: {user.firstName}</span>
          <span>Apellido: {user.lastName}</span>
          <span>Email: {user.email}</span>
          <span>ID: {user.id}</span>
        </div>
      )}
    </div>
  );
}