'use server';

import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { LoginForm } from "./form";

export default async function LoginPage() {
    const session = await getSession();
    if (session) redirect('/');

    return <LoginForm />
}
