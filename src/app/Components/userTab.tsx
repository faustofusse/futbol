export function UserTab({
  firstName, lastName, email, id
}: {
  firstName: string, lastName: string, email: string, id: number
}) {
  return (
    <div key={id} className="rounded-[20] text-black bg-white p-8 flex flex-col gap-2">
      <span>Nombre: {firstName}</span>
      <span>Apellido: {lastName}</span>
      <span>Email: {email}</span>
      <span>ID: {id}</span>
    </div>
  );
}