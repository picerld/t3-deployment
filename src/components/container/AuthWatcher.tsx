import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { skipToken } from "@tanstack/react-query";

export function AuthWatcher() {
  const router = useRouter();
  const token = Cookies.get("auth.token") || null;

  const meQuery = trpc.auth.authMe.useQuery(
    token ? { token } : skipToken,
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    if ((meQuery.error?.data?.code === "UNAUTHORIZED" || !token) && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [meQuery.error, token, router]);

  return null;
}
