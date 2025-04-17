'use client';

import { logout } from "@/lib/auth";

export function NavBar() {
  return (
    <div className="p-4 flex flex-row justify-between max-w-full bg-grey">
      <button className="bg-sky-500/10">Home</button>
	  <button onClick={logout} className="bg-sky-500/10">logout</button>
    </div>
  );
}
