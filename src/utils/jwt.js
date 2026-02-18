export function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id;
  } catch (e) {
    return null;
  }
}
