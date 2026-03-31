"use client";

import { useEffect } from "react";
import { parseCookies } from "nookies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, fetchUserProfile } from "@/store/authSlice";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const { accessToken } = parseCookies();
    if (accessToken) {
      // Always fetch fresh full profile on app load (cookie-persisted session)
      dispatch(fetchUserProfile());
    } else if (isAuthenticated) {
      // Cookie is gone (expired/cleared) but Redux still has user → clear stale state
      dispatch(clearAuth());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
