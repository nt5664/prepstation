export function isSuperuser(user: Readonly<{ role: string }> | null) {
  return user && user.role !== "USER";
}

export function isUserActive(user: Readonly<{ status: string }> | null) {
  return user && user.status === "ACTIVE";
}
