import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { skipToken } from "@tanstack/react-query";

export function AuthWatcher() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = Cookies.get("auth.token") || null;
    setToken(storedToken);
  }, []);

  const meQuery = trpc.auth.authMe.useQuery(
    token ? { token } : skipToken,
    {
      refetchOnWindowFocus: true,
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
