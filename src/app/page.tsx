import { NavBar } from "@/components/navbar";
import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <>
      <NavBar />
      <span className="flex flex-1 justify-center">
          userid: { session?.userId }
      </span>
    </>
  );
}
