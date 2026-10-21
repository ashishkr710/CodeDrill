/**
 * AuthInitializer — attempts a silent token refresh on mount.
 *
 * On first load, we hit /auth/refresh (uses the HttpOnly cookie).
 * If the cookie is valid the user is seamlessly restored;
 * if not (cookie missing / expired) the store stays logged-out.
 * Either way `isInitialized` is set to true so the router can render.
 */
import { useEffect, useRef } from "react";
import { authApiService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
  const { setAccessToken, setInitialized, isInitialized } = useAuthStore();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current || isInitialized) return;
    attempted.current = true;

    (async () => {
      try {
        const { accessToken } = await authApiService.refresh();
        setAccessToken(accessToken);
      } catch {
        // No valid session — stay logged-out silently
      } finally {
        setInitialized();
      }
    })();
  }, [isInitialized, setAccessToken, setInitialized]);

  return <>{children}</>;
}
