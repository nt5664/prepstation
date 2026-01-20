export function isSuperuser(
  user: Readonly<{ role: string }> | null | undefined,
) {
  return user && user.role !== "USER";
}

export function isUserActive(user: Readonly<{ status: string }> | null) {
  return user && user.status === "ACTIVE";
}
