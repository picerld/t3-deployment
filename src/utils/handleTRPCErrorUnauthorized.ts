import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

let isRedirecting = false;

export function handleTrpcErroruNauthorized(
  error: TRPCClientErrorLike<AppRouter> | null | undefined,
) {
  if (!error) return;

  if (error.data?.code === "UNAUTHORIZED") {
    toast.error("Session expired!", {
      id: "auth-error",
      description: "Mohon login kembali!!",
    });

    if (!isRedirecting) {
      isRedirecting = true;
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  } else {
    toast.error(error.message, { id: "general-error" });
  }
}
