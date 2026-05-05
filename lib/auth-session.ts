const USER_AUTH_SYNC_KEY = "user_auth_sync";
const USER_AUTH_TOKEN_KEYS = ["user_access_token", "accessToken", "token"] as const;

export type UserAuthAction = "login" | "logout";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitUserAuthChange(action: UserAuthAction) {
  if (!isBrowser()) return;
  localStorage.setItem(USER_AUTH_SYNC_KEY, JSON.stringify({ action, at: Date.now() }));
}

export function getUserAccessToken(): string | null {
  if (!isBrowser()) return null;
  return (
    localStorage.getItem("user_access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
}

export function setUserAccessToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem("user_access_token", token);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("token");
  emitUserAuthChange("login");
}

export function clearUserAuthSession() {
  if (!isBrowser()) return;
  USER_AUTH_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  emitUserAuthChange("logout");
}

export function subscribeUserAuthChanges(onChange: (action: UserAuthAction) => void) {
  if (!isBrowser()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === USER_AUTH_SYNC_KEY && event.newValue) {
      try {
        const payload = JSON.parse(event.newValue) as { action?: unknown };
        if (payload.action === "login" || payload.action === "logout") {
          onChange(payload.action);
        }
      } catch {
        // Ignore malformed cross-tab messages.
      }
      return;
    }

    if (event.key === null || USER_AUTH_TOKEN_KEYS.some((key) => key === event.key)) {
      onChange(getUserAccessToken() ? "login" : "logout");
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
