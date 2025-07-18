"use server";

import { db, Group, groups, groupUsers, matches, users } from "@/db";
import { eq, and, isNull, desc } from "drizzle-orm";
import { createSession, deleteSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import { createMatch } from "@/app/(logged)/groups/[groupId]/matches/actions";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const defaultGroupName = "Fútbol";

export type FormState = { errors?: { email?: string[] } } | undefined;

export async function login(state: FormState, formData: FormData) {
  // agarro valor del input email
  const email = formData.get("email")?.toString();

  // si el campo esta vacio, tirar error
  if (!email) {
    return { email, errors: { email: ["Completar correo"] } };
  }

  // valido el email con una regex
  if (!emailRegex.test(email)) {
    return { email, errors: { email: ["Correo invalido"] } };
  }

  // busco el usuario
  let user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .then((v) => v.at(0));

  let group: { id: number | null; name: string | null } | undefined;

  // si existe el usuario, busco el grupo
  if (user) {
    group = await db
      .select({ id: groups.id, name: groups.name })
      .from(groups)
      .where(and(eq(groups.id, groupUsers.group), isNull(groups.deleted)))
      .leftJoin(groupUsers, eq(groupUsers.user, user.id))
      .then((v) => v.at(0));
  }

  // si no existia, creo uno con el mail que paso
  if (!user) {
    user = await db
      .insert(users)
      .values({ email })
      .returning()
      .then((v) => v.at(0));
  }

  // si no tiene grupo, lo creo
  if (!group) {
    group = await db
      .insert(groups)
      .values({ name: defaultGroupName })
      .returning()
      .then((v) => v.at(0));
    await db.insert(groupUsers).values({ user: user!.id, group: group!.id! });
  }
  // si tiene grupo, busco un partido
  let match;
  match = await db
    .select()
    .from(matches)
    .where(and(eq(matches.group, group!.id!), isNull(matches.deleted)))
    .orderBy(desc(matches.created))
    .then((p) => p.at(0));

  // si no hay, creo uno
  if (!match) {
    match = (await createMatch(group!.id!)).match;
  }

  // creo el jwt y lo meto en las cookies
  await createSession(user!.id, group!.id!, match!.id!);

  // si salio todo bien, me voy a la home
  redirect("/");
}

export async function logout() {
  // elimino la cookie
  await deleteSession();

  // me voy a la pantalla de login
  redirect("/login");
}
