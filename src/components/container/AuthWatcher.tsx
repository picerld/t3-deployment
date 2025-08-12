// src/components/AuthWatcher.tsx
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function AuthWatcher() {
  const router = useRouter();
  const meQuery = trpc.auth.authMe.useQuery(undefined, {
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.error?.data?.code === "UNAUTHORIZED") {
      // router.push("/login");
      return;
    }
  }, [meQuery.error, router]);

  return null;
}
