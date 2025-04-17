'use server';

import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { createSession, deleteSession } from "@/lib/sessions";
import { redirect } from "next/navigation";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type FormState = { errors?: { email?: string[] } } | undefined;

export async function login(state: FormState, formData: FormData) {
    // agarro valor del input email
    const email = formData.get('email')?.toString();

    // si el campo esta vacio, tirar error
    if (!email) {
        return { email, errors: { email: ['completa pajin'] } };
    }

    // valido el email con una regex
    if (!emailRegex.test(email)) {
        return { email, errors: { email: ['lamentablemente inválido'] } };
    }

    // busco el usuario
    let user = await db.query.users.findFirst({ where: eq(users.email, email) });

    // si no existia, creo uno con el mail que paso
    if (!user) {
        user = await db.insert(users).values({ email }).returning().then((v) => v.at(0));
    }

    // creo el jwt y lo meto en las cookies
    await createSession(user!.id);

    // si salio todo bien, me voy a la home
    redirect('/');
}

export async function logout() {
    // elimino la cookie
    await deleteSession();

    // me voy a la pantalla de login
    redirect('/login');
}
