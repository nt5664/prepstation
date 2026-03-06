export function isSuperuser(
  user: Readonly<{ role: string; status: string }> | null | undefined,
) {
  return isUserActive(user) && user!.role !== "USER";
}

export function isUserMod(
  user: Readonly<{ role: string; status: string }> | null | undefined,
) {
  return isUserActive(user) && user!.role === "MODERATOR";
}

export function isUserAdmin(
  user: Readonly<{ role: string; status: string }> | null | undefined,
) {
  return isUserActive(user) && user!.role === "ADMIN";
}

export function isUserActive(
  user: Readonly<{ status: string }> | null | undefined,
) {
  return !!user && user.status === "ACTIVE";
}

export function isEditor(
  user: Readonly<{ id: string }>,
  editors: Readonly<{ id: string }[]>,
) {
  return editors.some((x) => x.id === user.id);
}
