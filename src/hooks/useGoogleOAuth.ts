// Small hook that starts Google OAuth and reads the callback params back into app state.
import { useCallback, useEffect, useState } from "react";
import type { createClient } from "@buildcalendar/sdk";

export function useGoogleOAuth({
  client,
  callbackPath,
}: {
  client: ReturnType<typeof createClient>;
  callbackPath: string;
}) {
  // Initialize from localStorage if available
  const [externalUserId, setExternalUserId] = useState<string | null>(() => {
    return localStorage.getItem("buildcalendar_external_user_id");
  });
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGoogleSignIn = useCallback(async () => {
    const userId = "user_" + Math.random().toString(36).substring(7);
    setIsSigningIn(true);
    setError(null);

    try {
      const { url } = await client.google.getAuthUrl({
        externalUserId: userId,
        callbackUrl: window.location.origin + callbackPath,
      });

      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setIsSigningIn(false);
    }
  }, [client, callbackPath]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const oauthError = params.get("error");
    const userId = params.get("external_user_id");

    if (success === "true" && userId) {
      // Store in localStorage for persistence
      localStorage.setItem("buildcalendar_external_user_id", userId);
      setExternalUserId(userId);
      window.history.replaceState({}, "", window.location.pathname);
      setIsSigningIn(false);
      return;
    }

    if (oauthError) {
      setError(`Google sign-in failed: ${oauthError}`);
      setIsSigningIn(false);
    }
  }, []);

  return { externalUserId, isSigningIn, error, startGoogleSignIn };
}
