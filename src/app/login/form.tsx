'use client';

import { useActionState } from "react";
import { login } from "@/lib/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div style={{ height:'100vh' }} className="flex flex-col justify-center items-center">
        <form action={action} className="flex flex-col gap-2 min-w-70">
            <input defaultValue={state?.email} name="email" placeholder="mlinei@gmail.com" className="py-1 px-2 border-2"/>
            { state?.errors?.email && <span className="text-red-500">{ state.errors.email }</span> }
            <button disabled={pending} type="submit" className="p-1 bg-blue-400 text-white">
                { pending ? 'banca un toque...' : 'login' }
            </button>
        </form>
    </div>
  );
}
